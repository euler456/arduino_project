// src/services/MockBluetoothService.js
import BluetoothServiceInterface from './BluetoothServiceInterface';

export default class MockBluetoothService extends BluetoothServiceInterface {
  constructor() {
    super();
    this._connected = false;
  }

  async connect() {
    console.log('[MockBT] connecting...');
    await new Promise(r => setTimeout(r, 300));
    this._connected = true;
    console.log('[MockBT] connected');
    return true;
  }

  async disconnect() {
    console.log('[MockBT] disconnecting...');
    await new Promise(r => setTimeout(r, 100));
    this._connected = false;
  }

  async send(command) {
    console.log('[MockBT] send:', command);
    // 模擬接收/回覆：例如收到 F 時 console 顯示
    if (!this._connected) throw new Error('Not connected');
    // 你可以在這裡模擬延遲或回傳
    await new Promise(r => setTimeout(r, 50));
    return true;
  }

  isConnected() { return this._connected; }
}
