import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPasswordScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState(1); // 1 = enter id, 2 = enter new pw
  const [newPassword, setNewPassword] = useState('');

  // 1. Check if user exists
  const handleFindUser = async () => {
    if (!identifier.trim()) {
      Alert.alert('Required', 'Please enter your email or username.');
      return;
    }
    const usersJson = await AsyncStorage.getItem('@users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const found = users.find(
      u =>
        u.email?.toLowerCase() === identifier.trim().toLowerCase() ||
        u.username?.toLowerCase() === identifier.trim().toLowerCase()
    );
    if (!found) {
      Alert.alert('Not found', 'No user with that email or username.');
      return;
    }
    setStep(2);
  };

  // 2. Reset the password
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Required', 'Please enter a new password.');
      return;
    }
    const usersJson = await AsyncStorage.getItem('@users');
    let users = usersJson ? JSON.parse(usersJson) : [];
    users = users.map(u => {
      if (
        u.email?.toLowerCase() === identifier.trim().toLowerCase() ||
        u.username?.toLowerCase() === identifier.trim().toLowerCase()
      ) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    await AsyncStorage.setItem('@users', JSON.stringify(users));
    Alert.alert('Success', 'Password reset! You can now log in.');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Forgot Password?</Text>
      {step === 1 ? (
        <>
          <Text style={styles.subtitle}>Enter your email or username:</Text>
          <TextInput
            placeholder="Email or Username"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            style={styles.input}
          />
          <Button title="Next" onPress={handleFindUser} color="#000" />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter your new password:</Text>
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Reset Password" onPress={handleResetPassword} color="#000" />
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    color: '#000',
  },
});
