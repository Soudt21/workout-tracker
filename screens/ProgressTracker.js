// screens/ProgressTracker.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressTracker({ navigation }) {
  const [progressData, setProgressData] = useState([]);

  const goals = {
    Chest: 225,
    Back: 275,
    Legs: 400,
    Arms: 100,
    Shoulders: 150,
    Core: 120,
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const stored = await AsyncStorage.getItem('@workouts');
    const workouts = stored ? JSON.parse(stored) : [];

    const highestPerMuscle = {};

    workouts.forEach((w) => {
      if (!w.muscle || isNaN(parseFloat(w.weight))) return;

      const weight = parseFloat(w.weight);
      const muscle = w.muscle;
      if (!highestPerMuscle[muscle] || weight > highestPerMuscle[muscle].weight) {
        highestPerMuscle[muscle] = { weight, unit: w.unit || 'lbs' };
      }
    });

    const progressArray = Object.keys(goals).map((muscle) => {
      const maxLift = highestPerMuscle[muscle]?.weight || 0;
      const unit = highestPerMuscle[muscle]?.unit || 'lbs';
      const goal = goals[muscle];
      const progress = Math.min(maxLift / goal, 1); // Cap at 100%
      return {
        muscle,
        maxLift,
        unit,
        goal,
        progress,
      };
    });

    setProgressData(progressArray);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress Toward Your Goals</Text>

      {progressData.map((item) => (
        <View key={item.muscle} style={styles.barContainer}>
          <Text style={styles.label}>
            {item.muscle}: {item.maxLift} / {item.goal} {item.unit}
          </Text>
          <ProgressBar
            progress={item.progress}
            color={getBarColor(item.progress)}
            style={styles.progressBar}
          />
          <Text style={styles.percent}>{Math.round(item.progress * 100)}%</Text>
        </View>
      ))}
      <View style={{ marginTop: 30 }}>
  <Button
    title="⚙️ Edit Goal Settings"
    onPress={() => navigation.navigate('Goal Settings')}
    color="#444"
  />
</View>
    </ScrollView>
        </SafeAreaView>
  );
}

const getBarColor = (progress) => {
  if (progress < 0.5) return '#e74c3c';     // red
  if (progress < 0.9) return '#f39c12';     // yellow
  return '#2ecc71';                         // green
};

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
  barContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  percent: {
    marginTop: 4,
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 14,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
});
