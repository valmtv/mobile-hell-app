import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MoreVertical, User, LogOut, Palette } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Popover, PopoverBackdrop, PopoverContent, PopoverBody } from '@/components/ui/popover';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  onSignOut?: () => void;
}

export function UserMenu({ onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={(triggerProps) => (
        <TouchableOpacity {...triggerProps}>
          <Box className="p-2 rounded-full bg-background-50 border border-outline-200">
            <MoreVertical size={20} className="text-typography-700" />
          </Box>
        </TouchableOpacity>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-64 bg-background-0 border border-outline-200 shadow-lg">
        <PopoverBody className="p-4">
          <VStack space="md">
            {/* User Info */}
            {userData && (
              <>
                <Box className="mb-3">
                  <HStack className="items-center mb-2">
                    <Box className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                      <User size={18} className="text-primary-600" />
                    </Box>
                    <Box className="flex-1">
                      <Text className="text-typography-900 font-semibold text-sm">
                        {userData.first_name} {userData.last_name}
                      </Text>
                      <Text className="text-typography-600 text-xs mt-0.5">
                        {userData.email}
                      </Text>
                    </Box>
                  </HStack>
                  
                  {/* Role Badge */}
                  <Box className="ml-13">
                    <Badge variant="outline" className="border-outline-300 bg-background-100 self-start">
                      <BadgeText className="text-typography-700 font-medium text-xs">
                        {userData.role.toUpperCase()}
                      </BadgeText>
                    </Badge>
                  </Box>
                </Box>
                
                <Divider className="bg-outline-200" />
              </>
            )}

            {/* Theme Toggle */}
            <Box className="py-1">
              <HStack className="items-center justify-between">
                <HStack className="items-center">
                  <Palette size={16} className="text-typography-600 mr-3" />
                  <Text className="text-typography-700 text-sm">Theme</Text>
                </HStack>
                <ThemeToggle showLabel />
              </HStack>
            </Box>

            <Divider className="bg-outline-200" />

            {/* Sign Out */}
            <TouchableOpacity onPress={onSignOut} className="py-1">
              <HStack className="items-center">
                <LogOut size={16} className="text-error-600 mr-3" />
                <Text className="text-error-600 text-sm font-medium">Sign Out</Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}