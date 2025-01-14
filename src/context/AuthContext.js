import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const api = useApi();
  const loginUser = async (data) => {
    return api
      .login(data)
      .then((user) => {
        setUser(user);
        return Promise.resolve(user);
      })
      .catch((error) => {
        console.error('Login failed', error);
        return Promise.reject(error);
      });
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
