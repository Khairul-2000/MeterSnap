import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function Prediction({ route, navigation }) {
  const { imagePath, reading } = route.params;
  console.log('imagePath:', imagePath);
  return (
    <View style={styles.container}>
      {imagePath !== 'http://192.168.0.108:3000' ? (
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}
          >
            Predicted Image
          </Text>
          <Image source={{ uri: imagePath }} style={styles.image} />
        </View>
      ) : (
        <View>
          <Image source={require('../assets/meter.jpg')} style={styles.image} />
          <Text
            style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}
          >
            No Meter Recognized. Try Again with Meter Image!
          </Text>
        </View>
      )}
      {reading !== '' ? (
        <Text style={styles.reading}>
          Meter Reading: <Text style={styles.meter}>{reading} </Text>
          kwh
        </Text>
      ) : (
        <Text style={styles.reading}>Meter reading not available </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 450,
    margin: 10,
    borderRadius: 10,
  },
  reading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  meter: {
    color: 'green',
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
