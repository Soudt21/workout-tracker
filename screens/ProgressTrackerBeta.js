// screens/ProgressTracker.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressTracker() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    let workouts = [];
  
    try {
      const stored = await AsyncStorage.getItem('@workouts');
      workouts = stored ? JSON.parse(stored) : [];
  
      const dateTotals = {};
  
      workouts.forEach((w, i) => {
        const rawWeight = w.weight;
        const parsedWeight = parseFloat(rawWeight);
  
        if (!w.date || isNaN(parsedWeight) || !isFinite(parsedWeight)) {
          console.warn(`⚠️ Skipping invalid weight entry at index ${i}:`, w);
          return;
        }
  
        if (!dateTotals[w.date]) {
          dateTotals[w.date] = 0;
        }
        dateTotals[w.date] += parsedWeight;
      });
  
      const sortedDates = Object.keys(dateTotals).sort();
      const labels = sortedDates.map(d => d.slice(5)); // MM-DD
      const data = sortedDates.map(d => dateTotals[d]);
  
      console.log('📊 Final chart data:', { labels, data });
  
      setChartData({
        labels,
        datasets: [{ data }],
      });
    } catch (e) {
      console.error('Error loading chart data:', e);
    }
  };
  
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Strength Progress</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={250}
        yAxisSuffix=" lbs"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{
          borderRadius: 16,
          marginVertical: 16,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
});
