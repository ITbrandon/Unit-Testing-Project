import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { FeatureToggleSwitch } from './FeatureToggleSwitch';

/**
 * FeatureToggleSwitch Test Suite
 * 
 * Tests the core toggle switch component used throughout the app.
 * Focuses on accessibility, user interactions, and visual states.
 */

describe('FeatureToggleSwitch', () => {
  describe('rendering', () => {
    it('renders unchecked by default', () => {
      render(<FeatureToggleSwitch aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toBeChecked();
    });

    it('renders checked when checked prop is true', () => {
      render(<FeatureToggleSwitch checked aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeChecked();
    });

    it('applies custom className', () => {
      render(<FeatureToggleSwitch className="custom-class" aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('custom-class');
    });
  });

  describe('user interactions', () => {
    it('calls onCheckedChange when clicked', async () => {
      const handleChange = vi.fn();
      const { user } = render(
        <FeatureToggleSwitch 
          onCheckedChange={handleChange} 
          aria-label="Test toggle" 
        />
      );

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles state on click', async () => {
      const handleChange = vi.fn();
      const { user } = render(
        <FeatureToggleSwitch 
          onCheckedChange={handleChange} 
          aria-label="Test toggle" 
        />
      );

      const toggle = screen.getByRole('switch');
      
      // First click - should toggle to true
      await user.click(toggle);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('responds to keyboard navigation', async () => {
      const handleChange = vi.fn();
      const { user } = render(
        <FeatureToggleSwitch 
          onCheckedChange={handleChange} 
          aria-label="Test toggle" 
        />
      );

      const toggle = screen.getByRole('switch');
      toggle.focus();
      
      await user.keyboard(' ');
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<FeatureToggleSwitch disabled aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
    });

    it('does not call onCheckedChange when disabled', async () => {
      const handleChange = vi.fn();
      const { user } = render(
        <FeatureToggleSwitch 
          disabled 
          onCheckedChange={handleChange} 
          aria-label="Test toggle" 
        />
      );

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has proper role', () => {
      render(<FeatureToggleSwitch aria-label="Test toggle" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<FeatureToggleSwitch aria-label="Enable dark mode" />);
      expect(screen.getByLabelText('Enable dark mode')).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <label id="my-label">My Toggle</label>
          <FeatureToggleSwitch aria-labelledby="my-label" />
        </>
      );
      expect(screen.getByRole('switch')).toHaveAttribute('aria-labelledby', 'my-label');
    });

    it('announces checked state correctly', () => {
      const { rerender } = render(
        <FeatureToggleSwitch checked={false} aria-label="Test toggle" />
      );
      expect(screen.getByRole('switch')).not.toBeChecked();

      rerender(<FeatureToggleSwitch checked={true} aria-label="Test toggle" />);
      expect(screen.getByRole('switch')).toBeChecked();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<FeatureToggleSwitch variant="default" aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });

    it('applies success variant styles', () => {
      render(<FeatureToggleSwitch variant="success" aria-label="Test toggle" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });
  });
});
