import React from 'react';
import { Box } from '@/components/ui/box';
import { CollectionCardSkeleton } from './CollectionCardSkeleton';

interface CollectionsListSkeletonProps {
  count?: number;
}

export function CollectionsListSkeleton({ count = 4 }: CollectionsListSkeletonProps) {
  return (
    <Box className="pt-4 pb-8">
      {Array.from({ length: count }, (_, index) => (
        <CollectionCardSkeleton key={`skeleton-${index}`} />
      ))}
    </Box>
  );
}
