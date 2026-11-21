import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('hi_admin_token') || null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const data = await adminService.getMe();
          if (data.success) {
            setUser(data.user);
            try {
              localStorage.setItem('hi_admin_user', JSON.stringify(data.user));
            } catch (e) {}
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await adminService.login({ email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      try {
        localStorage.setItem('hi_admin_token', data.token);
        localStorage.setItem('hi_admin_user', JSON.stringify(data.user));
      } catch (e) {}
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('hi_admin_token');
      localStorage.removeItem('hi_admin_user');
    } catch (e) {}
  };

  const updateProfile = async (profileData) => {
    const data = await adminService.updateProfile(profileData);
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('hi_admin_user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message || 'Update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
