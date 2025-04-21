// screens/RegisterScreen.js
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

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    const storedUsers = await AsyncStorage.getItem('@users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const duplicate = users.find((u) => u.email === email.trim().toLowerCase());
    if (duplicate) {
      Alert.alert('Email Exists', 'This email is already registered');
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      password,
      age,
      height,
      weight,
    };

    users.push(newUser);
    await AsyncStorage.setItem('@users', JSON.stringify(users));

    Alert.alert('Success', 'Account created successfully');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1 }]}
        />
        <Button
          title={showPassword ? 'Hide' : 'Show'}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />
      <TextInput
        placeholder={"Height (e.g. 5'8\")"}
        value={height}
        onChangeText={setHeight}
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (lbs or kg)"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
      />

      <Button title="Register" onPress={register} color="#000" />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});
