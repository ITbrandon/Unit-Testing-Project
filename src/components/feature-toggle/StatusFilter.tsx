import React from 'react';
import type { FeatureStatus } from '../../types/feature';
import { cn } from '../../lib/utils';

interface StatusFilterProps {
  value: FeatureStatus;
  onChange: (status: FeatureStatus) => void;
  counts?: {
    all: number;
    enabled: number;
    disabled: number;
  };
  disabled?: boolean;
}

const statusOptions: { value: FeatureStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

/**
 * StatusFilter Component
 * 
 * A segmented control for filtering features by status.
 * Shows optional count badges for each status.
 */
export const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  counts,
  disabled = false,
}) => {
  return (
    <div 
      className="inline-flex rounded-lg border border-border bg-secondary/50 p-1"
      role="group"
      aria-label="Filter by status"
    >
      {statusOptions.map((option) => {
        const isSelected = value === option.value;
        const count = counts?.[option.value];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              isSelected
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-pressed={isSelected}
            data-testid={`status-filter-${option.value}`}
          >
            {option.label}
            {count !== undefined && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-mono",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
