import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { ErrorState } from './ErrorState';

/**
 * ErrorState Test Suite
 * 
 * Tests the error state component displayed when feature operations fail.
 * Covers content, retry functionality, and accessibility.
 */

describe('ErrorState', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<ErrorState />);
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to load features. Please try again.')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<ErrorState title="Connection Error" />);
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });

    it('renders custom message', () => {
      render(<ErrorState message="Network request failed" />);
      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    it('renders error icon', () => {
      render(<ErrorState />);
      // The error state should have an alert role
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ErrorState className="custom-class" />);
      expect(screen.getByTestId('error-state')).toHaveClass('custom-class');
    });
  });

  describe('retry button', () => {
    it('renders retry button when onRetry is provided', () => {
      render(<ErrorState onRetry={vi.fn()} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<ErrorState />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onRetry when button is clicked', async () => {
      const handleRetry = vi.fn();
      const { user } = render(<ErrorState onRetry={handleRetry} />);

      await user.click(screen.getByRole('button', { name: /try again/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('can be activated via keyboard', async () => {
      const handleRetry = vi.fn();
      const { user } = render(<ErrorState onRetry={handleRetry} />);

      await user.tab();
      await user.keyboard('{Enter}');

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has alert role for screen readers', () => {
      render(<ErrorState />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('retry button is focusable', async () => {
      const { user } = render(<ErrorState onRetry={vi.fn()} />);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('content variations', () => {
    it('handles empty title', () => {
      render(<ErrorState title="" />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toBe('');
    });

    it('handles empty message', () => {
      render(<ErrorState message="" />);
      // Should still render, just with empty paragraph
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('handles long error message', () => {
      const longMessage = 'This is a very long error message '.repeat(5);
      render(<ErrorState message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(
        <ErrorState 
          title="Error: <Connection Failed>" 
          message="Please check your network & try again" 
        />
      );
      expect(screen.getByText('Error: <Connection Failed>')).toBeInTheDocument();
      expect(screen.getByText('Please check your network & try again')).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot without retry', () => {
      const { container } = render(<ErrorState />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with retry', () => {
      const { container } = render(<ErrorState onRetry={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom content', () => {
      const { container } = render(
        <ErrorState 
          title="Custom Error"
          message="Custom error message"
          onRetry={vi.fn()}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
