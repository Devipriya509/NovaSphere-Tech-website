import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('novasphere_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('novasphere_token', data.token);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('novasphere_token', data.token);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('novasphere_token');
    setUser(null);
  };

  const toggleSaveProject = async (projectId) => {
    try {
      const data = await api.post('/auth/toggle-project', { projectId });
      if (data.success) {
        setUser(prev => ({
          ...prev,
          savedProjects: data.savedProjects
        }));
      }
      return data;
    } catch (err) {
      console.error('Failed to toggle save project:', err.message);
      throw err;
    }
  };

  const toggleSaveService = async (serviceId) => {
    try {
      const data = await api.post('/auth/toggle-service', { serviceId });
      if (data.success) {
        setUser(prev => ({
          ...prev,
          savedServices: data.savedServices
        }));
      }
      return data;
    } catch (err) {
      console.error('Failed to toggle save service:', err.message);
      throw err;
    }
  };

  const clearNotification = async (id) => {
    try {
      const data = await api.put(`/auth/notifications/${id}`);
      if (data.success) {
        setUser(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
      }
    } catch (err) {
      console.error('Failed to clear notification:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      toggleSaveProject,
      toggleSaveService,
      clearNotification,
      refreshUser: loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
