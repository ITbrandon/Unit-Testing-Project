import { useState, useCallback, useMemo } from 'react';
import type { Feature, FeatureFilters, FeatureStatus } from '../types/feature';
import { filterFeatures, countFeaturesByStatus, getUniqueCategories } from '../lib/feature-utils';

// Sample data for demonstration
const INITIAL_FEATURES: Feature[] = [
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Enable dark theme for the application interface',
    enabled: true,
    category: 'ui',
  },
  {
    id: 'beta-features',
    name: 'Beta Features',
    description: 'Access experimental features before general release',
    enabled: false,
    category: 'experimental',
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Track and visualize user engagement metrics',
    enabled: true,
    category: 'data',
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Receive real-time alerts for important events',
    enabled: false,
    category: 'communication',
  },
  {
    id: 'two-factor',
    name: 'Two-Factor Auth',
    description: 'Add an extra layer of security to your account',
    enabled: true,
    category: 'security',
  },
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Enable programmatic access via REST API',
    enabled: false,
    category: 'developer',
  },
  {
    id: 'auto-save',
    name: 'Auto-Save',
    description: 'Automatically save changes as you work',
    enabled: true,
    category: 'productivity',
  },
  {
    id: 'ai-suggestions',
    name: 'AI Suggestions',
    description: 'Get intelligent recommendations powered by machine learning',
    enabled: false,
    category: 'experimental',
  },
];

interface UseFeatureTogglesOptions {
  initialFeatures?: Feature[];
  simulateLoading?: boolean;
  simulateError?: boolean;
}

interface UseFeatureTogglesReturn {
  features: Feature[];
  filteredFeatures: Feature[];
  filters: FeatureFilters;
  isLoading: boolean;
  error: string | null;
  counts: { all: number; enabled: number; disabled: number };
  categories: string[];
  setSearch: (search: string) => void;
  setStatus: (status: FeatureStatus) => void;
  setCategory: (category: string | null) => void;
  toggleFeature: (id: string, enabled: boolean) => void;
  retry: () => void;
}

/**
 * useFeatureToggles Hook
 * 
 * Manages feature toggle state including filtering, toggling, and async states.
 * Provides a clean API for feature management in components.
 */
export const useFeatureToggles = (
  options: UseFeatureTogglesOptions = {}
): UseFeatureTogglesReturn => {
  const { 
    initialFeatures = INITIAL_FEATURES, 
    simulateLoading = false,
    simulateError = false,
  } = options;

  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [filters, setFilters] = useState<FeatureFilters>({
    search: '',
    status: 'all',
    category: null,
  });
  const [isLoading, setIsLoading] = useState(simulateLoading);
  const [error, setError] = useState<string | null>(simulateError ? 'Failed to load features' : null);

  // Memoized filtered features
  const filteredFeatures = useMemo(
    () => filterFeatures(features, filters),
    [features, filters]
  );

  // Memoized counts
  const counts = useMemo(
    () => {
      const { enabled, disabled, total } = countFeaturesByStatus(features);
      return { all: total, enabled, disabled };
    },
    [features]
  );

  // Memoized categories
  const categories = useMemo(
    () => getUniqueCategories(features),
    [features]
  );

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: FeatureStatus) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setCategory = useCallback((category: string | null) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  // Toggle a feature
  const toggleFeature = useCallback((id: string, enabled: boolean) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, enabled } : feature
      )
    );
  }, []);

  // Retry loading
  const retry = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    features,
    filteredFeatures,
    filters,
    isLoading,
    error,
    counts,
    categories,
    setSearch,
    setStatus,
    setCategory,
    toggleFeature,
    retry,
  };
};

export default useFeatureToggles;
