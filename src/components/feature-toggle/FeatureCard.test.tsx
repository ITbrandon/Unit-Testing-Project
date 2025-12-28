import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { FeatureCard } from './FeatureCard';
import { createTestFeature } from '../../test/test-utils';

/**
 * FeatureCard Test Suite
 * 
 * Tests the feature card component that displays individual feature information
 * and toggle functionality. Covers rendering, interactions, and edge cases.
 */

describe('FeatureCard', () => {
  const defaultFeature = createTestFeature({
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Enable dark theme for the application',
    enabled: false,
    category: 'ui',
  });

  describe('rendering', () => {
    it('renders feature name', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('renders feature description', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('Enable dark theme for the application')).toBeInTheDocument();
    });

    it('renders feature category', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('ui')).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('shows OFF badge when disabled', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('OFF')).toBeInTheDocument();
    });

    it('shows ON badge when enabled', () => {
      const enabledFeature = { ...defaultFeature, enabled: true };
      render(<FeatureCard feature={enabledFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('ON')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <FeatureCard 
          feature={defaultFeature} 
          onToggle={vi.fn()} 
          className="custom-class" 
        />
      );
      const card = screen.getByTestId('feature-card-dark-mode');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('toggle state', () => {
    it('renders unchecked toggle for disabled feature', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      const toggle = screen.getByRole('switch');
      expect(toggle).not.toBeChecked();
    });

    it('renders checked toggle for enabled feature', () => {
      const enabledFeature = { ...defaultFeature, enabled: true };
      render(<FeatureCard feature={enabledFeature} onToggle={vi.fn()} />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeChecked();
    });

    it('has data-enabled attribute matching feature state', () => {
      const enabledFeature = { ...defaultFeature, enabled: true };
      render(<FeatureCard feature={enabledFeature} onToggle={vi.fn()} />);
      const card = screen.getByTestId('feature-card-dark-mode');
      expect(card).toHaveAttribute('data-enabled', 'true');
    });
  });

  describe('user interactions', () => {
    it('calls onToggle with feature id and new state when toggle clicked', async () => {
      const handleToggle = vi.fn();
      const { user } = render(
        <FeatureCard feature={defaultFeature} onToggle={handleToggle} />
      );

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(handleToggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('calls onToggle with false when enabled feature is toggled off', async () => {
      const handleToggle = vi.fn();
      const enabledFeature = { ...defaultFeature, enabled: true };
      const { user } = render(
        <FeatureCard feature={enabledFeature} onToggle={handleToggle} />
      );

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(handleToggle).toHaveBeenCalledWith('dark-mode', false);
    });
  });

  describe('disabled state', () => {
    it('disables toggle when disabled prop is true', () => {
      render(
        <FeatureCard feature={defaultFeature} onToggle={vi.fn()} disabled />
      );
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
    });

    it('does not call onToggle when disabled', async () => {
      const handleToggle = vi.fn();
      const { user } = render(
        <FeatureCard feature={defaultFeature} onToggle={handleToggle} disabled />
      );

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(handleToggle).not.toHaveBeenCalled();
    });

    it('applies opacity when disabled', () => {
      render(
        <FeatureCard feature={defaultFeature} onToggle={vi.fn()} disabled />
      );
      const card = screen.getByTestId('feature-card-dark-mode');
      expect(card).toHaveClass('opacity-50');
    });
  });

  describe('accessibility', () => {
    it('has accessible toggle label', () => {
      render(<FeatureCard feature={defaultFeature} onToggle={vi.fn()} />);
      expect(screen.getByLabelText('Toggle Dark Mode')).toBeInTheDocument();
    });

    it('toggle can be focused via keyboard', async () => {
      const { user } = render(
        <FeatureCard feature={defaultFeature} onToggle={vi.fn()} />
      );

      await user.tab();
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveFocus();
    });
  });

  describe('edge cases', () => {
    it('handles long feature names gracefully', () => {
      const longNameFeature = {
        ...defaultFeature,
        name: 'This is a very long feature name that might overflow the container',
      };
      render(<FeatureCard feature={longNameFeature} onToggle={vi.fn()} />);
      expect(screen.getByText(longNameFeature.name)).toBeInTheDocument();
    });

    it('handles long descriptions with truncation', () => {
      const longDescFeature = {
        ...defaultFeature,
        description: 'This is a very long description '.repeat(10),
      };
      render(<FeatureCard feature={longDescFeature} onToggle={vi.fn()} />);
      const description = screen.getByText(/This is a very long description/);
      expect(description).toHaveClass('line-clamp-2');
    });

    it('handles empty description', () => {
      const emptyDescFeature = { ...defaultFeature, description: '' };
      render(<FeatureCard feature={emptyDescFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('handles special characters in feature data', () => {
      const specialFeature = {
        ...defaultFeature,
        name: 'Feature <script>alert("xss")</script>',
        description: 'Description with "quotes" & ampersands',
      };
      render(<FeatureCard feature={specialFeature} onToggle={vi.fn()} />);
      expect(screen.getByText('Feature <script>alert("xss")</script>')).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('matches snapshot for disabled feature', () => {
      const { container } = render(
        <FeatureCard feature={defaultFeature} onToggle={vi.fn()} />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for enabled feature', () => {
      const enabledFeature = { ...defaultFeature, enabled: true };
      const { container } = render(
        <FeatureCard feature={enabledFeature} onToggle={vi.fn()} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
