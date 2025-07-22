import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  username?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set axios default configuration
    axios.defaults.baseURL = 'http://localhost:5000';
    
    const token = localStorage.getItem('token');
    if (token) {
      // Check token validity
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You could add a token validation endpoint call here
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      setUser({ ...userData, token });
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, username?: string) => {
    try {
      await axios.post('/api/auth/register', { email, password, username });
      toast.success('Registration successful! Please check your email for verification');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      await axios.post('/api/auth/verify-email', { email, code });
      toast.success('Email verification successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Verification failed';
      toast.error(message);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      await axios.post('/api/auth/resend-verification', { email });
      toast.success('Verification code resent');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Send failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 