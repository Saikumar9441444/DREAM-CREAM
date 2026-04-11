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
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // In local-only mode, we simulate a network delay and check static credentials
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === ADMIN_USER.email && password === 'admin123') {
          const userObj = { ...ADMIN_USER };
          localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
          setUser(userObj);
          setIsAdmin(true);
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Invalid credentials. Use saikumar89515@gmail.com / admin123' });
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
        const userObj = { ...ADMIN_USER, displayName: 'Google Admin' };
        localStorage.setItem('dream_cream_user', JSON.stringify(userObj));
        setUser(userObj);
        setIsAdmin(true);
        resolve({ success: true });
      }, 1500); // Shorter delay for Google login feel
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
