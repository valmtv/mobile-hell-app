import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MoreVertical, User, LogOut, Palette } from '@/components/Icons';
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
          <Box className="p-2.5 rounded-full bg-background-50 border border-outline-300">
            <MoreVertical className="w-4 h-4 stroke-primary-600" />
          </Box>
        </TouchableOpacity>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-72 bg-background-0 border border-outline-200 shadow-lg rounded-xl">
        <PopoverBody className="p-0">
          <VStack>
            {/* User Info Header */}
            {userData && (
              <Box className="p-4 pb-3">
                <HStack className="items-center mb-3">
                  <Box className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
                    <User className="w-5 h-5 stroke-primary-400" />
                  </Box>
                  <Box className="flex-1">
                    <Text className="text-typography-900 font-semibold text-base mb-0.5">
                      {userData.first_name} {userData.last_name}
                    </Text>
                    <Text className="text-typography-500 text-sm">
                      {userData.email}
                    </Text>
                  </Box>
                </HStack>
                
                {/* Role Badge */}
                <Box className="ml-15">
                  <Badge variant="solid" className="bg-secondary-100 self-start">
                    <BadgeText className="text-secondary-700 font-medium text-xs uppercase">
                      {userData.role}
                    </BadgeText>
                  </Badge>
                </Box>
              </Box>
            )}

            <Divider className="bg-outline-200" />

            {/* Menu Items */}
            <Box className="p-2">
              {/* Theme Toggle */}
              <TouchableOpacity className="flex-row items-center justify-between px-3 py-3 rounded-lg active:bg-background-100">
                <HStack className="items-center flex-1" space="sm">
                  <Palette className="w-[18px] h-[18px] stroke-primary-200" />
                  <Text className="text-typography-700 text-sm font-medium">Theme</Text>
                </HStack>
                <ThemeToggle showLabel />
              </TouchableOpacity>

              <Divider className="bg-outline-200 my-2" />

              {/* Sign Out */}
              <TouchableOpacity 
                onPress={onSignOut} 
                className="flex-row items-center px-3 py-3 rounded-lg active:bg-error-50"
              >
                <HStack className="items-center" space="sm">
                  <LogOut className="w-[18px] h-[18px] stroke-error-600" />
                  <Text className="text-error-600 text-sm font-medium">Sign Out</Text>
                </HStack>
              </TouchableOpacity>
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}