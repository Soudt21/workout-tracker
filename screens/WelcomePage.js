// screens/WelcomePage.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Workout Tracker</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Add Workout')}
      >
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Progress Tracker')}
      >
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Workout History')}
      >
        <Text style={styles.buttonText}>Workout History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
