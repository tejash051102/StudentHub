import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('student_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('student_token', data.token);
    localStorage.setItem('student_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  }

  function logout() {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    setUser(null);
  }

  function updateUser(nextUser) {
    localStorage.setItem('student_user', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  const value = useMemo(
    () => ({ user, login, register, logout, updateUser, isAuthenticated: Boolean(user) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
