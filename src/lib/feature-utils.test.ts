import { describe, it, expect } from 'vitest';
import {
  filterFeatures,
  groupFeaturesByCategory,
  getUniqueCategories,
  countFeaturesByStatus,
  validateFeature,
  formatFeatureStatus,
  generateFeatureId,
} from './feature-utils';
import type { Feature } from '../types/feature';

/**
 * Feature Utils Test Suite
 * 
 * Tests pure utility functions for feature management.
 * These tests ensure data transformations work correctly
 * across edge cases and boundary conditions.
 */

const createMockFeature = (overrides: Partial<Feature> = {}): Feature => ({
  id: 'feature-1',
  name: 'Test Feature',
  description: 'A test feature description',
  enabled: false,
  category: 'testing',
  ...overrides,
});

describe('filterFeatures', () => {
  const features: Feature[] = [
    createMockFeature({ id: '1', name: 'Dark Mode', description: 'Enable dark theme', enabled: true, category: 'ui' }),
    createMockFeature({ id: '2', name: 'Beta Features', description: 'Access beta features', enabled: false, category: 'experimental' }),
    createMockFeature({ id: '3', name: 'Analytics', description: 'Track user behavior', enabled: true, category: 'data' }),
    createMockFeature({ id: '4', name: 'Dark Analytics', description: 'Advanced tracking', enabled: false, category: 'data' }),
  ];

  describe('search filtering', () => {
    it('should return all features when search is empty', () => {
      const result = filterFeatures(features, { search: '', status: 'all', category: null });
      expect(result).toHaveLength(4);
    });

    it('should filter by name (case-insensitive)', () => {
      const result = filterFeatures(features, { search: 'dark', status: 'all', category: null });
      expect(result).toHaveLength(2);
      expect(result.map(f => f.id)).toContain('1');
      expect(result.map(f => f.id)).toContain('4');
    });

    it('should filter by description', () => {
      const result = filterFeatures(features, { search: 'tracking', status: 'all', category: null });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should return empty array when no matches found', () => {
      const result = filterFeatures(features, { search: 'nonexistent', status: 'all', category: null });
      expect(result).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
      const result = filterFeatures(features, { search: '()', status: 'all', category: null });
      expect(result).toHaveLength(0);
    });
  });

  describe('status filtering', () => {
    it('should filter enabled features only', () => {
      const result = filterFeatures(features, { search: '', status: 'enabled', category: null });
      expect(result).toHaveLength(2);
      expect(result.every(f => f.enabled)).toBe(true);
    });

    it('should filter disabled features only', () => {
      const result = filterFeatures(features, { search: '', status: 'disabled', category: null });
      expect(result).toHaveLength(2);
      expect(result.every(f => !f.enabled)).toBe(true);
    });

    it('should return all features when status is "all"', () => {
      const result = filterFeatures(features, { search: '', status: 'all', category: null });
      expect(result).toHaveLength(4);
    });
  });

  describe('category filtering', () => {
    it('should filter by specific category', () => {
      const result = filterFeatures(features, { search: '', status: 'all', category: 'data' });
      expect(result).toHaveLength(2);
      expect(result.every(f => f.category === 'data')).toBe(true);
    });

    it('should return all when category is null', () => {
      const result = filterFeatures(features, { search: '', status: 'all', category: null });
      expect(result).toHaveLength(4);
    });

    it('should return empty for non-existent category', () => {
      const result = filterFeatures(features, { search: '', status: 'all', category: 'nonexistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('combined filters', () => {
    it('should apply all filters together', () => {
      const result = filterFeatures(features, { search: 'dark', status: 'enabled', category: 'ui' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dark Mode');
    });

    it('should return empty when filters conflict', () => {
      const result = filterFeatures(features, { search: 'analytics', status: 'enabled', category: 'experimental' });
      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty features array', () => {
      const result = filterFeatures([], { search: 'test', status: 'all', category: null });
      expect(result).toHaveLength(0);
    });

    it('should handle whitespace in search', () => {
      const result = filterFeatures(features, { search: '  ', status: 'all', category: null });
      // Whitespace should not match anything meaningful
      expect(result).toHaveLength(0);
    });
  });
});

describe('groupFeaturesByCategory', () => {
  it('should group features by category', () => {
    const features = [
      createMockFeature({ id: '1', category: 'ui' }),
      createMockFeature({ id: '2', category: 'data' }),
      createMockFeature({ id: '3', category: 'ui' }),
    ];

    const result = groupFeaturesByCategory(features);
    
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['ui']).toHaveLength(2);
    expect(result['data']).toHaveLength(1);
  });

  it('should handle empty array', () => {
    const result = groupFeaturesByCategory([]);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should handle features with empty category', () => {
    const features = [
      createMockFeature({ id: '1', category: '' }),
    ];

    const result = groupFeaturesByCategory(features);
    expect(result['uncategorized']).toHaveLength(1);
  });
});

describe('getUniqueCategories', () => {
  it('should return unique categories sorted alphabetically', () => {
    const features = [
      createMockFeature({ category: 'zebra' }),
      createMockFeature({ category: 'alpha' }),
      createMockFeature({ category: 'zebra' }),
      createMockFeature({ category: 'beta' }),
    ];

    const result = getUniqueCategories(features);
    
    expect(result).toEqual(['alpha', 'beta', 'zebra']);
  });

  it('should return empty array for no features', () => {
    const result = getUniqueCategories([]);
    expect(result).toEqual([]);
  });
});

describe('countFeaturesByStatus', () => {
  it('should count enabled and disabled features', () => {
    const features = [
      createMockFeature({ enabled: true }),
      createMockFeature({ enabled: true }),
      createMockFeature({ enabled: false }),
    ];

    const result = countFeaturesByStatus(features);
    
    expect(result.enabled).toBe(2);
    expect(result.disabled).toBe(1);
    expect(result.total).toBe(3);
  });

  it('should handle all enabled', () => {
    const features = [
      createMockFeature({ enabled: true }),
      createMockFeature({ enabled: true }),
    ];

    const result = countFeaturesByStatus(features);
    expect(result.enabled).toBe(2);
    expect(result.disabled).toBe(0);
  });

  it('should handle empty array', () => {
    const result = countFeaturesByStatus([]);
    expect(result).toEqual({ enabled: 0, disabled: 0, total: 0 });
  });
});

describe('validateFeature', () => {
  it('should return empty array for valid feature', () => {
    const feature = createMockFeature();
    const errors = validateFeature(feature);
    expect(errors).toHaveLength(0);
  });

  it('should validate required name', () => {
    const errors = validateFeature({ name: '', description: 'test', category: 'test' });
    expect(errors).toContain('Name is required');
  });

  it('should validate name length', () => {
    const errors = validateFeature({ 
      name: 'a'.repeat(101), 
      description: 'test', 
      category: 'test' 
    });
    expect(errors).toContain('Name must be less than 100 characters');
  });

  it('should validate required description', () => {
    const errors = validateFeature({ name: 'test', description: '', category: 'test' });
    expect(errors).toContain('Description is required');
  });

  it('should validate description length', () => {
    const errors = validateFeature({ 
      name: 'test', 
      description: 'a'.repeat(501), 
      category: 'test' 
    });
    expect(errors).toContain('Description must be less than 500 characters');
  });

  it('should validate required category', () => {
    const errors = validateFeature({ name: 'test', description: 'test', category: '' });
    expect(errors).toContain('Category is required');
  });

  it('should return multiple errors when applicable', () => {
    const errors = validateFeature({ name: '', description: '', category: '' });
    expect(errors).toHaveLength(3);
  });

  it('should trim whitespace when validating', () => {
    const errors = validateFeature({ name: '   ', description: 'test', category: 'test' });
    expect(errors).toContain('Name is required');
  });
});

describe('formatFeatureStatus', () => {
  it('should return "enabled" for true', () => {
    expect(formatFeatureStatus(true)).toBe('enabled');
  });

  it('should return "disabled" for false', () => {
    expect(formatFeatureStatus(false)).toBe('disabled');
  });
});

describe('generateFeatureId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateFeatureId();
    const id2 = generateFeatureId();
    expect(id1).not.toBe(id2);
  });

  it('should start with "feature_" prefix', () => {
    const id = generateFeatureId();
    expect(id.startsWith('feature_')).toBe(true);
  });

  it('should be a non-empty string', () => {
    const id = generateFeatureId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
