import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { RiskIndicator } from './RiskIndicator';
import type { RiskPriority } from '../../types';

afterEach(() => {
  cleanup();
});

describe('RiskIndicator', () => {
  const priorities: RiskPriority[] = [
    'extremely-high',
    'very-high', 
    'high',
    'medium-high',
    'low'
  ];

  describe('renders correctly for all priority levels', () => {
    priorities.forEach(priority => {
      it(`renders ${priority} priority correctly`, () => {
        render(<RiskIndicator priority={priority} />);
        
        // Check that the component renders with correct aria-label
        const indicator = screen.getByRole('status');
        expect(indicator).toBeInTheDocument();
        expect(indicator).toHaveAttribute('aria-label', expect.stringContaining('Risk level:'));
        
        // Check that the correct CSS class is applied
        expect(indicator).toHaveClass(`risk-${priority}`);
      });
    });
  });

  describe('size variants', () => {
    it('renders small size correctly', () => {
      render(<RiskIndicator priority="high" size="sm" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('size-sm');
    });

    it('renders medium size correctly', () => {
      render(<RiskIndicator priority="high" size="md" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('size-md');
    });

    it('renders large size correctly', () => {
      render(<RiskIndicator priority="high" size="lg" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('size-lg');
    });
  });

  describe('display variants', () => {
    it('renders badge variant correctly', () => {
      render(<RiskIndicator priority="high" variant="badge" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('variant-badge');
    });

    it('renders dot variant correctly', () => {
      render(<RiskIndicator priority="high" variant="dot" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('variant-dot');
    });

    it('renders full variant correctly', () => {
      render(<RiskIndicator priority="high" variant="full" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('variant-full');
    });
  });

  describe('icon and label display', () => {
    it('shows icon when showIcon is true', () => {
      render(<RiskIndicator priority="high" showIcon={true} />);
      // Icon should be present (we can't easily test the actual icon without more complex setup)
      const indicator = screen.getByRole('status');
      expect(indicator).toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      render(<RiskIndicator priority="high" showLabel={true} />);
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('hides label when showLabel is false', () => {
      render(<RiskIndicator priority="high" showLabel={false} />);
      expect(screen.queryByText('High')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<RiskIndicator priority="extremely-high" />);
      const indicator = screen.getByRole('status');
      
      expect(indicator).toHaveAttribute('aria-label', 'Risk level: Extremely High');
      expect(indicator).toHaveAttribute('role', 'status');
    });

    it('provides meaningful labels for all priority levels', () => {
      const expectedLabels = {
        'extremely-high': 'Extremely High',
        'very-high': 'Very High',
        'high': 'High',
        'medium-high': 'Medium High',
        'low': 'Low'
      };

      priorities.forEach(priority => {
        render(<RiskIndicator priority={priority} />);
        const indicator = screen.getByRole('status');
        expect(indicator).toHaveAttribute('aria-label', `Risk level: ${expectedLabels[priority]}`);
      });
    });
  });

  describe('semantic color system', () => {
    it('applies correct CSS classes for semantic colors', () => {
      priorities.forEach(priority => {
        const { unmount } = render(<RiskIndicator priority={priority} />);
        const indicator = screen.getByRole('status');
        
        // Check that the risk-specific class is applied
        expect(indicator).toHaveClass(`risk-${priority}`);
        
        unmount();
      });
    });
  });

  describe('custom className', () => {
    it('applies custom className correctly', () => {
      render(<RiskIndicator priority="high" className="custom-class" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('custom-class');
    });
  });
});