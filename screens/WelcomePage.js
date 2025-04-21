// screens/WelcomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomePage({ navigation }) {
  const [name, setName] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('@current_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setName(`${user.firstName}`);
      }
    };
    loadUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome back{name ? `, ${name}` : ''}!</Text>

      <View style={styles.buttonGroup}>
        <View style={styles.button}>
          <Button
            title="Add Workout"
            onPress={() => navigation.navigate('Add Workout')}
            color="#000"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="View Progress"
            onPress={() => navigation.navigate('Progress Tracker')}
            color="#000"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Workout History"
            onPress={() => navigation.navigate('Workout History')}
            color="#000"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 32,
  },
  buttonGroup: {
    gap: 20,
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
