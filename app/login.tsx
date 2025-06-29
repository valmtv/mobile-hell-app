import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AlertTriangle, Eye, EyeOff } from '@/components/Icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';

import { useRouter } from 'expo-router';
import { LoginSkeleton } from '@/components/skeletons/LoginSkeleton';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const { signIn, userToken, isTokenValid, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  // Initialize navigation readiness
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100); // Small delay to ensure navigation context is ready

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation after auth state changes
  useEffect(() => {
    if (!authLoading && isNavigationReady && userToken && isTokenValid) {
      try {
        router.replace('/home');
      } catch (error) {
        console.log('Navigation error:', error);
        // Fallback: try again after a short delay
        setTimeout(() => {
          try {
            router.replace('/home');
          } catch (fallbackError) {
            console.error('Fallback navigation failed:', fallbackError);
          }
        }, 500);
      }
    }
  }, [authLoading, userToken, isTokenValid, router, isNavigationReady]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      clearErrors();
      await signIn(data.email, data.password);
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      let message = 'Login failed. Please try again.';
      if (err.message?.includes('401')) {
        message = 'Invalid email or password.';
      } else if (err.message?.includes('Network')) {
        message = 'Network error. Please check your connection.';
      } else if (err.message?.includes('timeout')) {
        message = 'Request timed out. Please try again.';
      }
      setLoginError(message);
    }
  };

  const resetError = () => {
    if (loginError) setLoginError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (authLoading || !isNavigationReady) {
    return <LoginSkeleton />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Box className="flex-1 justify-center px-6 py-12 bg-background-0">
          {/* Header */}
          <Box className="mb-8">
            <Heading size="lg" className="text-center mb-2 text-typography-900">
              Welcome Back
            </Heading>
            <Text size="md" className="text-center text-typography-600">
              Sign in to continue
            </Text>
          </Box>

          {/* Card */}
          <Card className="w-full bg-background-50 p-6 rounded-lg shadow-soft-2 border border-outline-200">
            {/* Title */}
            <Heading size="md" className="text-center mb-6 text-typography-900">
              Login
            </Heading>

            {/* Global Error */}
            {loginError && (
              <Alert action="error" variant="outline" className="mb-6 bg-background-error border-error-300">
                <AlertIcon as={AlertTriangle} className="w-5 h-5 stroke-error-600" />
                <AlertText className="text-error-700 font-medium">
                  {loginError}
                </AlertText>
              </Alert>
            )}

            {/* Form Fields */}
            <Box className="space-y-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={!!errors.email}>
                    <FormControlLabel className="mb-2">
                      <FormControlLabelText className="text-sm font-medium text-typography-700">
                        Email Address
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input 
                      variant="outline" 
                      size="lg"
                      className={`border ${
                        errors.email 
                          ? 'border-error-300 bg-background-error' 
                          : 'border-outline-300 bg-background-0'
                      } focus:border-primary-400`}
                    >
                      <InputField
                        placeholder="you@example.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          resetError();
                        }}
                        value={value}
                        className="text-typography-900 text-base px-4 py-3"
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorText className="text-sm text-error-600">
                        {errors.email?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isInvalid={!!errors.password}>
                    <FormControlLabel className="mb-2">
                      <FormControlLabelText className="text-sm font-medium text-typography-700">
                        Password
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Box className="relative">
                      <Input 
                        variant="outline" 
                        size="lg"
                        className={`border ${
                          errors.password 
                            ? 'border-error-300 bg-background-error' 
                            : 'border-outline-300 bg-background-0'
                        } focus:border-primary-400`}
                      >
                        <InputField
                          placeholder="••••••••"
                          secureTextEntry={!showPassword}
                          onBlur={onBlur}
                          onChangeText={(text) => {
                            onChange(text);
                            resetError();
                          }}
                          value={value}
                          onSubmitEditing={handleSubmit(onSubmit)}
                          className="text-typography-900 text-base px-4 py-3 pr-12"
                        />
                      </Input>
                      <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        className="absolute right-4 top-1/2"
                        style={{ transform: [{ translateY: -12 }] }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 stroke-typography-500" />
                        ) : (
                          <Eye className="w-5 h-5 stroke-typography-500" />
                        )}
                      </TouchableOpacity>
                    </Box>
                    <FormControlError>
                      <FormControlErrorText className="text-sm text-error-600">
                        {errors.password?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                )}
              />

              <Button
                onPress={handleSubmit(onSubmit)}
                isDisabled={isSubmitting}
                size="lg"
                variant="solid"
                action="primary"
                className="bg-primary-600 active:bg-primary-700 rounded-lg mt-6 w-full flex items-center justify-center"
              >
                <ButtonText className="text-primary-50 font-semibold text-base">
                  {isSubmitting ? 'Signing In…' : 'Sign In'}
                </ButtonText>
              </Button>
            </Box>
          </Card>

          {/* Footer */}
          <Box className="mt-8">
            <Text className="text-center text-typography-600 text-sm">
              Having trouble? Contact support.
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}