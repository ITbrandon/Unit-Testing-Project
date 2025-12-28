import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '../components/ui/tooltip';

// Re-export screen explicitly
export { screen };

/**
 * Custom render function that wraps components with necessary providers
 * This ensures consistent test environment matching the app structure
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render, userEvent };

/**
 * Helper to create test feature data
 * Reduces boilerplate in test files
 */
export const createTestFeature = (overrides = {}) => ({
  id: 'test-feature-1',
  name: 'Test Feature',
  description: 'A test feature for unit testing',
  enabled: false,
  category: 'testing',
  ...overrides,
});

/**
 * Helper to create multiple test features
 */
export const createTestFeatures = (count: number) => {
  return Array.from({ length: count }, (_, i) => createTestFeature({
    id: `test-feature-${i + 1}`,
    name: `Test Feature ${i + 1}`,
    category: i % 2 === 0 ? 'category-a' : 'category-b',
  }));
};

/**
 * Async helper for waiting on state updates
 */
export const waitForStateUpdate = () => new Promise(resolve => setTimeout(resolve, 0));
