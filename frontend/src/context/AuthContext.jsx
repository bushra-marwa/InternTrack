import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });

  // ✅ STORE TOKEN (MOST IMPORTANT LINE)
  localStorage.setItem('token', res.data.token);

  setUser(res.data);

  return res.data;
};

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);