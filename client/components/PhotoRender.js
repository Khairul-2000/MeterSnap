import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function PhotoRender({ pickImage, takeImage }) {
  return (
    <View>
      <View>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="image" size={32} color="white" />
          <Text style={{ color: 'white' }}>Choose a Photo</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={takeImage}>
          <Ionicons name="camera" size={32} color="white" />
          <Text style={{ color: 'white' }}>Take a Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: 200,
    minWidth: 200,
  },
});
