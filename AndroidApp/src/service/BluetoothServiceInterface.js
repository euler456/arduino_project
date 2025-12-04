// src/services/BluetoothServiceInterface.js
export default class BluetoothServiceInterface {
  async connect() { throw new Error('not implemented'); }
  async disconnect() { throw new Error('not implemented'); }
  async send(command) { throw new Error('not implemented'); }
  isConnected() { return false; }
}
