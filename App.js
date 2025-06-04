// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NavigationWrapper from './navigation/NavigationWrapper';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user_logged_in');
    await AsyncStorage.removeItem('@current_user');
    setLoggedIn(false); // 🔁 Triggers re-render to show login stack
  };

  React.useEffect(() => {
    const checkLogin = async () => {
      const status = await AsyncStorage.getItem('@user_logged_in');
      setLoggedIn(status === 'true');
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <Stack.Screen name="MainTabs">
          {() => <NavigationWrapper onLogout={handleLogout} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: 'Reset Password' }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
);

}
