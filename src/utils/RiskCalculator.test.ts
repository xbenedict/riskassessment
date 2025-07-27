import { describe, it, expect } from 'vitest';
import { RiskCalculator } from './RiskCalculator';
import type { RiskPriority, UncertaintyLevel } from '../types';

describe('RiskCalculator', () => {
  describe('calculateMagnitude', () => {
    it('should calculate correct magnitude for valid ABC components', () => {
      expect(RiskCalculator.calculateMagnitude(1, 1, 1)).toBe(3);
      expect(RiskCalculator.calculateMagnitude(2, 3, 4)).toBe(9);
      expect(RiskCalculator.calculateMagnitude(5, 5, 5)).toBe(15);
      expect(RiskCalculator.calculateMagnitude(3, 2, 1)).toBe(6);
    });

    it('should throw error for invalid component values', () => {
      expect(() => RiskCalculator.calculateMagnitude(0, 1, 1)).toThrow(
        'All ABC components must be integers between 1 and 5'
      );
      expect(() => RiskCalculator.calculateMagnitude(1, 6, 1)).toThrow(
        'All ABC components must be integers between 1 and 5'
      );
      expect(() => RiskCalculator.calculateMagnitude(1.5, 1, 1)).toThrow(
        'All ABC components must be integers between 1 and 5'
      );
      expect(() => RiskCalculator.calculateMagnitude(-1, 1, 1)).toThrow(
        'All ABC components must be integers between 1 and 5'
      );
    });
  });

  describe('categorizePriority', () => {
    it('should categorize magnitude 3 as low priority', () => {
      expect(RiskCalculator.categorizePriority(3)).toBe('low');
    });

    it('should categorize magnitude 4-6 as medium-high priority', () => {
      expect(RiskCalculator.categorizePriority(4)).toBe('medium-high');
      expect(RiskCalculator.categorizePriority(5)).toBe('medium-high');
      expect(RiskCalculator.categorizePriority(6)).toBe('medium-high');
    });

    it('should categorize magnitude 7-9 as high priority', () => {
      expect(RiskCalculator.categorizePriority(7)).toBe('high');
      expect(RiskCalculator.categorizePriority(8)).toBe('high');
      expect(RiskCalculator.categorizePriority(9)).toBe('high');
    });

    it('should categorize magnitude 10-12 as very-high priority', () => {
      expect(RiskCalculator.categorizePriority(10)).toBe('very-high');
      expect(RiskCalculator.categorizePriority(11)).toBe('very-high');
      expect(RiskCalculator.categorizePriority(12)).toBe('very-high');
    });

    it('should categorize magnitude 13-15 as extremely-high priority', () => {
      expect(RiskCalculator.categorizePriority(13)).toBe('extremely-high');
      expect(RiskCalculator.categorizePriority(14)).toBe('extremely-high');
      expect(RiskCalculator.categorizePriority(15)).toBe('extremely-high');
    });

    it('should throw error for invalid magnitude values', () => {
      expect(() => RiskCalculator.categorizePriority(2)).toThrow(
        'Risk magnitude must be between 3 and 15'
      );
      expect(() => RiskCalculator.categorizePriority(16)).toThrow(
        'Risk magnitude must be between 3 and 15'
      );
    });
  });

  describe('applyUncertaintyMatrix', () => {
    it('should not adjust priority for low uncertainty', () => {
      expect(RiskCalculator.applyUncertaintyMatrix('low', 'low')).toBe('low');
      expect(RiskCalculator.applyUncertaintyMatrix('medium-high', 'low')).toBe('medium-high');
      expect(RiskCalculator.applyUncertaintyMatrix('high', 'low')).toBe('high');
      expect(RiskCalculator.applyUncertaintyMatrix('very-high', 'low')).toBe('very-high');
      expect(RiskCalculator.applyUncertaintyMatrix('extremely-high', 'low')).toBe('extremely-high');
    });

    it('should apply moderate adjustments for medium uncertainty', () => {
      expect(RiskCalculator.applyUncertaintyMatrix('low', 'medium')).toBe('medium-high');
      expect(RiskCalculator.applyUncertaintyMatrix('medium-high', 'medium')).toBe('high');
      expect(RiskCalculator.applyUncertaintyMatrix('high', 'medium')).toBe('very-high');
      expect(RiskCalculator.applyUncertaintyMatrix('very-high', 'medium')).toBe('extremely-high');
      expect(RiskCalculator.applyUncertaintyMatrix('extremely-high', 'medium')).toBe('extremely-high');
    });

    it('should apply conservative adjustments for high uncertainty', () => {
      expect(RiskCalculator.applyUncertaintyMatrix('low', 'high')).toBe('high');
      expect(RiskCalculator.applyUncertaintyMatrix('medium-high', 'high')).toBe('very-high');
      expect(RiskCalculator.applyUncertaintyMatrix('high', 'high')).toBe('extremely-high');
      expect(RiskCalculator.applyUncertaintyMatrix('very-high', 'high')).toBe('extremely-high');
      expect(RiskCalculator.applyUncertaintyMatrix('extremely-high', 'high')).toBe('extremely-high');
    });
  });

  describe('getPriorityWeight', () => {
    it('should return correct numeric weights for sorting', () => {
      expect(RiskCalculator.getPriorityWeight('low')).toBe(1);
      expect(RiskCalculator.getPriorityWeight('medium-high')).toBe(2);
      expect(RiskCalculator.getPriorityWeight('high')).toBe(3);
      expect(RiskCalculator.getPriorityWeight('very-high')).toBe(4);
      expect(RiskCalculator.getPriorityWeight('extremely-high')).toBe(5);
    });

    it('should maintain correct ordering for priority levels', () => {
      const priorities: RiskPriority[] = ['low', 'medium-high', 'high', 'very-high', 'extremely-high'];
      const weights = priorities.map(p => RiskCalculator.getPriorityWeight(p));

      // Verify weights are in ascending order
      for (let i = 1; i < weights.length; i++) {
        expect(weights[i]).toBeGreaterThan(weights[i - 1]);
      }
    });
  });

  describe('getPriorityDescription', () => {
    it('should return appropriate descriptions for each priority level', () => {
      expect(RiskCalculator.getPriorityDescription('low')).toContain('Low priority');
      expect(RiskCalculator.getPriorityDescription('medium-high')).toContain('Moderate concern');
      expect(RiskCalculator.getPriorityDescription('high')).toContain('Action required');
      expect(RiskCalculator.getPriorityDescription('very-high')).toContain('Urgent action');
      expect(RiskCalculator.getPriorityDescription('extremely-high')).toContain('Immediate action');
    });
  });

  describe('calculateRisk', () => {
    it('should return complete risk calculation with all components', () => {
      const result = RiskCalculator.calculateRisk(3, 3, 3, 'low');

      expect(result.magnitude).toBe(9);
      expect(result.basePriority).toBe('high');
      expect(result.adjustedPriority).toBe('high');
      expect(result.description).toContain('Action required');
      expect(result.weight).toBe(3);
    });

    it('should apply uncertainty adjustments in complete calculation', () => {
      const lowUncertainty = RiskCalculator.calculateRisk(2, 2, 2, 'low');
      const highUncertainty = RiskCalculator.calculateRisk(2, 2, 2, 'high');

      expect(lowUncertainty.magnitude).toBe(6);
      expect(lowUncertainty.basePriority).toBe('medium-high');
      expect(lowUncertainty.adjustedPriority).toBe('medium-high');

      expect(highUncertainty.magnitude).toBe(6);
      expect(highUncertainty.basePriority).toBe('medium-high');
      expect(highUncertainty.adjustedPriority).toBe('very-high');
      expect(highUncertainty.weight).toBeGreaterThan(lowUncertainty.weight);
    });

    it('should use low uncertainty as default', () => {
      const withDefault = RiskCalculator.calculateRisk(1, 1, 1);
      const withExplicitLow = RiskCalculator.calculateRisk(1, 1, 1, 'low');

      expect(withDefault).toEqual(withExplicitLow);
    });
  });

  describe('getComponentDescription', () => {
    it('should return correct descriptions for probability component (A)', () => {
      expect(RiskCalculator.getComponentDescription('A', 1)).toContain('Very unlikely');
      expect(RiskCalculator.getComponentDescription('A', 3)).toContain('Possible');
      expect(RiskCalculator.getComponentDescription('A', 5)).toContain('Very likely');
    });

    it('should return correct descriptions for loss of value component (B)', () => {
      expect(RiskCalculator.getComponentDescription('B', 1)).toContain('Negligible loss');
      expect(RiskCalculator.getComponentDescription('B', 3)).toContain('Moderate loss');
      expect(RiskCalculator.getComponentDescription('B', 5)).toContain('Complete loss');
    });

    it('should return correct descriptions for fraction affected component (C)', () => {
      expect(RiskCalculator.getComponentDescription('C', 1)).toContain('Less than 1%');
      expect(RiskCalculator.getComponentDescription('C', 3)).toContain('10-50%');
      expect(RiskCalculator.getComponentDescription('C', 5)).toContain('More than 90%');
    });

    it('should return error message for invalid values', () => {
      expect(RiskCalculator.getComponentDescription('A', 0)).toBe('Invalid value');
      expect(RiskCalculator.getComponentDescription('B', 6)).toBe('Invalid value');
    });
  });

  describe('Edge cases and integration', () => {
    it('should handle minimum risk scenario correctly', () => {
      const result = RiskCalculator.calculateRisk(1, 1, 1, 'low');
      expect(result.magnitude).toBe(3);
      expect(result.basePriority).toBe('low');
      expect(result.adjustedPriority).toBe('low');
    });

    it('should handle maximum risk scenario correctly', () => {
      const result = RiskCalculator.calculateRisk(5, 5, 5, 'high');
      expect(result.magnitude).toBe(15);
      expect(result.basePriority).toBe('extremely-high');
      expect(result.adjustedPriority).toBe('extremely-high');
    });

    it('should demonstrate uncertainty matrix impact across all levels', () => {
      const testCases: Array<{
        components: [number, number, number];
        expectedBase: RiskPriority;
        expectedHigh: RiskPriority;
      }> = [
          { components: [1, 1, 1], expectedBase: 'low', expectedHigh: 'high' },
          { components: [2, 1, 1], expectedBase: 'medium-high', expectedHigh: 'very-high' },
          { components: [3, 2, 2], expectedBase: 'high', expectedHigh: 'extremely-high' },
          { components: [4, 3, 3], expectedBase: 'very-high', expectedHigh: 'extremely-high' },
        ];

      testCases.forEach(({ components, expectedBase, expectedHigh }) => {
        const [a, b, c] = components;
        const lowResult = RiskCalculator.calculateRisk(a, b, c, 'low');
        const highResult = RiskCalculator.calculateRisk(a, b, c, 'high');

        expect(lowResult.adjustedPriority).toBe(expectedBase);
        expect(highResult.adjustedPriority).toBe(expectedHigh);
        expect(highResult.weight).toBeGreaterThanOrEqual(lowResult.weight);
      });
    });
  });
});