import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * LoadingSkeleton Component
 * 
 * Displays placeholder cards while features are loading.
 * Provides visual feedback and maintains layout stability.
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)} aria-label="Loading features" role="status">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 animate-pulse"
          data-testid="loading-skeleton-item"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-5 w-10 rounded-full bg-muted" />
            </div>
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="h-6 w-11 rounded-full bg-muted" />
        </div>
      ))}
      <span className="sr-only">Loading features...</span>
    </div>
  );
};

export default LoadingSkeleton;
