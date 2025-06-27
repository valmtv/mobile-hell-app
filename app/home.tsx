import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { User, LogOut, FileText, Plus } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
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
    router.push('/create-test-collection');
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
      <Box className="flex-1 px-6 py-12 bg-background-0">
        {/* Header with User Menu */}
        <Box className="flex-row justify-between items-center mb-8">
          <Box className="flex-1">
            <Heading size="lg" className="text-center mb-2 text-typography-900">
              Welcome Home!
            </Heading>
            <Text size="md" className="text-center text-typography-600">
              You're successfully logged in.
            </Text>
          </Box>
          <UserMenu onSignOut={handleSignOut} />
        </Box>

        {/* Navigation Cards */}
        <Box className="mb-6">
          <Heading size="md" className="text-center mb-4 text-typography-900">
            Quick Actions
          </Heading>
          
          <Box className="space-y-3 max-w-sm mx-auto">
            <Button
              onPress={navigateToTestCollections}
              size="md"
              variant="outline"
              className="w-full border-primary-300 bg-primary-50"
            >
              <FileText size={18} className="text-primary-600 mr-3" />
              <ButtonText className="text-primary-600 font-medium">
                Test Collections
              </ButtonText>
            </Button>
            
            <Button
              onPress={navigateToCreateTestCollection}
              size="md"
              variant="solid"
              className="w-full bg-primary-500"
            >
              <Plus size={18} className="text-white mr-3" />
              <ButtonText className="text-white font-medium">
                Create Test Collection
              </ButtonText>
            </Button>
          </Box>
        </Box>

        {/* Account Info Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-4 rounded-lg shadow-soft-2 border border-outline-200">
          <Heading size="md" className="text-center mb-4 text-typography-900">
            Account Information
          </Heading>

          {userData ? (
            <Box className="space-y-4">
              <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
                <Text className="font-medium text-typography-700">Name</Text>
                <Text numberOfLines={1} className="text-typography-900 flex-1 text-right">
                  {userData.first_name} {userData.last_name}
                </Text>
              </Box>

              <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
                <Text className="font-medium text-typography-700">Email</Text>
                <Text numberOfLines={1} className="text-typography-900 flex-1 text-right">
                  {userData.email}
                </Text>
              </Box>

              <Box className="flex-row justify-between items-center py-3">
                <Text className="font-medium text-typography-700">Role</Text>
                <Badge variant="outline" className="border-outline-300 bg-background-100">
                  <BadgeText className="text-typography-700 font-medium">
                    {userData.role.toUpperCase()}
                  </BadgeText>
                </Badge>
              </Box>
            </Box>
          ) : (
            <Box className="flex-row items-center justify-center py-8">
              <User size={20} className="text-typography-400 mr-2" />
              <Text className="text-center text-typography-600">No user data available.</Text>
            </Box>
          )}
        </Card>

        {/* Sign Out Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-4 rounded-lg shadow-soft-1 border border-outline-200">
          <Button
            onPress={handleSignOut}
            size="md"
            variant="outline"
            className="w-full border-error-300 bg-background-error"
          >
            <LogOut size={16} className="text-error-600 mr-2" />
            <ButtonText className="text-error-600 font-medium">
              Sign Out
            </ButtonText>
          </Button>
        </Card>

        {/* Footer */}
        <Box className="mt-8">
          <Text size="xs" className="text-center text-typography-500">
            Manage your account settings using the menu above.
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}