import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useState } from 'react';
import { SefariaTextPage } from './SefariaTextPage';

export default function App() {
  const [size, setSize] = useState(12);
  const textStyle = {fontSize: size};
  return (
    <View style={styles.container}>
      {/* <View style={styles.tools}>
          <AntDesign name="pluscircleo" size={36} color="black" onPress={() => setSize(size+1)}/>
          <AntDesign name="minuscircleo" size={36} color="black" onPress={() => setSize(size-1)}/>
      </View> */}
      <SefariaTextPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  tools: {
    flex: 1,
    flexDirection: 'row',
    height: 16,
    marginTop: 10,
  }
});
