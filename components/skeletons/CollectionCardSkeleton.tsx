import React from 'react';
import { Box } from '@/components/ui/box';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function CollectionCardSkeleton() {
  return (
    <Card className="mx-4 mb-4 p-4 bg-background-50 rounded-lg shadow-soft-1">
      {/* Header with icon, title and status badge */}
      <Box className="flex-row items-start justify-between mb-3">
        <Box className="flex-row items-center flex-1">
          {/* Lock icon */}
          <Skeleton className="h-5 w-5 rounded bg-background-200 mr-3" />
          
          {/* Title */}
          <SkeletonText
            _lines={1}
            className="h-5 w-24 bg-background-200"
          />
        </Box>
        
        {/* Status badge */}
        <Skeleton className="h-5 w-12 rounded-full bg-background-200" />
      </Box>

      {/* Created by and Last updated */}
      <SkeletonText
        _lines={1}
        className="h-4 w-40 mb-3 bg-background-200"
      />

      {/* Description */}
      <SkeletonText
        _lines={1}
        className="h-4 w-full mb-4 bg-background-200"
      />

      {/* Question count */}
      <Box className="flex-row items-center mb-4">
        <Skeleton className="h-4 w-4 rounded bg-background-200 mr-2" />
        <SkeletonText
          _lines={1}
          className="h-4 w-20 bg-background-200"
        />
      </Box>

      {/* Action buttons */}
      <Skeleton className="h-10 w-full rounded-lg bg-background-200" />
    </Card>
  );
}
