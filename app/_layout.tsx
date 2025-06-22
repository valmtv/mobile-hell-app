import '@/global.css';
import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

