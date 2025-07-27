// Risk Calculator utility functions for ABC scale methodology
// Implements ICCROM guidelines for heritage risk assessment

import type { RiskPriority, UncertaintyLevel } from '../types';

/**
 * Risk Calculator implementing ABC scale methodology
 * A = Probability (1-5), B = Loss of Value (1-5), C = Fraction Affected (1-5)
 * Magnitude = A + B + C (range: 3-15)
 */
export class RiskCalculator {
  
  /**
   * Calculate risk magnitude using ABC scale methodology
   * @param probability A component: likelihood of threat occurring (1-5)
   * @param lossOfValue B component: potential loss of heritage value (1-5)
   * @param fractionAffected C component: portion of site affected (1-5)
   * @returns Risk magnitude (3-15)
   */
  static calculateMagnitude(probability: number, lossOfValue: number, fractionAffected: number): number {
    // Validate input ranges
    if (!this.isValidComponent(probability) || 
        !this.isValidComponent(lossOfValue) || 
        !this.isValidComponent(fractionAffected)) {
      throw new Error('All ABC components must be integers between 1 and 5');
    }
    
    return probability + lossOfValue + fractionAffected;
  }
  
  /**
   * Categorize risk magnitude into priority levels
   * Based on ICCROM guidelines for heritage risk assessment
   * @param magnitude Risk magnitude (3-15)
   * @returns Risk priority level
   */
  static categorizePriority(magnitude: number): RiskPriority {
    if (magnitude < 3 || magnitude > 15) {
      throw new Error('Risk magnitude must be between 3 and 15');
    }
    
    if (magnitude >= 13) return 'extremely-high';
    if (magnitude >= 10) return 'very-high';
    if (magnitude >= 7) return 'high';
    if (magnitude >= 4) return 'medium-high';
    return 'low'; // magnitude === 3
  }
  
  /**
   * Apply uncertainty matrix to adjust priority recommendations
   * Higher uncertainty levels may require more conservative approaches
   * @param priority Base priority from magnitude calculation
   * @param uncertaintyLevel Level of uncertainty in the assessment
   * @returns Adjusted priority level
   */
  static applyUncertaintyMatrix(priority: RiskPriority, uncertaintyLevel: UncertaintyLevel): RiskPriority {
    // Uncertainty matrix adjustments based on heritage risk management best practices
    const adjustments: Record<UncertaintyLevel, Record<RiskPriority, RiskPriority>> = {
      'low': {
        // No adjustment for low uncertainty
        'extremely-high': 'extremely-high',
        'very-high': 'very-high',
        'high': 'high',
        'medium-high': 'medium-high',
        'low': 'low'
      },
      'medium': {
        // Slight upward adjustment for medium uncertainty
        'extremely-high': 'extremely-high',
        'very-high': 'extremely-high',
        'high': 'very-high',
        'medium-high': 'high',
        'low': 'medium-high'
      },
      'high': {
        // More conservative approach for high uncertainty
        'extremely-high': 'extremely-high',
        'very-high': 'extremely-high',
        'high': 'extremely-high',
        'medium-high': 'very-high',
        'low': 'high'
      }
    };
    
    return adjustments[uncertaintyLevel][priority];
  }
  
  /**
   * Get priority level numeric value for sorting
   * @param priority Risk priority level
   * @returns Numeric value (higher = more urgent)
   */
  static getPriorityWeight(priority: RiskPriority): number {
    const weights: Record<RiskPriority, number> = {
      'extremely-high': 5,
      'very-high': 4,
      'high': 3,
      'medium-high': 2,
      'low': 1
    };
    return weights[priority];
  }
  
  /**
   * Get human-readable description of priority level
   * @param priority Risk priority level
   * @returns Description string
   */
  static getPriorityDescription(priority: RiskPriority): string {
    const descriptions: Record<RiskPriority, string> = {
      'extremely-high': 'Immediate action required - critical threat to heritage value',
      'very-high': 'Urgent action needed - significant threat requiring prompt response',
      'high': 'Action required - notable threat that should be addressed soon',
      'medium-high': 'Moderate concern - should be monitored and planned for',
      'low': 'Low priority - routine monitoring sufficient'
    };
    return descriptions[priority];
  }
  
  /**
   * Calculate complete risk assessment from ABC components
   * @param probability A component (1-5)
   * @param lossOfValue B component (1-5)
   * @param fractionAffected C component (1-5)
   * @param uncertaintyLevel Uncertainty level for matrix adjustment
   * @returns Complete risk calculation result
   */
  static calculateRisk(
    probability: number, 
    lossOfValue: number, 
    fractionAffected: number, 
    uncertaintyLevel: UncertaintyLevel = 'low'
  ): {
    magnitude: number;
    basePriority: RiskPriority;
    adjustedPriority: RiskPriority;
    description: string;
    weight: number;
  } {
    const magnitude = this.calculateMagnitude(probability, lossOfValue, fractionAffected);
    const basePriority = this.categorizePriority(magnitude);
    const adjustedPriority = this.applyUncertaintyMatrix(basePriority, uncertaintyLevel);
    
    return {
      magnitude,
      basePriority,
      adjustedPriority,
      description: this.getPriorityDescription(adjustedPriority),
      weight: this.getPriorityWeight(adjustedPriority)
    };
  }
  
  /**
   * Validate that a component value is within valid range
   * @param value Component value to validate
   * @returns True if valid (1-5 integer)
   */
  private static isValidComponent(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }
  
  /**
   * Get component description for user guidance
   * @param component Component type ('A', 'B', or 'C')
   * @param value Component value (1-5)
   * @returns Human-readable description
   */
  static getComponentDescription(component: 'A' | 'B' | 'C', value: number): string {
    const descriptions = {
      'A': { // Probability
        1: 'Very unlikely to occur in the next 100 years',
        2: 'Unlikely to occur in the next 100 years',
        3: 'Possible to occur in the next 100 years',
        4: 'Likely to occur in the next 100 years',
        5: 'Very likely or certain to occur in the next 100 years'
      },
      'B': { // Loss of Value
        1: 'Negligible loss of heritage value',
        2: 'Minor loss of heritage value',
        3: 'Moderate loss of heritage value',
        4: 'Major loss of heritage value',
        5: 'Complete loss of heritage value'
      },
      'C': { // Fraction Affected
        1: 'Less than 1% of the site affected',
        2: '1-10% of the site affected',
        3: '10-50% of the site affected',
        4: '50-90% of the site affected',
        5: 'More than 90% of the site affected'
      }
    };
    
    return descriptions[component][value as keyof typeof descriptions[typeof component]] || 'Invalid value';
  }
}