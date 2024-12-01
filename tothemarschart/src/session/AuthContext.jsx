import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, logout as logoutRedux } from '../redux/userSlice';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;
// handles session-related logics
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // requests server to check authorization
  // if the user is authenticated, set the user as the session user
  // logout otherwise
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/check-auth');
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        dispatch(setReduxUser(response.data.user));
      } else {
        setUser(null);
        dispatch(logoutRedux());
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      dispatch(logoutRedux());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // requests server to login and set the user as session user if succeeded
  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        dispatch(setReduxUser(userData));
        
        return {
          success: true,
          user: userData
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Invalid email or password'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // requests server to log out the current user
  const logout = async () => {
    try {
      const response = await axios.post('/logout');
      
      if (response.data.success) {
        setUser(null);
        dispatch(logoutRedux());
        return { success: true };
      }
      
      throw new Error(response.data.message || 'Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to logout' 
      };
    }
  };

  // update user information on the session side and redux side
  const updateAuthUser = useCallback(async (updatedUserData) => {
    try {
      const updatedUser = {
        ...user,
        ...updatedUserData
      };

      setUser(updatedUser);
      dispatch(setReduxUser(updatedUser));

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: 'Failed to update user data'
      };
    }
  }, [user, dispatch]);

  const contextValue = {
    user,
    login,
    logout,
    checkAuth,
    updateAuthUser,
    isAuthenticated: !!user,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
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