import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/login', { email, password });
      setAuth({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/token', { token: auth.refreshToken });
      setAuth(prevState => ({ ...prevState, accessToken: response.data.accessToken }));
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/logout', { token: auth.refreshToken });
      setAuth({ accessToken: null, refreshToken: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
