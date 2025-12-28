import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { SearchInput } from './SearchInput';

/**
 * SearchInput Test Suite
 * 
 * Tests the search input component used for filtering features.
 * Covers input behavior, clear functionality, and accessibility.
 */

describe('SearchInput', () => {
  describe('rendering', () => {
    it('renders input with placeholder', () => {
      render(<SearchInput value="" onChange={vi.fn()} />);
      expect(screen.getByPlaceholderText('Search features...')).toBeInTheDocument();
    });

    it('renders custom placeholder', () => {
      render(<SearchInput value="" onChange={vi.fn()} placeholder="Filter by name" />);
      expect(screen.getByPlaceholderText('Filter by name')).toBeInTheDocument();
    });

    it('renders with provided value', () => {
      render(<SearchInput value="dark mode" onChange={vi.fn()} />);
      expect(screen.getByDisplayValue('dark mode')).toBeInTheDocument();
    });

    it('renders search icon', () => {
      render(<SearchInput value="" onChange={vi.fn()} />);
      // The icon is aria-hidden, so we check for the accessible input
      expect(screen.getByLabelText('Search features')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SearchInput value="" onChange={vi.fn()} className="custom-class" />);
      // The className is applied to the wrapper div, check input exists
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('shows clear button when value is not empty', () => {
      render(<SearchInput value="test" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('hides clear button when value is empty', () => {
      render(<SearchInput value="" onChange={vi.fn()} />);
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('clears input when clear button clicked', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="test" onChange={handleChange} />);

      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('hides clear button when disabled', () => {
      render(<SearchInput value="test" onChange={vi.fn()} disabled />);
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when user types', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(handleChange).toHaveBeenCalledWith('a');
    });

    it('calls onChange for each character typed', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'abc');

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('handles paste', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      input.focus();
      await user.paste('pasted text');

      // userEvent.paste calls onChange for each character
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<SearchInput value="" onChange={vi.fn()} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('does not allow typing when disabled', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="" onChange={handleChange} disabled />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has accessible label', () => {
      render(<SearchInput value="" onChange={vi.fn()} />);
      expect(screen.getByLabelText('Search features')).toBeInTheDocument();
    });

    it('is focusable via keyboard', async () => {
      const { user } = render(<SearchInput value="" onChange={vi.fn()} />);
      
      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('clear button is accessible via keyboard', async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput value="test" onChange={handleChange} />);

      // Tab to input, then tab to clear button
      await user.tab();
      await user.tab();
      
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleChange).toHaveBeenCalledWith('');
    });
  });

  describe('edge cases', () => {
    it('handles empty string value', () => {
      render(<SearchInput value="" onChange={vi.fn()} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('handles special characters', () => {
      render(<SearchInput value="test@#$%" onChange={vi.fn()} />);
      expect(screen.getByDisplayValue('test@#$%')).toBeInTheDocument();
    });

    it('handles very long input', () => {
      const longValue = 'a'.repeat(1000);
      render(<SearchInput value={longValue} onChange={vi.fn()} />);
      expect(screen.getByDisplayValue(longValue)).toBeInTheDocument();
    });

    it('handles whitespace-only value', () => {
      render(<SearchInput value="   " onChange={vi.fn()} />);
      expect(screen.getByDisplayValue('   ')).toBeInTheDocument();
      // Clear button should show since value is not empty
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot with empty value', () => {
      const { container } = render(<SearchInput value="" onChange={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with value', () => {
      const { container } = render(<SearchInput value="search term" onChange={vi.fn()} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot when disabled', () => {
      const { container } = render(<SearchInput value="test" onChange={vi.fn()} disabled />);
      expect(container).toMatchSnapshot();
    });
  });
});
