// /services/authService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const SESSION_KEY = '@user_logged_in';
const CURRENT_USER_KEY = '@current_user';

// Register a new user
export async function registerUser(user) {
  const usersRaw = await AsyncStorage.getItem(USERS_KEY);
  const users = usersRaw ? JSON.parse(usersRaw) : [];

  const exists = users.find(u => u.email === user.email);
  if (exists) return { success: false, message: 'Email already registered' };

  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(SESSION_KEY, 'true');

  return { success: true };
}

// Login
export async function loginUser(email, password) {
  const usersRaw = await AsyncStorage.getItem(USERS_KEY);
  const users = usersRaw ? JSON.parse(usersRaw) : [];

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Invalid credentials' };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(SESSION_KEY, 'true');
  return { success: true, user };
}

// Is logged in?
export async function isUserLoggedIn() {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return session === 'true';
}

// Get current user
export async function getCurrentUser() {
  const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Logout
export async function logoutUser() {
  await AsyncStorage.multiRemove([SESSION_KEY, CURRENT_USER_KEY]);
}
