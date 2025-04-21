// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    const storedUsers = await AsyncStorage.getItem('@users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userMatch = users.find((u) => u.email === email && u.password === password);

    if (userMatch) {
      await AsyncStorage.setItem('@user_logged_in', 'true');
      await AsyncStorage.setItem('@current_user', JSON.stringify(userMatch));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={login} color="#000" />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
  console.log('🔍 Stored users:', users);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  link: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});
