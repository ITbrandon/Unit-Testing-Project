import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeatureToggles } from './useFeatureToggles';
import type { Feature } from '../types/feature';

/**
 * useFeatureToggles Hook Test Suite
 * 
 * Tests the custom hook that manages feature toggle state.
 * Covers filtering, toggling, async states, and state updates.
 */

const createTestFeatures = (): Feature[] => [
  { id: '1', name: 'Feature A', description: 'Description A', enabled: true, category: 'cat1' },
  { id: '2', name: 'Feature B', description: 'Description B', enabled: false, category: 'cat1' },
  { id: '3', name: 'Feature C', description: 'Description C', enabled: true, category: 'cat2' },
];

describe('useFeatureToggles', () => {
  describe('initialization', () => {
    it('initializes with provided features', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));
      
      expect(result.current.features).toEqual(features);
    });

    it('initializes with default features when none provided', () => {
      const { result } = renderHook(() => useFeatureToggles());
      
      expect(result.current.features.length).toBeGreaterThan(0);
    });

    it('initializes with default filter state', () => {
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: [] }));
      
      expect(result.current.filters).toEqual({
        search: '',
        status: 'all',
        category: null,
      });
    });

    it('initializes loading state from options', () => {
      const { result } = renderHook(() => useFeatureToggles({ simulateLoading: true }));
      expect(result.current.isLoading).toBe(true);
    });

    it('initializes error state from options', () => {
      const { result } = renderHook(() => useFeatureToggles({ simulateError: true }));
      expect(result.current.error).toBe('Failed to load features');
    });
  });

  describe('filtering', () => {
    it('filters features by search term', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setSearch('Feature A');
      });

      expect(result.current.filteredFeatures).toHaveLength(1);
      expect(result.current.filteredFeatures[0].id).toBe('1');
    });

    it('filters features by status', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setStatus('enabled');
      });

      expect(result.current.filteredFeatures).toHaveLength(2);
      expect(result.current.filteredFeatures.every(f => f.enabled)).toBe(true);
    });

    it('filters features by category', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setCategory('cat1');
      });

      expect(result.current.filteredFeatures).toHaveLength(2);
      expect(result.current.filteredFeatures.every(f => f.category === 'cat1')).toBe(true);
    });

    it('combines multiple filters', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setStatus('enabled');
        result.current.setCategory('cat1');
      });

      expect(result.current.filteredFeatures).toHaveLength(1);
      expect(result.current.filteredFeatures[0].id).toBe('1');
    });

    it('returns empty array when no matches', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setSearch('nonexistent');
      });

      expect(result.current.filteredFeatures).toHaveLength(0);
    });
  });

  describe('toggling features', () => {
    it('toggles feature to enabled', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.toggleFeature('2', true);
      });

      const toggledFeature = result.current.features.find(f => f.id === '2');
      expect(toggledFeature?.enabled).toBe(true);
    });

    it('toggles feature to disabled', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.toggleFeature('1', false);
      });

      const toggledFeature = result.current.features.find(f => f.id === '1');
      expect(toggledFeature?.enabled).toBe(false);
    });

    it('does not affect other features when toggling', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      const originalFeatures = [...result.current.features];

      act(() => {
        result.current.toggleFeature('1', false);
      });

      result.current.features.forEach((feature, index) => {
        if (feature.id !== '1') {
          expect(feature).toEqual(originalFeatures[index]);
        }
      });
    });

    it('handles toggling non-existent feature gracefully', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      const originalFeatures = [...result.current.features];

      act(() => {
        result.current.toggleFeature('nonexistent', true);
      });

      expect(result.current.features).toEqual(originalFeatures);
    });
  });

  describe('counts', () => {
    it('calculates correct counts', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      expect(result.current.counts).toEqual({
        all: 3,
        enabled: 2,
        disabled: 1,
      });
    });

    it('updates counts when features are toggled', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.toggleFeature('2', true);
      });

      expect(result.current.counts).toEqual({
        all: 3,
        enabled: 3,
        disabled: 0,
      });
    });

    it('handles empty features array', () => {
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: [] }));

      expect(result.current.counts).toEqual({
        all: 0,
        enabled: 0,
        disabled: 0,
      });
    });
  });

  describe('categories', () => {
    it('extracts unique categories', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      expect(result.current.categories).toEqual(['cat1', 'cat2']);
    });

    it('returns empty array for no features', () => {
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: [] }));
      expect(result.current.categories).toEqual([]);
    });
  });

  describe('retry functionality', () => {
    it('clears error state on retry', () => {
      const { result } = renderHook(() => useFeatureToggles({ simulateError: true }));
      
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.retry();
      });

      expect(result.current.error).toBeNull();
    });

    it('clears loading state on retry', () => {
      const { result } = renderHook(() => useFeatureToggles({ simulateLoading: true }));
      
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.retry();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('filter state updates', () => {
    it('preserves other filters when setting search', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setStatus('enabled');
        result.current.setCategory('cat1');
        result.current.setSearch('test');
      });

      expect(result.current.filters).toEqual({
        search: 'test',
        status: 'enabled',
        category: 'cat1',
      });
    });

    it('allows clearing category filter', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      act(() => {
        result.current.setCategory('cat1');
      });

      expect(result.current.filters.category).toBe('cat1');

      act(() => {
        result.current.setCategory(null);
      });

      expect(result.current.filters.category).toBeNull();
    });
  });

  describe('memoization', () => {
    it('returns same filtered array reference when inputs unchanged', () => {
      const features = createTestFeatures();
      const { result, rerender } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      const firstFilteredRef = result.current.filteredFeatures;
      
      rerender();

      expect(result.current.filteredFeatures).toBe(firstFilteredRef);
    });

    it('returns new filtered array when filter changes', () => {
      const features = createTestFeatures();
      const { result } = renderHook(() => useFeatureToggles({ initialFeatures: features }));

      const firstFilteredRef = result.current.filteredFeatures;

      act(() => {
        result.current.setSearch('test');
      });

      expect(result.current.filteredFeatures).not.toBe(firstFilteredRef);
    });
  });
});
