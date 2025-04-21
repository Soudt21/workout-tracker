import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomePage from './screens/WelcomePage';
import ProfileScreen from './screens/ProfileScreen';
import AddWorkout from './screens/AddWorkout';
import WorkoutHistory from './screens/WorkoutHistory';
import ProgressTracker from './screens/ProgressTracker';
import GoalSettings from './screens/GoalSettings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen}  />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Goal Settings" component={GoalSettings} />
      <Stack.Screen
  name="Welcome"
  component={WelcomePage}
  options={({ navigation }) => ({
    headerRight: () => (
<TouchableOpacity
  onPress={() => navigation.navigate('Profile')}
  style={{ marginRight: 16 }}
>
  <Ionicons name="person-circle-outline" size={28} color="black" />
</TouchableOpacity>
    ),
  })}
/>
      <Stack.Screen name="Add Workout" component={AddWorkout} />
      <Stack.Screen name="Workout History" component={WorkoutHistory} />
      <Stack.Screen name="Progress Tracker" component={ProgressTracker} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
