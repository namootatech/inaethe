import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const api = useApi();
  const jwtSecret = process.env.NEXT_JWT_ENCODE_SECRET;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser && jwtSecret) {
      const parsedUser = JSON.parse(storedUser);

      // Encode email with JWT
      const encodedEmail = jwt.sign({ email: parsedUser.email }, jwtSecret);

      api
        .restoreUser(encodedEmail)
        .then((restoredUser) => {
          setUser(restoredUser);
        })
        .catch((error) => {
          console.error('Failed to restore user:', error);
          setUser(null); // Clear the user state on error
          Cookies.remove('user'); // Clear the cookie
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // No user to restore
    }
  }, [api, jwtSecret]);

  const loginUser = async (data) => {
    setLoading(true);
    return api
      .login(data)
      .then((user) => {
        setUser(user);
        return Promise.resolve(user);
      })
      .catch((error) => {
        console.error('Login failed', error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  };

  const logoutUser = () => {
    setUser(null);
    Cookies.remove('user');
    router.push('/signin');
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loginUser, loading, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
