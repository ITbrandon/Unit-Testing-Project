import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { StatusFilter } from './StatusFilter';

/**
 * StatusFilter Test Suite
 * 
 * Tests the status filter component used for filtering features
 * by enabled/disabled state. Covers selection, counts, and accessibility.
 */

describe('StatusFilter', () => {
  describe('rendering', () => {
    it('renders all status options', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} />);
      
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Enabled')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('marks current selection as pressed', () => {
      render(<StatusFilter value="enabled" onChange={vi.fn()} />);
      
      expect(screen.getByTestId('status-filter-enabled')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('status-filter-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('status-filter-disabled')).toHaveAttribute('aria-pressed', 'false');
    });

    it('displays counts when provided', () => {
      const counts = { all: 10, enabled: 6, disabled: 4 };
      render(<StatusFilter value="all" onChange={vi.fn()} counts={counts} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('does not display counts when not provided', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} />);
      
      // Only labels should be present, no numbers
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent).toMatch(/^(All|Enabled|Disabled)$/);
      });
    });
  });

  describe('user interactions', () => {
    it('calls onChange with selected status', async () => {
      const handleChange = vi.fn();
      const { user } = render(<StatusFilter value="all" onChange={handleChange} />);

      await user.click(screen.getByText('Enabled'));
      expect(handleChange).toHaveBeenCalledWith('enabled');

      await user.click(screen.getByText('Disabled'));
      expect(handleChange).toHaveBeenCalledWith('disabled');
    });

    it('calls onChange when clicking already selected option', async () => {
      const handleChange = vi.fn();
      const { user } = render(<StatusFilter value="enabled" onChange={handleChange} />);

      await user.click(screen.getByText('Enabled'));
      expect(handleChange).toHaveBeenCalledWith('enabled');
    });
  });

  describe('disabled state', () => {
    it('disables all buttons when disabled', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} disabled />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      const { user } = render(<StatusFilter value="all" onChange={handleChange} disabled />);

      await user.click(screen.getByText('Enabled'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has proper group role', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has accessible group label', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    });

    it('buttons are focusable via keyboard', async () => {
      const { user } = render(<StatusFilter value="all" onChange={vi.fn()} />);

      await user.tab();
      expect(screen.getByTestId('status-filter-all')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('status-filter-enabled')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('status-filter-disabled')).toHaveFocus();
    });

    it('can select via keyboard', async () => {
      const handleChange = vi.fn();
      const { user } = render(<StatusFilter value="all" onChange={handleChange} />);

      await user.tab();
      await user.tab(); // Focus on "Enabled"
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith('enabled');
    });
  });

  describe('selection states', () => {
    it('correctly shows "all" as selected', () => {
      render(<StatusFilter value="all" onChange={vi.fn()} />);
      expect(screen.getByTestId('status-filter-all')).toHaveAttribute('aria-pressed', 'true');
    });

    it('correctly shows "enabled" as selected', () => {
      render(<StatusFilter value="enabled" onChange={vi.fn()} />);
      expect(screen.getByTestId('status-filter-enabled')).toHaveAttribute('aria-pressed', 'true');
    });

    it('correctly shows "disabled" as selected', () => {
      render(<StatusFilter value="disabled" onChange={vi.fn()} />);
      expect(screen.getByTestId('status-filter-disabled')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('edge cases', () => {
    it('handles zero counts', () => {
      const counts = { all: 0, enabled: 0, disabled: 0 };
      render(<StatusFilter value="all" onChange={vi.fn()} counts={counts} />);
      
      // Should show three zeros
      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });

    it('handles large counts', () => {
      const counts = { all: 99999, enabled: 50000, disabled: 49999 };
      render(<StatusFilter value="all" onChange={vi.fn()} counts={counts} />);
      
      expect(screen.getByText('99999')).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot without counts', () => {
      const { container } = render(<StatusFilter value="all" onChange={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with counts', () => {
      const counts = { all: 10, enabled: 6, disabled: 4 };
      const { container } = render(<StatusFilter value="enabled" onChange={vi.fn()} counts={counts} />);
      expect(container).toMatchSnapshot();
    });
  });
});
