// App.js (放在專案根或 src/)
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import MockBluetoothService from './src/services/MockBluetoothService';
import RealBluetoothService from './src/services/RealBluetoothService';

// 開發期使用 mock；實際測試時把 btService 換成 new RealBluetoothService()
const useMock = true; // <- 開發先用 true，硬體到手改成 false

const btService = useMock ? new MockBluetoothService() : new RealBluetoothService();

export default function App() {
  const [connected, setConnected] = useState(btService.isConnected());
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    setConnected(btService.isConnected());
  }, []);

  const doConnect = async () => {
    try {
      setStatus('Connecting...');
      await btService.connect();
      setConnected(true);
      setStatus('Connected');
    } catch (e) {
      setStatus('Connect failed: ' + (e.message || e));
      Alert.alert('Connect failed', (e.message || String(e)));
    }
  };

  const doDisconnect = async () => {
    await btService.disconnect();
    setConnected(false);
    setStatus('Disconnected');
  };

  const send = async (cmd) => {
    try {
      await btService.send(cmd);
      setStatus('Sent: ' + cmd.trim());
    } catch (e) {
      setStatus('Send failed: ' + (e.message || e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BT Car Controller</Text>
      <Text>Status: {status}</Text>
      <View style={{height:12}} />
      <Button title={connected ? "Disconnect" : "Connect"} onPress={connected ? doDisconnect : doConnect} />
      <View style={{height:12}} />
      <View style={styles.row}>
        <Button title="F" onPress={() => send('F\n')} />
        <Button title="L" onPress={() => send('L\n')} />
        <Button title="S" onPress={() => send('S\n')} />
        <Button title="R" onPress={() => send('R\n')} />
        <Button title="B" onPress={() => send('B\n')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:8 },
  row: { flexDirection:'row', justifyContent:'space-between', marginTop:16 }
});
