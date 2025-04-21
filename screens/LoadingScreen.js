import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('@user_logged_in');
      navigation.replace(isLoggedIn ? 'Welcome' : 'Login');
    };
    checkLogin();
    console.log('Checking login state...');

  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}