import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const { userToken, loading, isTokenValid } = useAuth();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Initialize navigation readiness
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100); // Small delay to ensure navigation context is ready

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('IndexScreen - Auth state:', { loading, userToken: !!userToken, isTokenValid, isNavigationReady });
    
    if (!loading && isNavigationReady) {
      try {
        if (userToken && isTokenValid) {
          // Token exists and is valid, go to home
          console.log('Redirecting to home');
          router.replace('/home');
        } else {
          // No token or invalid token, go to login
          console.log('Redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.log('Navigation error:', error);
        // Fallback: try again after a short delay
        setTimeout(() => {
          try {
            if (userToken && isTokenValid) {
              router.replace('/home');
            } else {
              router.replace('/login');
            }
          } catch (fallbackError) {
            console.error('Fallback navigation failed:', fallbackError);
          }
        }, 500);
      }
    }
  }, [loading, userToken, isTokenValid, router, isNavigationReady]);

  // Show loading spinner while checking auth state
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" className="text-primary" />
    </View>
  );
}