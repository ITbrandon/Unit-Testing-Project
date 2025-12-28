import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { EmptyState } from './EmptyState';
import { Search } from 'lucide-react';

/**
 * EmptyState Test Suite
 * 
 * Tests the empty state component used when no features match filters
 * or when the feature list is empty. Covers content, customization, and accessibility.
 */

describe('EmptyState', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No features found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<EmptyState title="Nothing here yet" />);
      expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    });

    it('renders custom description', () => {
      render(<EmptyState description="Add some features to get started" />);
      expect(screen.getByText('Add some features to get started')).toBeInTheDocument();
    });

    it('renders custom icon', () => {
      render(<EmptyState icon={<Search data-testid="custom-icon" />} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders action when provided', () => {
      render(<EmptyState action={<button>Add Feature</button>} />);
      expect(screen.getByRole('button', { name: 'Add Feature' })).toBeInTheDocument();
    });

    it('does not render action when not provided', () => {
      render(<EmptyState />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EmptyState className="custom-class" />);
      expect(screen.getByTestId('empty-state')).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('has status role for screen readers', () => {
      render(<EmptyState />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live for dynamic updates', () => {
      render(<EmptyState />);
      expect(screen.getByTestId('empty-state')).toHaveAttribute('aria-live', 'polite');
    });

    it('action button is focusable', async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <EmptyState action={<button onClick={handleClick}>Add Feature</button>} />
      );

      await user.tab();
      const button = screen.getByRole('button');
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('content variations', () => {
    it('handles empty string title', () => {
      render(<EmptyState title="" />);
      // Title element should still exist but be empty
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('');
    });

    it('handles long title', () => {
      const longTitle = 'This is a very long title that might need to wrap to multiple lines';
      render(<EmptyState title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long description', () => {
      const longDesc = 'This is a very long description '.repeat(5);
      render(<EmptyState description={longDesc} />);
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(
        <EmptyState 
          title="No results for <search>" 
          description="Try searching for something else & more" 
        />
      );
      expect(screen.getByText('No results for <search>')).toBeInTheDocument();
      expect(screen.getByText('Try searching for something else & more')).toBeInTheDocument();
    });
  });

  describe('action component', () => {
    it('renders link as action', () => {
      render(
        <EmptyState 
          action={<a href="/features/new">Create Feature</a>} 
        />
      );
      expect(screen.getByRole('link', { name: 'Create Feature' })).toBeInTheDocument();
    });

    it('renders complex action component', () => {
      render(
        <EmptyState 
          action={
            <div>
              <button>Primary Action</button>
              <button>Secondary Action</button>
            </div>
          } 
        />
      );
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<EmptyState />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom content', () => {
      const { container } = render(
        <EmptyState 
          title="Custom Title"
          description="Custom description"
          action={<button>Action</button>}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
