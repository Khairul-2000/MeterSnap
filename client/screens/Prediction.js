import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function Prediction({ route, navigation }) {
  const { imagePath, reading } = route.params;
  console.log('imagePath:', imagePath);
  return (
    <View style={styles.container}>
      <Text style={styles.reading}>Predicted Image</Text>
      <View>
        <Image source={{ uri: imagePath }} style={styles.image} />
      </View>
      {reading !== null ? (
        <Text style={styles.reading}>Meter Reading: {reading} kwh</Text>
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
    width: 350,
    height: 500,
    margin: 10,
  },
  reading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
