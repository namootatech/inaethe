import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';
import Cookies from 'js-cookie';
import sign from 'jwt-encode';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const api = useApi();
  const jwtSecret = process.env.NEXT_PUBLIC_JWT_ENCODE_SECRET;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    console.log(
      '** [AUTH CONTEXT] Cookie User',
      !isNil(storedUser) ? JSON.parse(storedUser) : storedUser,
      jwtSecret
    );
    if (storedUser && jwtSecret && isNil(user)) {
      const parsedUser = JSON.parse(storedUser);
      console.log('** [AUTH CONTEXT] Restoring user:', parsedUser);
      // Encode email with JWT
      const encodedEmail = sign({ email: parsedUser.email }, jwtSecret);

      api
        .restoreUser({ token: encodedEmail })
        .then((restoredUser) => {
          setUser(restoredUser.data);
          console.log(
            '** [AUTH CONTEXT] Restored full user:',
            restoredUser.data
          );
        })
        .catch((error) => {
          console.error('** [AUTH CONTEXT] Failed to restore user:', error);
          setUser(null); // Clear the user state on error
          Cookies.remove('user'); // Clear the cookie
        })
        .finally(() => setLoading(false));
    } else {
      console.log('** [AUTH CONTEXT] No user found in cookies');
      setLoading(false); // No user to restore
    }
  }, [api, jwtSecret]);

  const loginUser = async (data) => {
    setLoading(true);
    return api
      .login(data)
      .then((data) => {
        console.log('** [AUTH CONTEXT] Login data', data);
        setUser(data.data);
        Cookies.set('user', JSON.stringify(data.data.user), { expires: 2 });
        console.log(
          '** [AUTH CONTEXT] User loggedin & cookie set:',
          data.data.user
        );
        return Promise.resolve(user);
      })
      .catch((error) => {
        console.error('** [AUTH CONTEXT] Login failed', error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  };

  const loginPartner = async (data) => {
    setLoading(true);
    return api
      .loginNpo(data)
      .then((data) => {
        console.log('** [AUTH CONTEXT] Login data', data);
        setPartner(data.data);
        Cookies.set('partner', JSON.stringify(data.data.user), { expires: 2 });
        console.log(
          '** [AUTH CONTEXT] Partner loggedin & cookie set:',
          data.data.user
        );
        return Promise.resolve(partner);
      })
      .catch((error) => {
        console.error('** [AUTH CONTEXT] Login failed', error);
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
      value={{
        user,
        setUser,
        loginUser,
        partner,
        setPartner,
        loginPartner,
        loading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
