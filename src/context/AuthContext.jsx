import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Static admin credentials for local-only mode
const ADMIN_USER = {
  email: 'saikumar89515@gmail.com',
  displayName: 'Admin Saikumar',
  role: 'admin'
};

const API_VISITORS = '/api/visitors';

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
          setIsAdmin(parsedUser.email.trim().toLowerCase() === ADMIN_USER.email);
        }
      } catch (err) {
        console.error("Corrupted session cleared:", err);
        localStorage.removeItem('dream_cream_user');
      }
    }
    setLoading(false);
  }, []);

  const trackVisit = async (userData) => {
    try {
      await fetch(API_VISITORS, {
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
      // PURE FRONTEND MOCK: Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const normalizedEmail = email.trim().toLowerCase();
      
      // Check if it matches the hardcoded admin
      if (normalizedEmail === ADMIN_USER.email) {
        const userObj = { ...ADMIN_USER };
        localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
        localStorage.setItem('dream_cream_token', 'mock-jwt-token-saikumar');
        
        setUser(userObj);
        setIsAdmin(true);
        return { success: true };
      } else {
        throw new Error('Invalid credentials. For evaluation, use: ' + ADMIN_USER.email);
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dream_cream_user');
    setUser(null);
    setIsAdmin(false);
  };

  const loginWithGoogle = async () => {
    // SECURITY: Disabling the automatic admin bypass for Google login.
    // In a real app, this would integrate with Firebase/Google OAuth.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: false, message: "Google Login is disabled for this secure presentation." });
      }, 100);
    });
  };

  const value = {
    user,
    isAdmin,
    login,
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
