// screens/WorkoutHistory.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      setWorkouts(data.reverse());
    } catch (e) {
      console.error('Failed to load workouts:', e);
    }
  };

  const clearWorkouts = async () => {
    Alert.alert('Clear Workout History', 'Are you sure you want to delete all workouts?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('@workouts');
          loadWorkouts();
        },
        style: 'destructive',
      },
    ]);
  };

  const filteredWorkouts =
    selectedMuscle === 'All'
      ? workouts
      : workouts.filter((item) => item.muscle === selectedMuscle);

  const renderItem = ({ item }) => (
    <View style={styles.itemBox}>
      <Text style={styles.date}>{item.date}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      <TouchableOpacity style={styles.clearButtonTop} onPress={clearWorkouts}>
        <Text style={styles.clearButtonText}>Clear Workouts</Text>
      </TouchableOpacity>

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
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
    </SafeAreaView>
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
    marginBottom: 12,
    textAlign: 'center',
  },
  clearButtonTop: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  subInfo: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
});
