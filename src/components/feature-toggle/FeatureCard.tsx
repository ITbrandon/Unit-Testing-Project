import React from 'react';
import type { Feature } from '../../types/feature';
import { FeatureToggleSwitch } from './FeatureToggleSwitch';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  feature: Feature;
  onToggle: (id: string, enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * FeatureCard Component
 * 
 * Displays a single feature with its details and toggle control.
 * Designed for accessibility and clear visual feedback.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onToggle,
  disabled = false,
  className,
}) => {
  const handleToggle = (checked: boolean) => {
    onToggle(feature.id, checked);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-300",
        "hover:border-primary/30 hover:shadow-card",
        feature.enabled && "border-primary/20 bg-card",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      data-testid={`feature-card-${feature.id}`}
      data-enabled={feature.enabled}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-lg transition-colors duration-300",
          feature.enabled ? "bg-primary" : "bg-toggle-disabled"
        )}
        aria-hidden="true"
      />

      <div className="flex-1 pl-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{feature.name}</h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium font-mono",
              feature.enabled
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {feature.enabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {feature.description}
        </p>
        <span className="mt-2 inline-block text-xs font-mono text-muted-foreground/70 uppercase tracking-wider">
          {feature.category}
        </span>
      </div>

      <FeatureToggleSwitch
        checked={feature.enabled}
        onCheckedChange={handleToggle}
        disabled={disabled}
        aria-label={`Toggle ${feature.name}`}
        variant="success"
      />
    </div>
  );
};

export default FeatureCard;
