// screens/WorkoutHistory.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem('@workouts');
      const data = stored ? JSON.parse(stored) : [];
      setWorkouts(data.reverse()); // Show latest first
    } catch (e) {
      console.error('Failed to load workouts:', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.muscle}>{item.muscle}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.weight}>
  {item.weight} {item.unit || 'lbs'}
</Text>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      <FlatList
        data={workouts}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No workouts logged yet.</Text>}
      />
     <Button
  title="Clear Workouts (Reset)"
  onPress={async () => {
    await AsyncStorage.removeItem('@workouts');
    loadWorkouts(); // refresh view after clearing
  }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  date: {
    fontSize: 14,
    color: '#333',
  },
  muscle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  type: {
    fontSize: 14,
    color: '#555',
  },
  weight: {
    fontSize: 14,
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
});
