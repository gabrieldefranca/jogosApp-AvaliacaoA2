import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../screens/Home';
import Details from '../screens/DetalhesGames';
import Favorites from '../screens/Favoritos';
import Dashboard from '../screens/Dashboard';
import Notes from '../screens/notas';
import NoteForm from '../screens/notasform';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#6200ee' }}>
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          title: 'Jogos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-pie" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={Notes}
        options={{
          title: 'Anotações',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="note-text" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={Details} options={{ title: 'Detalhes' }} />
        <Stack.Screen name="NoteForm" component={NoteForm} options={{ title: 'Anotação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
