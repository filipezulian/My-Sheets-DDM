import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CharacterSheetScreen from './screens/CharacterSheetScreen';
import DiceRollingScreen from './screens/DiceRollingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CharacterSheet" component={CharacterSheetScreen} />
        <Stack.Screen name="DiceRolling" component={DiceRollingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
