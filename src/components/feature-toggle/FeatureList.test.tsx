import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { FeatureList } from './FeatureList';
import type { Feature } from '../../types/feature';

/**
 * FeatureList Test Suite
 * 
 * Tests the main feature list component that orchestrates
 * rendering of feature cards, loading, error, and empty states.
 */

const createTestFeatures = (): Feature[] => [
  { id: '1', name: 'Feature A', description: 'Description A', enabled: true, category: 'cat1' },
  { id: '2', name: 'Feature B', description: 'Description B', enabled: false, category: 'cat2' },
];

describe('FeatureList', () => {
  describe('rendering features', () => {
    it('renders list of feature cards', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} />);
      
      expect(screen.getByText('Feature A')).toBeInTheDocument();
      expect(screen.getByText('Feature B')).toBeInTheDocument();
    });

    it('renders correct number of feature cards', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} />);
      
      const toggles = screen.getAllByRole('switch');
      expect(toggles).toHaveLength(2);
    });

    it('passes onToggle to feature cards', async () => {
      const handleToggle = vi.fn();
      const features = createTestFeatures();
      const { user } = render(<FeatureList features={features} onToggle={handleToggle} />);

      const toggles = screen.getAllByRole('switch');
      await user.click(toggles[0]);

      expect(handleToggle).toHaveBeenCalledWith('1', false);
    });

    it('applies custom className', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} className="custom-class" />);
      
      expect(screen.getByTestId('feature-list')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('renders loading skeleton when isLoading is true', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} isLoading />);
      
      expect(screen.getByLabelText('Loading features')).toBeInTheDocument();
    });

    it('does not render feature cards when loading', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} isLoading />);
      
      expect(screen.queryByText('Feature A')).not.toBeInTheDocument();
    });

    it('shows loading skeleton items', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} isLoading />);
      
      const skeletonItems = screen.getAllByTestId('loading-skeleton-item');
      expect(skeletonItems.length).toBeGreaterThan(0);
    });
  });

  describe('error state', () => {
    it('renders error state when error is provided', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} error="Network error" />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('does not render feature cards when error', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} error="Error" />);
      
      expect(screen.queryByText('Feature A')).not.toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      render(
        <FeatureList 
          features={[]} 
          onToggle={vi.fn()} 
          error="Error" 
          onRetry={vi.fn()} 
        />
      );
      
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const handleRetry = vi.fn();
      const { user } = render(
        <FeatureList 
          features={[]} 
          onToggle={vi.fn()} 
          error="Error" 
          onRetry={handleRetry} 
        />
      );

      await user.click(screen.getByRole('button', { name: /try again/i }));
      expect(handleRetry).toHaveBeenCalled();
    });
  });

  describe('empty state', () => {
    it('renders empty state when features array is empty', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('shows default empty message', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} />);
      
      expect(screen.getByText('No features found')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables all feature cards when disabled', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} disabled />);
      
      const toggles = screen.getAllByRole('switch');
      toggles.forEach(toggle => {
        expect(toggle).toBeDisabled();
      });
    });

    it('does not call onToggle when disabled', async () => {
      const handleToggle = vi.fn();
      const features = createTestFeatures();
      const { user } = render(
        <FeatureList features={features} onToggle={handleToggle} disabled />
      );

      const toggles = screen.getAllByRole('switch');
      await user.click(toggles[0]);

      expect(handleToggle).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has list role', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} />);
      
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has accessible label', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} />);
      
      expect(screen.getByLabelText('Feature toggles')).toBeInTheDocument();
    });

    it('feature cards are list items', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('state priority', () => {
    it('shows loading over features', () => {
      const features = createTestFeatures();
      render(<FeatureList features={features} onToggle={vi.fn()} isLoading />);
      
      expect(screen.getByLabelText('Loading features')).toBeInTheDocument();
      expect(screen.queryByText('Feature A')).not.toBeInTheDocument();
    });

    it('shows error over empty state', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} error="Error" />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('shows loading over error', () => {
      render(<FeatureList features={[]} onToggle={vi.fn()} isLoading error="Error" />);
      
      expect(screen.getByLabelText('Loading features')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot with features', () => {
      const features = createTestFeatures();
      const { container } = render(<FeatureList features={features} onToggle={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when loading', () => {
      const { container } = render(<FeatureList features={[]} onToggle={vi.fn()} isLoading />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with error', () => {
      const { container } = render(
        <FeatureList features={[]} onToggle={vi.fn()} error="Test error" onRetry={vi.fn()} />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when empty', () => {
      const { container } = render(<FeatureList features={[]} onToggle={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });
  });
});
