import React, { useState } from 'react';
import {
  Button,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PhotoRender from '../components/PhotoRender';

export default function MeterSnap({ navigation }) {
  const [image, setImage] = useState(null);
  const [predictedImage, setPredictedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [reading, setReading] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('result:', result);
    console.log('uri:', result.assets[0].uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setName(result.assets[0].fileName);
    }
  };

  const takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image: ', result.assets[0].uri);
      console.log('Name: ', result.assets[0].fileName);
      const help = result.assets[0].fileName.split('-');
      console.log('Help:', help);
      setImage(result.assets[0].uri);
      setName(help[0] + 'image.jpg');
    }
  };

  const uploadImage = async () => {
    console.log('uploading image');
    if (!image) return;

    const formData = new FormData();
    formData.append('imageFile', {
      uri: image,
      type: 'image/jpeg',
      name: name,
    });

    try {
      setLoading(true);
      const result = await fetch('http://192.168.0.108:3000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const resultData = await result.json();

      setPredictedImage(`http://192.168.0.108:3000${resultData.image_url}`);
      setReading(resultData.reading);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PhotoRender pickImage={pickImage} takeImage={takeImage} />

      {image && (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Upload Image" onPress={uploadImage} />
        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {predictedImage !== null ? (
        <View>
          <Image source={{ uri: predictedImage }} style={styles.image} />
        </View>
      ) : (
        <Text style={styles.message}>No image available</Text>
      )}

      {reading !== null ? (
        <Text style={styles.reading}>Meter Reading: {reading} kwh</Text>
      ) : (
        <Text style={styles.reading}>Meter reading not available </Text>
      )}
      {/* <Text style={styles.reading}>Meter Reading: {reading} kwh</Text> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Prediction', {
            imagePath: predictedImage,
            reading: reading,
          });
        }}
      >
        <Text>Result</Text>
      </TouchableOpacity>
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
    width: 200,
    height: 200,
    margin: 10,
  },

  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: 200,
    minWidth: 200,
  },
  reading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
