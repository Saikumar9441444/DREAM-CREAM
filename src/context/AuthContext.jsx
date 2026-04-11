import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const API_ROOT = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored token on mount
    const storedUser = localStorage.getItem('dream_cream_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const resp = await fetch(`${API_ROOT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await resp.json();
    
    if (resp.ok) {
      localStorage.setItem('dream_cream_token', data.token);
      localStorage.setItem('dream_cream_user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAdmin(data.user.role === 'admin');
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('dream_cream_token');
    localStorage.removeItem('dream_cream_user');
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
