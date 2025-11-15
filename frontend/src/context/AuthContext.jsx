import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      await api.login(username, password);
      const userData = { username };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // Clear previous user's project and hardware state
      localStorage.removeItem('currentProject');
      localStorage.removeItem('hardwareState');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, password) => {
    try {
      await api.register(username, password);
      const userData = { username };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // Clear previous user's project and hardware state
      localStorage.removeItem('currentProject');
      localStorage.removeItem('hardwareState');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentProject');
    // Note: hardwareState is now stored in database, not localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

