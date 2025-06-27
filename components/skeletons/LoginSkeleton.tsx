import React from 'react';
import { Box } from '@/components/ui/box';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function LoginSkeleton() {
  return (
    <Box className="flex-1 justify-center px-6 py-12 bg-background-0">
      {/* Header */}
      <Box className="mb-8">
        <SkeletonText
          _lines={1}
          className="h-8 w-48 mx-auto mb-2 bg-background-200"
        />
        <SkeletonText
          _lines={1}
          className="h-5 w-32 mx-auto bg-background-200"
        />
      </Box>

      {/* Card */}
      <Card className="w-full bg-background-50 p-6 rounded-lg shadow-soft-2">
        {/* Title */}
        <SkeletonText
          _lines={1}
          className="h-6 w-20 mx-auto mb-6 bg-background-200"
        />

        {/* Form Fields */}
        <Box className="space-y-4">
          {/* Email Field */}
          <Box>
            <SkeletonText
              _lines={1}
              className="h-4 w-24 mb-2 bg-background-200"
            />
            <Skeleton className="h-12 w-full rounded-lg bg-background-200" />
          </Box>

          {/* Password Field */}
          <Box>
            <SkeletonText
              _lines={1}
              className="h-4 w-20 mb-2 bg-background-200"
            />
            <Skeleton className="h-12 w-full rounded-lg bg-background-200" />
          </Box>

          {/* Submit Button */}
          <Skeleton className="h-12 w-full rounded-lg mt-6 bg-primary-200" />
        </Box>
      </Card>

      {/* Footer */}
      <Box className="mt-8">
        <SkeletonText
          _lines={1}
          className="h-4 w-40 mx-auto bg-background-200"
        />
      </Box>
    </Box>
  );
}

