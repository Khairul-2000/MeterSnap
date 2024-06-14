import React from 'react';
import MeterSnap from './screens/MeterSnap';
import Prediction from './screens/Prediction';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MeterSnap" component={MeterSnap} />
        <Stack.Screen name="Prediction" component={Prediction} />
      </Stack.Navigator>
      {/* <MeterSnap /> */}
    </NavigationContainer>
  );
}
