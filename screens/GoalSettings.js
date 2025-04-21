// screens/GoalSettings.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultGoals = {
  Chest: 225,
  Back: 275,
  Legs: 400,
  Arms: 100,
  Shoulders: 150,
  Core: 120,
};

export default function GoalSettings({ navigation }) {
  const [goals, setGoals] = useState(defaultGoals);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const stored = await AsyncStorage.getItem('@goals');
    const parsed = stored ? JSON.parse(stored) : defaultGoals;
    setGoals(parsed);
  };

  const saveGoals = async () => {
    await AsyncStorage.setItem('@goals', JSON.stringify(goals));
    Alert.alert('Saved', 'Your goals have been updated.');
    navigation.goBack(); // return to progress page
  };

  const updateGoal = (muscle, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const numeric = parseFloat(cleanValue);
    setGoals(prev => ({
      ...prev,
      [muscle]: isNaN(numeric) ? 0 : numeric,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Goals</Text>

      {Object.keys(goals).map((muscle) => (
        <View key={muscle} style={styles.inputRow}>
          <Text style={styles.label}>{muscle}</Text>
          <TextInput
            keyboardType="numeric"
            value={goals[muscle].toString()}
            onChangeText={(value) => updateGoal(muscle, value)}
            style={styles.input}
          />
        </View>
      ))}

      <View style={{ marginTop: 20 }}>
        <Button title="Save Goals" onPress={saveGoals} color="#000" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  label: {
    width: 100,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
