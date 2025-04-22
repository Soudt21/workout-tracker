// navigation/NavigationWrapper.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import AddWorkout from '../screens/AddWorkout';
import ProgressTracker from '../screens/ProgressTracker';
import WorkoutHistory from '../screens/WorkoutHistory';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomePage from '../screens/WelcomePage';

const Tab = createBottomTabNavigator();

export default function NavigationWrapper({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Welcome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Add Workout') {
            return <Ionicons name="add-circle-outline" size={size} color={color} />;
          } else if (route.name === 'Progress') {
            return <Feather name="bar-chart-2" size={size} color={color} />;
          } else if (route.name === 'History') {
            return <Feather name="file-text" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person-circle-outline" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Welcome" component={WelcomePage} />
      <Tab.Screen name="Add Workout" component={AddWorkout} />
      <Tab.Screen name="Progress" component={ProgressTracker} />
      <Tab.Screen name="History" component={WorkoutHistory} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
