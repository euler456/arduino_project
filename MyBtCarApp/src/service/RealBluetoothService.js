// src/services/RealBluetoothService.js
import BluetoothServiceInterface from './BluetoothServiceInterface';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { PermissionsAndroid, Platform } from 'react-native';

const SPP_UUID = '00001101-0000-1000-8000-00805F9B34FB'; // RFCOMM UUID (info only)

export default class RealBluetoothService extends BluetoothServiceInterface {
  constructor() {
    super();
    this.device = null;
    this.conn = null;
  }

  async ensurePermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      // Android 12+ (S): BLUETOOTH_CONNECT / BLUETOOTH_SCAN via native manifests; runtime for CONNECT on request
      // We'll still request coarse location fallback for older Android if needed.
      // Use PermissionsAndroid for ACCESS_FINE_LOCATION on older versions:
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          { title: 'Location permission for Bluetooth', message: 'Needed to find Bluetooth devices' }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  async connect() {
    try {
      const ok = await this.ensurePermissions();
      if (!ok) throw new Error('Permissions denied');

      // 取得已配對裝置列表
      const devices = await RNBluetoothClassic.getBondedDevices();
      // 找名字含 HC-05 或 HC05 的裝置
      const hc = devices.find(d => (d.name || '').toUpperCase().includes('HC-05') || (d.name || '').toUpperCase().includes('HC05'));
      if (!hc) throw new Error('HC-05 not paired. Pair in system settings.');

      this.device = hc;
      // connect by id (library handles SPP internally)
      this.conn = await RNBluetoothClassic.connect(hc.id);
      console.log('[RealBT] connected to', hc.name);
      return true;
    } catch (e) {
      console.warn('[RealBT] connect failed', e);
      throw e;
    }
  }

  async disconnect() {
    try {
      if (this.conn) {
        await RNBluetoothClassic.disconnect();
        this.conn = null;
        this.device = null;
      }
    } catch (e) {
      console.warn('[RealBT] disconnect', e);
    }
  }

  async send(command) {
    if (!this.conn && !this.device) throw new Error('Not connected');
    // 簡單寫入（string）
    await RNBluetoothClassic.write(command);
  }

  isConnected() {
    return !!this.conn;
  }
}
