import React from 'react';
import type { Feature } from '../../types/feature';
import { FeatureCard } from './FeatureCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { cn } from '../../lib/utils';

interface FeatureListProps {
  features: Feature[];
  onToggle: (id: string, enabled: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * FeatureList Component
 * 
 * Renders a list of feature cards with loading and error states.
 * Handles empty state gracefully.
 */
export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  onToggle,
  isLoading = false,
  error = null,
  onRetry,
  disabled = false,
  className,
}) => {
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton count={4} className={className} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load features"
        message={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  // Empty state
  if (features.length === 0) {
    return <EmptyState className={className} />;
  }

  // Feature list
  return (
    <div 
      className={cn("space-y-3", className)} 
      role="list" 
      aria-label="Feature toggles"
      data-testid="feature-list"
    >
      {features.map((feature, index) => (
        <div 
          key={feature.id} 
          role="listitem"
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <FeatureCard
            feature={feature}
            onToggle={onToggle}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureList;
