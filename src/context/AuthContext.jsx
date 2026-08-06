import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://127.0.0.1:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure Axios instance
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Inject JWT authorization header to every request if token is available
  api.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Fetch current user details from API
  const fetchUser = async (tokenVal) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenVal}`,
        },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to load user profile', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      await fetchUser(access_token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  // Signup handler
  const signup = async (username, email, password) => {
    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      // Automatically login after successful signup
      return await login(email, password);
    } catch (err) {
      const message = err.response?.data?.detail || 'Signup failed. Please try again.';
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
