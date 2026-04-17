import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    
    // ✅ CONSISTENT STORAGE
    localStorage.setItem('user', JSON.stringify(res.data));
    localStorage.setItem('token', res.data.token);

    setUser(res.data);
    return res.data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/api/auth/register', formData);
    
    // ✅ CONSISTENT STORAGE
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);

    setUser(data);
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