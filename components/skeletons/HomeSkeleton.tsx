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
      <Box className="flex-1 px-6 pt-16 pb-12 bg-background-0">
        {/* Header */}
        <Box className="mb-8 relative">
          {/* Centered Content */}
          <Box className="items-center">
            <SkeletonText
              _lines={1}
              className="h-8 w-48 mx-auto mb-2 bg-background-200"
            />
            <SkeletonText
              _lines={1}
              className="h-5 w-40 mx-auto bg-background-200"
            />
          </Box>
          
          {/* User Menu */}
          <Box className="absolute top-0 right-0">
            <Skeleton className="w-10 h-10 rounded-full bg-background-200" />
          </Box>
        </Box>

        {/* Account Info Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-5 rounded-xl shadow-soft-2 border border-outline-200">
          <SkeletonText
            _lines={1}
            className="h-6 w-40 mx-auto mb-5 bg-background-200"
          />

          <Box className="space-y-4">
            {/* Name Row */}
            <Box className="flex-row justify-around items-center py-3 border-b border-outline-200">
              <SkeletonText _lines={1} className="h-4 w-12 bg-background-200" />
              <SkeletonText _lines={1} className="h-4 w-28 bg-background-200" />
            </Box>

            {/* Email Row */}
            <Box className="flex-row justify-around items-center py-3 border-b border-outline-200">
              <SkeletonText _lines={1} className="h-4 w-10 bg-background-200" />
              <SkeletonText _lines={1} className="h-4 w-36 bg-background-200" />
            </Box>

            {/* Role Row */}
            <Box className="flex-row justify-around items-center py-3">
              <SkeletonText _lines={1} className="h-4 w-8 bg-background-200" />
              <Skeleton className="h-6 w-16 rounded-full bg-background-200" />
            </Box>
          </Box>
        </Card>

        {/* Test Collections Section */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-5 rounded-xl shadow-soft-1 border border-outline-200">
          <SkeletonText
            _lines={1}
            className="h-6 w-32 mx-auto mb-2 bg-background-200"
          />
          <SkeletonText
            _lines={1}
            className="h-4 w-56 mx-auto mb-5 bg-background-200"
          />
          
          <Box className="space-y-4">
            {/* View Test Collections Button */}
            <Skeleton className="h-12 w-full rounded-lg bg-background-200" />
            
            {/* Create Test Collection Button */}
            <Skeleton className="h-12 w-full rounded-lg bg-background-200" />
          </Box>
        </Card>

        {/* Sign Out Card */}
        <Card className="w-full max-w-sm mx-auto mb-6 bg-background-50 p-4 rounded-xl shadow-soft-1 border border-outline-200">
          <Skeleton className="h-12 w-full rounded-lg bg-background-200" />
        </Card>

        {/* Footer */}
        <Box className="mt-6">
          <SkeletonText
            _lines={1}
            className="h-3 w-52 mx-auto bg-background-200"
          />
        </Box>
      </Box>
    </ScrollView>
  );
}