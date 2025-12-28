import type { Feature, FeatureFilters, FeatureStatus } from '../types/feature';

/**
 * Filters features based on search query, status, and category
 * Pure function for easy testing
 */
export const filterFeatures = (
  features: Feature[],
  filters: FeatureFilters
): Feature[] => {
  return features.filter((feature) => {
    // Search filter - checks name and description
    const matchesSearch =
      filters.search === '' ||
      feature.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      feature.description.toLowerCase().includes(filters.search.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'enabled' && feature.enabled) ||
      (filters.status === 'disabled' && !feature.enabled);

    // Category filter
    const matchesCategory =
      filters.category === null || feature.category === filters.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });
};

/**
 * Groups features by category
 * Returns an object with category names as keys
 */
export const groupFeaturesByCategory = (
  features: Feature[]
): Record<string, Feature[]> => {
  return features.reduce((acc, feature) => {
    const category = feature.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);
};

/**
 * Gets unique categories from features
 */
export const getUniqueCategories = (features: Feature[]): string[] => {
  const categories = new Set(features.map((f) => f.category));
  return Array.from(categories).sort();
};

/**
 * Counts features by status
 */
export const countFeaturesByStatus = (
  features: Feature[]
): { enabled: number; disabled: number; total: number } => {
  const enabled = features.filter((f) => f.enabled).length;
  return {
    enabled,
    disabled: features.length - enabled,
    total: features.length,
  };
};

/**
 * Validates a feature object
 * Returns validation errors or empty array if valid
 */
export const validateFeature = (feature: Partial<Feature>): string[] => {
  const errors: string[] = [];

  if (!feature.name || feature.name.trim() === '') {
    errors.push('Name is required');
  } else if (feature.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!feature.description || feature.description.trim() === '') {
    errors.push('Description is required');
  } else if (feature.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (!feature.category || feature.category.trim() === '') {
    errors.push('Category is required');
  }

  return errors;
};

/**
 * Formats feature status for display
 */
export const formatFeatureStatus = (enabled: boolean): FeatureStatus => {
  return enabled ? 'enabled' : 'disabled';
};

/**
 * Generates a unique feature ID
 */
export const generateFeatureId = (): string => {
  return `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
