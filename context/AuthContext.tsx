import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/config';

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

const TOKEN_KEY = 'userToken';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from SecureStore on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.warn('Failed to load token from SecureStore', e);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
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
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

