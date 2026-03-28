import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@CRM:user');
    const token = localStorage.getItem('@CRM:token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('@CRM:user', JSON.stringify(user));
    localStorage.setItem('@CRM:token', token);
    
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('@CRM:user');
    localStorage.removeItem('@CRM:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signed: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
