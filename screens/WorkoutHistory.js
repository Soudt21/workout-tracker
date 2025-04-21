// screens/WorkoutHistory.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('All');

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

  const clearWorkouts = async () => {
    await AsyncStorage.removeItem('@workouts');
    loadWorkouts();
  };

  const filteredWorkouts =
    selectedMuscle === 'All'
      ? workouts
      : workouts.filter(item => item.muscle === selectedMuscle);

      const renderItem = ({ item }) => (
        <View style={styles.itemBox}>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString('en-US')}
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.muscle}>{item.muscle}</Text>
            <Text style={styles.weight}>
              {item.weight} {item.unit || 'lbs'}
            </Text>
          </View>
          <Text style={styles.type}>{item.type}</Text>
      
          {item.sets && item.reps && (
            <Text style={styles.subInfo}>
              {item.sets} sets × {item.reps} reps
            </Text>
          )}
        </View>
      );
      

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      <View style={styles.filterRow}>
        <Picker
          selectedValue={selectedMuscle}
          onValueChange={(value) => setSelectedMuscle(value)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Chest" value="Chest" />
          <Picker.Item label="Back" value="Back" />
          <Picker.Item label="Legs" value="Legs" />
          <Picker.Item label="Arms" value="Arms" />
          <Picker.Item label="Shoulders" value="Shoulders" />
          <Picker.Item label="Core" value="Core" />
        </Picker>
      </View>

      <FlatList
        data={filteredWorkouts}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No workouts logged yet.</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.clearButton} onPress={clearWorkouts}>
        <Text style={styles.clearButtonText}>Clear Workouts</Text>
      </TouchableOpacity>
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  itemBox: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  date: {
    fontSize: 14,
    color: '#333',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  clearButton: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subInfo: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  
});
