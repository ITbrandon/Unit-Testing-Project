import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { LoadingSkeleton } from './LoadingSkeleton';

/**
 * LoadingSkeleton Test Suite
 * 
 * Tests the loading skeleton component displayed while features are loading.
 * Covers rendering, count variations, and accessibility.
 */

describe('LoadingSkeleton', () => {
  describe('rendering', () => {
    it('renders default number of skeleton items', () => {
      render(<LoadingSkeleton />);
      const items = screen.getAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(3);
    });

    it('renders custom number of skeleton items', () => {
      render(<LoadingSkeleton count={5} />);
      const items = screen.getAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(5);
    });

    it('renders single skeleton item', () => {
      render(<LoadingSkeleton count={1} />);
      const items = screen.getAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(1);
    });

    it('renders zero items when count is 0', () => {
      render(<LoadingSkeleton count={0} />);
      const items = screen.queryAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(0);
    });

    it('applies custom className', () => {
      render(<LoadingSkeleton className="custom-class" />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('has status role for screen readers', () => {
      render(<LoadingSkeleton />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has accessible label', () => {
      render(<LoadingSkeleton />);
      expect(screen.getByLabelText('Loading features')).toBeInTheDocument();
    });

    it('has screen reader text', () => {
      render(<LoadingSkeleton />);
      expect(screen.getByText('Loading features...')).toBeInTheDocument();
    });

    it('screen reader text is visually hidden', () => {
      render(<LoadingSkeleton />);
      const srText = screen.getByText('Loading features...');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('edge cases', () => {
    it('handles large count', () => {
      render(<LoadingSkeleton count={100} />);
      const items = screen.getAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(100);
    });

    it('handles negative count gracefully', () => {
      render(<LoadingSkeleton count={-1} />);
      const items = screen.queryAllByTestId('loading-skeleton-item');
      expect(items).toHaveLength(0);
    });
  });

  describe('animation', () => {
    it('applies pulse animation to skeleton items', () => {
      render(<LoadingSkeleton count={1} />);
      const item = screen.getByTestId('loading-skeleton-item');
      expect(item).toHaveClass('animate-pulse');
    });
  });

  describe('snapshot', () => {
    it('matches snapshot with default count', () => {
      const { container } = render(<LoadingSkeleton />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom count', () => {
      const { container } = render(<LoadingSkeleton count={1} />);
      expect(container).toMatchSnapshot();
    });
  });
});
