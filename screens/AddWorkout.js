import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddWorkout() {
  const [muscle, setMuscle] = useState('');
  const [type, setType] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  // store ISO format
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const saveWorkout = async () => {
    if (!muscle || !type || !weight || !date) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || !isFinite(parsedWeight)) {
      Alert.alert('Invalid weight', 'Please enter a valid number.');
      return;
    }

    const newWorkout = {
      muscle,
      type,
      weight: parsedWeight,
      unit,
      sets,
      reps,
      date,  // ISO stored
    };

    try {
      const storedData = await AsyncStorage.getItem('@workouts');
      const workouts = storedData ? JSON.parse(storedData) : [];
      workouts.push(newWorkout);
      await AsyncStorage.setItem('@workouts', JSON.stringify(workouts));
      Alert.alert('Workout added!');
      // reset form
      setMuscle('');
      setType('');
      setWeight('');
      setUnit('lbs');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setSets('');
      setReps('');
    } catch (e) {
      Alert.alert('Error saving workout', e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Muscle Category</Text>
          <Picker
            selectedValue={muscle}
            onValueChange={setMuscle}
            style={styles.input}
          >
            <Picker.Item label="Select a muscle group" value="" />
            <Picker.Item label="Chest" value="Chest" />
            <Picker.Item label="Back" value="Back" />
            <Picker.Item label="Legs" value="Legs" />
            <Picker.Item label="Arms" value="Arms" />
            <Picker.Item label="Shoulders" value="Shoulders" />
            <Picker.Item label="Core" value="Core" />
          </Picker>

          <Text style={styles.label}>Workout Type</Text>
          <TextInput
            placeholder="e.g., Bench Press"
            value={type}
            onChangeText={setType}
            style={styles.input}
          />

          <Text style={styles.label}>Sets</Text>
          <TextInput
            placeholder="e.g., 3"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
            style={styles.input}
          />

          <Text style={styles.label}>Reps</Text>
          <TextInput
            placeholder="e.g., 8"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            style={styles.input}
          />

          <Text style={styles.label}>Total Weight</Text>
          <View style={styles.weightRow}>
            <TextInput
              placeholder="e.g., 185"
              keyboardType="numeric"
              value={weight}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                const safeText =
                  parts.length > 2
                    ? parts[0] + '.' + parts.slice(1).join('')
                    : cleaned;
                setWeight(safeText);
              }}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />

            <View style={styles.unitToggle}>
              <Text
                style={[styles.unitOption, unit === 'lbs' && styles.unitSelected]}
                onPress={() => setUnit('lbs')}
              >
                lbs
              </Text>
              <Text
                style={[styles.unitOption, unit === 'kg' && styles.unitSelected]}
                onPress={() => setUnit('kg')}
              >
                kg
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />

          <View style={{ marginTop: 20 }}>
            <Button title="Add Workout" onPress={saveWorkout} color="#000" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, flexGrow: 1, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 16, color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    marginTop: 4,
    borderRadius: 6,
    color: '#000',
  },
  weightRow: { flexDirection: 'row', alignItems: 'center' },
  unitToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    height: 42,
    minWidth: 100,
  },
  unitOption: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
    fontWeight: '600',
    fontSize: 16,
    backgroundColor: '#eee',
    color: '#333',
  },
  unitSelected: { backgroundColor: '#000', color: '#fff' },
});
