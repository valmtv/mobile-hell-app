import '@/global.css';
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/context/AuthContext';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="system">
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
