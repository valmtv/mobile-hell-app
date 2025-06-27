import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function HomeSkeleton() {
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
            <SkeletonText
              _lines={1}
              className="h-8 w-48 mx-auto mb-2 bg-background-200"
            />
            <SkeletonText
              _lines={1}
              className="h-5 w-36 mx-auto bg-background-200"
            />
          </Box>
          <Skeleton className="w-10 h-10 rounded-full bg-background-200" />
        </Box>

        {/* Account Info Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-4 rounded-lg shadow-soft-2">
          <SkeletonText
            _lines={1}
            className="h-6 w-32 mx-auto mb-4 bg-background-200"
          />

          <Box className="space-y-4">
            {/* Name Row */}
            <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
              <SkeletonText _lines={1} className="h-4 w-12 bg-background-200" />
              <SkeletonText _lines={1} className="h-4 w-24 bg-background-200" />
            </Box>

            {/* Email Row */}
            <Box className="flex-row justify-between items-center py-3 border-b border-outline-200">
              <SkeletonText _lines={1} className="h-4 w-10 bg-background-200" />
              <SkeletonText _lines={1} className="h-4 w-32 bg-background-200" />
            </Box>

            {/* Role Row */}
            <Box className="flex-row justify-between items-center py-3">
              <SkeletonText _lines={1} className="h-4 w-8 bg-background-200" />
              <Skeleton className="h-6 w-16 rounded-full bg-background-200" />
            </Box>
          </Box>
        </Card>

        {/* Actions */}
        <Box className="space-y-4 mt-8">
          <Skeleton className="h-12 w-full max-w-sm mx-auto rounded-lg bg-error-200" />
          <SkeletonText
            _lines={1}
            className="h-3 w-48 mx-auto bg-background-200"
          />
        </Box>
      </Box>
    </ScrollView>
  );
}
