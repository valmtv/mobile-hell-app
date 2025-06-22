import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { userToken, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !userToken) {
      // Not logged in, redirect to login
      router.replace('/login');
    }
  }, [authLoading, userToken]);

  if (authLoading || !userToken) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-2xl font-bold mb-4">Welcome!</Text>
      <Text className="mb-6">You are logged in. Token: {userToken.substring(0, 20)}...</Text>
      <Button onPress={async () => {
        await signOut();
      }}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}

