import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { User, LogOut, BookOpen, Plus } from '@/components/Icons';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { UserMenu } from '@/components/UserMenu';
import { HomeSkeleton } from '@/components/skeletons/HomeSkeleton';

export default function HomeScreen() {
  const {
    userToken,
    userData,
    loading: authLoading,
    isTokenValid,
    signOut,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!userToken || !isTokenValid)) {
      router.replace('/login');
    }
  }, [authLoading, userToken, isTokenValid, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const navigateToTestCollections = () => {
    router.push('/test-collections');
  };

  const navigateToCreateTestCollection = () => {
    router.push('/test-collections/new');
  };

  if (authLoading || !userToken || !isTokenValid) {
    return <HomeSkeleton />;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Box className="flex-1 px-6 pt-16 pb-12 bg-background-0">
        {/* Header */}
        <Box className="mb-8 relative">
          {/* Centered Content */}
          <Box className="items-center">
            <Heading size="lg" className="text-center mb-2 text-typography-900">
              Welcome Home!
            </Heading>
            <Text size="md" className="text-center text-typography-600">
              You're successfully logged in.
            </Text>
          </Box>
          
          {/* User Menu */}
          <Box className="absolute top-0 right-0">
            <UserMenu onSignOut={handleSignOut} />
          </Box>
        </Box>

        {/* Account Info Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-5 rounded-xl shadow-soft-2 border border-outline-200">
          <Heading size="md" className="text-center mb-5 text-typography-900">
            Account Information
          </Heading>

          {userData ? (
            <Box className="space-y-4">
              <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
                <Text className="font-medium text-typography-600 text-sm">Name</Text>
                <Text numberOfLines={1} className="text-typography-900 flex-1 text-right font-medium">
                  {userData.first_name} {userData.last_name}
                </Text>
              </Box>

              <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
                <Text className="font-medium text-typography-600 text-sm">Email</Text>
                <Text numberOfLines={1} className="text-typography-900 flex-1 text-right font-medium text-sm">
                  {userData.email}
                </Text>
              </Box>

              <Box className="flex-row justify-between items-center py-3">
                <Text className="font-medium text-typography-600 text-sm">Role</Text>
                <Badge variant="solid" className="bg-secondary-100">
                  <BadgeText className="text-secondary-700 font-medium text-xs uppercase">
                    {userData.role}
                  </BadgeText>
                </Badge>
              </Box>
            </Box>
          ) : (
            <Box className="flex-row items-center justify-center py-8">
              <User className="w-5 h-5 stroke-typography-400" />
              <Text className="text-center text-typography-600 ml-2">No user data available.</Text>
            </Box>
          )}
        </Card>

        {/* Test Collections Section */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-5 rounded-xl shadow-soft-1 border border-outline-200">
          <Heading size="md" className="text-center mb-2 text-typography-900">
            Test Collections
          </Heading>
          <Text size="sm" className="text-center text-typography-600 mb-5">
            Manage your test collections and create new ones
          </Text>
          
          <Box className="space-y-4">
            <Button
              onPress={navigateToTestCollections}
              size="md"
              variant="outline"
              className="w-full border-primary-300 bg-background-0 active:bg-primary-50"
            >
              <BookOpen className="w-4 h-4 stroke-primary-600" />
              <Text className="text-primary-600 font-medium ml-2">View Test Collections</Text>
            </Button>

            <Button
              onPress={navigateToCreateTestCollection}
              size="md"
              variant="outline"
              className="w-full border-success-300 bg-background-0 active:bg-success-50"
            >
              <Plus className="w-4 h-4 stroke-success-600" />
              <Text className="text-success-600 font-medium ml-2">Create Test Collection</Text>
            </Button>
          </Box>
        </Card>

        {/* Sign Out Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-4 rounded-xl shadow-soft-1 border border-outline-200">
          <Button
            onPress={handleSignOut}
            size="md"
            variant="outline"
            className="w-full border-error-300 bg-background-error active:bg-error-100"
          >
            <LogOut className="w-4 h-4 stroke-error-600" />
            <Text className="text-error-600 font-medium ml-2">Sign Out</Text>
          </Button>
        </Card>

        {/* Footer */}
        <Box className="mt-6">
          <Text size="xs" className="text-center text-typography-500">
            Manage your account settings using the menu above.
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}