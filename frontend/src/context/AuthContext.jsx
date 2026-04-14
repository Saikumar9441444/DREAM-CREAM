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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      const userObj = data.user;
      
      localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
      localStorage.setItem('dream_cream_token', data.token); // Save JWT
      
      setUser(userObj);
      setIsAdmin(userObj.role === 'admin');
      trackVisit(userObj);
      
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: err.message };
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
