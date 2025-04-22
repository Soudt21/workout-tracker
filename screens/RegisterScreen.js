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
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
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
  
    const result = await registerUser(newUser);
  
    if (!result.success) {
      Alert.alert('Registration Error', result.message);
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
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

{/* Password */}
<View style={styles.inputWrapper}>
  <TextInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    style={styles.inputField}
  />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    style={styles.iconWrapper}
  >
    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#000" />
  </TouchableOpacity>
</View>

{/* Confirm Password */}
<View style={styles.inputWrapper}>
  <TextInput
    placeholder="Confirm Password"
    value={confirmPassword}
    onChangeText={setConfirmPassword}
    secureTextEntry={!showConfirm}
    style={styles.inputField}
  />
  <TouchableOpacity
    onPress={() => setShowConfirm(!showConfirm)}
    style={styles.iconWrapper}
  >
    <Ionicons name={showConfirm ? 'eye' : 'eye-off'} size={22} color="#000" />
  </TouchableOpacity>
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
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 6,
    paddingRight: 40, // space for the icon
    color: '#000',
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '35%',
  },
  link: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});
