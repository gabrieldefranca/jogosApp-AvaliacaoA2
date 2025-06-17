import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './Tabs';
import GameDetails from '../screens/GameDetails';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="GameDetails" component={GameDetails} options={{ title: 'Detalhes do Jogo' }} />
    </Stack.Navigator>
  );
}
