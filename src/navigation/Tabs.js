import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Favorites from '../screens/Favorites';
import Dashboard from '../screens/Dashboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'gamepad-variant';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Dashboard') iconName = 'chart-bar';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoritos" component={Favorites} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
}