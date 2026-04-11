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

const API_VISITORS = 'http://localhost:5000/api/visitors';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('dream_cream_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.email.trim().toLowerCase() === ADMIN_USER.email);
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
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerEmail = email.trim().toLowerCase();
        if (lowerEmail === ADMIN_USER.email && password === 'admin123') {
          const userObj = { ...ADMIN_USER };
          localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
          setUser(userObj);
          setIsAdmin(true);
          trackVisit(userObj);
          resolve({ success: true });
        } else {
          // For now, allow other "demo" logins but they are not admins
          const userObj = { email: lowerEmail, displayName: lowerEmail.split('@')[0], role: 'user' };
          localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
          setUser(userObj);
          setIsAdmin(false);
          trackVisit(userObj);
          resolve({ success: true });
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('dream_cream_user');
    setUser(null);
    setIsAdmin(false);
  };

  const loginWithGoogle = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userObj = { ...ADMIN_USER, displayName: 'Saikumar (Google Admin)' };
        localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
        setUser(userObj);
        setIsAdmin(true);
        trackVisit(userObj);
        resolve({ success: true });
      }, 1500);
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
