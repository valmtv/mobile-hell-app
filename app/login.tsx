import React, { useEffect } from 'react';
import { View, Text as RNText, TextInput, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { useRouter } from 'expo-router';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const { signIn, userToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (!authLoading && userToken) {
      // If already logged in, redirect to home
      router.replace('/home');
    }
  }, [authLoading, userToken]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Login failed');
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-2xl font-bold mb-6">_____  Login</Text>

      {/* Email field */}
      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && <Text className="text-red-500 mt-1">{errors.email.message}</Text>}
          </View>
        )}
      />

      {/* Password field */}
      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-1">Password</Text>
            <TextInput
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>}
          </View>
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="mt-4">
        {isSubmitting ? <ActivityIndicator color="white" /> : <Text>Sign In</Text>}
      </Button>
    </View>
  );
}

