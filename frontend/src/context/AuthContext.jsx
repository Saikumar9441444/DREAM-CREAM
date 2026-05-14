import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

import { ENDPOINTS, API_BASE } from '../api/config';

import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const API_AUTH = `${API_BASE}/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('dream_cream_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === 'admin');
        }
      } catch (err) {
        console.error("Corrupted session cleared:", err);
        localStorage.removeItem('dream_cream_user');
        localStorage.removeItem('dream_cream_token');
      }
    }
    setLoading(false);
  }, []);

  const trackVisit = async (userData) => {
    try {
      await fetch(ENDPOINTS.VISITORS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          displayName: userData.displayName
        })
      });
    } catch (err) {
      console.error("Visit tracking failed:", err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Hardcoded admin bypass
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === 'saikumar89515@gmail.com') {
        const adminUser = {
          email: 'saikumar89515@gmail.com',
          displayName: 'Admin Saikumar',
          role: 'admin',
          _id: 'admin_static_id'
        };
        localStorage.setItem('dream_cream_user', JSON.stringify(adminUser));
        localStorage.setItem('dream_cream_token', 'mock-jwt-token-saikumar');
        setUser(adminUser);
        setIsAdmin(true);
        return { success: true };
      }

      const response = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('dream_cream_user', JSON.stringify(data));
        localStorage.setItem('dream_cream_token', data.token);
        
        setUser(data);
        setIsAdmin(data.role === 'admin');
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_AUTH}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('dream_cream_user', JSON.stringify(data));
        localStorage.setItem('dream_cream_token', data.token);
        
        setUser(data);
        setIsAdmin(data.role === 'admin');
        return { success: true };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Register Error:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
    localStorage.removeItem('dream_cream_user');
    localStorage.removeItem('dream_cream_token');
    setUser(null);
    setIsAdmin(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Verify with our backend
      const response = await fetch(`${API_AUTH}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('dream_cream_user', JSON.stringify(data));
        localStorage.setItem('dream_cream_token', data.token);
        
        setUser(data);
        setIsAdmin(data.role === 'admin');
        await trackVisit(data);
        return { success: true };
      } else {
        throw new Error(data.message || 'Google verification failed');
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
