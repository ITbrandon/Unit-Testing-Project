/**
 * Feature Toggle Types
 * Core type definitions for the feature toggle system
 */

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureGroup {
  id: string;
  name: string;
  features: Feature[];
}

export type FeatureStatus = 'all' | 'enabled' | 'disabled';

export interface FeatureFilters {
  search: string;
  status: FeatureStatus;
  category: string | null;
}

export interface FeatureToggleState {
  features: Feature[];
  filters: FeatureFilters;
  isLoading: boolean;
  error: string | null;
}
