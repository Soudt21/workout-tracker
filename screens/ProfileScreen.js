import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../services/authService';

export default function ProfileScreen({ navigation }) {
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
    await logoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
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
  );
}

const styles = StyleSheet.create({
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
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});
