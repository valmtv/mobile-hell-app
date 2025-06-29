import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/config';

type UserData = {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  role: "student" | string;
  receive_notifications: boolean;
};

type AuthContextType = {
  userToken: string | null;
  userData: UserData | null;
  loading: boolean;
  isTokenValid: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  validateToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userData: null,
  loading: true,
  isTokenValid: false,
  signIn: async () => {},
  signOut: async () => {},
  validateToken: async () => false,
});

const TOKEN_KEY = 'userToken';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Validate token using /users/me endpoint
  const validateToken = async (token?: string): Promise<boolean> => {
    const tokenToValidate = token || userToken;
    if (!tokenToValidate) {
      setIsTokenValid(false);
      setUserData(null);
      return false;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json',
        },
      });

      if (resp.ok) {
        const result = await resp.json() as { message: string; data: UserData };
        setIsTokenValid(true);
        setUserData(result.data);
        return true;
      } else {
        // Token is invalid, remove it
        setIsTokenValid(false);
        setUserData(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setUserToken(null);
        return false;
      }
    } catch (e) {
      console.warn('Token validation failed', e);
      setIsTokenValid(false);
      setUserData(null);
      return false;
    }
  };

  // Load token from SecureStore on mount and validate it
  useEffect(() => {
    const loadAndValidateToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setUserToken(token);
          await validateToken(token);
        } else {
          setIsTokenValid(false);
          setUserData(null);
        }
      } catch (e) {
        console.warn('Failed to load token from SecureStore', e);
        setIsTokenValid(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    loadAndValidateToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/mobile/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Login failed: ${resp.status} ${text}`);
      }
      
      const data = await resp.json() as { token: string };
      const token = data.token;
      
      // Store in SecureStore
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      setUserToken(token);
      
      // Fetch user data immediately after successful login
      const isValid = await validateToken(token);
      if (!isValid) {
        throw new Error('Failed to validate token after login');
      }
    } catch (e) {
      console.error('Error during signIn', e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      if (userToken) {
        await fetch(`${API_BASE_URL}/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }).catch((e) => {
          console.warn('Logout request failed', e);
        });
      }
    } catch (e) {
      console.warn('Error calling logout endpoint', e);
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUserToken(null);
      setUserData(null);
      setIsTokenValid(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      userData,
      loading, 
      isTokenValid, 
      signIn, 
      signOut, 
      validateToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
