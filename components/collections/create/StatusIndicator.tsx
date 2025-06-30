import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Globe, Archive, FileText } from '@/components/Icons';
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverBody,
} from '@/components/ui/popover';

interface StatusIndicatorProps {
  status: 'draft' | 'published' | 'archived';
  onStatusChange?: (newStatus: 'draft' | 'published' | 'archived') => void;
  isClickable?: boolean;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'published':
      return <Globe className="w-4 h-4 stroke-success-500" />;
    case 'archived':
      return <Archive className="w-4 h-4 stroke-typography-500" />;
    case 'draft':
    default:
      return <FileText className="w-4 h-4 stroke-typography-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-success-50 border-success-200';
    case 'archived':
      return 'bg-typography-50 border-typography-200';
    case 'draft':
    default:
      return 'bg-typography-50 border-typography-200';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'text-success-700';
    case 'archived':
      return 'text-typography-600';
    case 'draft':
    default:
      return 'text-typography-600';
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  onStatusChange, 
  isClickable = false 
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  const handleStatusSelect = (newStatus: 'draft' | 'published' | 'archived') => {
    onStatusChange?.(newStatus);
    setShowPopover(false);
  };

  const getAvailableOptions = () => {
    switch (status) {
      case 'draft':
        return [{ key: 'published', label: 'Make Public', icon: Globe, color: 'text-success-600' }];
      case 'published':
        return [
          { key: 'draft', label: 'Make Draft', icon: FileText, color: 'text-typography-600' },
          { key: 'archived', label: 'Archive', icon: Archive, color: 'text-typography-600' }
        ];
      case 'archived':
        return [{ key: 'draft', label: 'Restore to Draft', icon: FileText, color: 'text-typography-600' }];
      default:
        return [];
    }
  };

  const StatusContent = (
    <View className={`flex-row items-center px-3 py-2 rounded-full border ${getStatusColor(status)}`}>
      <StatusIcon status={status} />
      <Text className={`ml-2 text-sm font-medium ${getStatusTextColor(status)}`}>
        {label}
      </Text>
    </View>
  );

  if (!isClickable || !onStatusChange) {
    return StatusContent;
  }

  return (
    <Popover
      isOpen={showPopover}
      onClose={() => setShowPopover(false)}
      trigger={(triggerProps) => (
        <TouchableOpacity
          {...triggerProps}
          onPress={() => setShowPopover(true)}
        >
          {StatusContent}
        </TouchableOpacity>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-48">
        <PopoverBody className="p-0">
          {getAvailableOptions().map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => handleStatusSelect(option.key as any)}
                className="flex-row items-center px-4 py-3 border-b border-outline-100 last:border-b-0"
              >
                <IconComponent className={`w-4 h-4 ${option.color.replace('text-', 'stroke-')}`} />
                <Text className={`ml-3 text-sm ${option.color}`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};