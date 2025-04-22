// screens/WelcomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomePage() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@current_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user?.firstName) {
          setFirstName(user.firstName);
        }
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Welcome, {firstName || 'User'}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
});
