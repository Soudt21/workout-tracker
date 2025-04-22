// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const currentUser = await AsyncStorage.getItem('@current_user');
      if (currentUser) {
        setUser(JSON.parse(currentUser));
      }
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user_logged_in');
    await AsyncStorage.removeItem('@current_user');
    if (onLogout) {
      onLogout(); // ✅ triggers logout callback passed from NavigationWrapper
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>User Profile</Text>

          {loading ? (
            <Text style={styles.label}>Loading profile...</Text>
          ) : user ? (
            <>
              <Text style={styles.label}>Name: {user.firstName} {user.lastName}</Text>
              <Text style={styles.label}>Email: {user.email || 'N/A'}</Text>
              <Text style={styles.label}>Age: {user.age || 'N/A'}</Text>
              <Text style={styles.label}>Height: {user.height || 'N/A'}</Text>
              <Text style={styles.label}>Weight: {user.weight || 'N/A'}</Text>
            </>
          ) : (
            <Text style={styles.label}>No profile data found.</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Logout" color="red" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: '#000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});
