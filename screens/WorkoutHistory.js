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
import { format, parseISO, isValid } from 'date-fns';

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

  const clearWorkouts = () =>
    Alert.alert(
      'Clear Workout History',
      'Are you sure you want to delete all workouts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@workouts');
            loadWorkouts();
          },
        },
      ],
      { cancelable: true }
    );

  const handleDelete = async indexToDelete => {
    const updated = workouts.filter((_, i) => i !== indexToDelete);
    await AsyncStorage.setItem('@workouts', JSON.stringify(updated));
    setWorkouts(updated);
  };

  // Filter by muscle if needed
  const filtered =
    selectedMuscle === 'All'
      ? workouts
      : workouts.filter(w => w.muscle === selectedMuscle);

  // Group by date
  const groupedByDate = filtered.reduce((acc, w, i) => {
    const dateObj = parseISO(w.date);
    const displayDate = isValid(dateObj)
      ? format(dateObj, 'MM-dd-yyyy')
      : w.date;
    if (!acc[displayDate]) acc[displayDate] = [];
    acc[displayDate].push({ ...w, index: i });
    return acc;
  }, {});

  // Render each date group
  const renderDateGroup = ([date, items]) => (
    <View key={date} style={styles.group}>
      <Text style={styles.dateHeader}>{date}</Text>
      {items.map(item => (
        <View key={item.index} style={styles.entry}>
          <Text style={styles.muscle}>{item.muscle}</Text>
          <Text style={styles.type}>{item.type}</Text>
          {item.sets && item.reps && (
            <Text style={styles.sub}>{item.sets} sets × {item.reps} reps</Text>
          )}
          <Text style={styles.weight}>{item.weight} {item.unit}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => Alert.alert('Edit feature coming soon')}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.index)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      <TouchableOpacity style={styles.clearBtn} onPress={clearWorkouts}>
        <Text style={styles.clearText}>Clear Workouts</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={selectedMuscle}
        onValueChange={setSelectedMuscle}
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

      {Object.keys(groupedByDate).length === 0 ? (
        <Text style={styles.empty}>No workouts logged yet.</Text>
      ) : (
        <FlatList
          data={Object.entries(groupedByDate)}
          keyExtractor={([date]) => date}
          renderItem={({ item }) => renderDateGroup(item)}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:20 },
  title: { fontSize:22, fontWeight:'bold', textAlign:'center', marginBottom:12 },
  clearBtn: { backgroundColor:'#000', padding:12, borderRadius:6, marginBottom:20 },
  clearText: { color:'#fff', textAlign:'center', fontWeight:'bold' },
  picker: { height:50, marginBottom:20 },
  empty: { textAlign:'center', marginTop:40, color:'#888' },
  group: { marginBottom:24 },
  dateHeader: { fontSize:16, fontWeight:'bold', color:'#000', marginBottom:8 },
  entry: { borderBottomWidth:1, borderBottomColor:'#ccc', paddingVertical:8 },
  muscle: { fontSize:14, fontWeight:'600', color:'#000' },
  type: { fontSize:14, color:'#555', marginTop:4 },
  sub: { fontSize:13, color:'#333', marginTop:2 },
  weight: { fontSize:14, fontWeight:'bold', color:'#000', marginTop:4 },
  actions: { flexDirection:'row', marginTop:8 },
  edit: { color:'#007bff', marginRight:12 },
  delete: { color:'red' },
});
