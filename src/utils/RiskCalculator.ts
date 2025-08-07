// Risk Calculator utility for heritage site risk assessment
// Implements ABC Scale methodology for risk prioritization

import type { RiskPriority, UncertaintyLevel } from '../types';

/**
 * Risk Calculator implementing ABC Scale methodology
 * A = Probability (1-5), B = Loss of Value (1-5), C = Fraction Affected (1-5)
 * Magnitude = A + B + C (range: 3-15)
 */
export class RiskCalculator {
  
  /**
   * Calculate risk priority based on magnitude using ABC Scale
   * @param magnitude Combined A+B+C score (3-15)
   * @returns Risk priority level
   */
  static calculatePriority(magnitude: number): RiskPriority {
    if (magnitude >= 13) return 'extremely-high';
    if (magnitude >= 10) return 'very-high';
    if (magnitude >= 7) return 'high';
    if (magnitude >= 4) return 'medium-high';
    return 'low';
  }

  /**
   * Calculate magnitude from individual ABC components
   * @param probability A component (1-5)
   * @param lossOfValue B component (1-5)
   * @param fractionAffected C component (1-5)
   * @returns Combined magnitude score
   */
  static calculateMagnitude(
    probability: number, 
    lossOfValue: number, 
    fractionAffected: number
  ): number {
    return probability + lossOfValue + fractionAffected;
  }

  /**
   * Apply uncertainty matrix adjustments to priority recommendations
   * @param basePriority Base priority from magnitude calculation
   * @param uncertaintyLevel Level of uncertainty in the assessment
   * @returns Adjusted priority recommendation
   */
  static applyUncertaintyAdjustment(
    basePriority: RiskPriority, 
    uncertaintyLevel: UncertaintyLevel
  ): RiskPriority {
    const priorityLevels: RiskPriority[] = ['low', 'medium-high', 'high', 'very-high', 'extremely-high'];
    const currentIndex = priorityLevels.indexOf(basePriority);
    
    switch (uncertaintyLevel) {
      case 'high':
        // High uncertainty: consider upgrading priority for precautionary approach
        return currentIndex < priorityLevels.length - 1 
          ? priorityLevels[currentIndex + 1] 
          : basePriority;
      case 'medium':
        // Medium uncertainty: no adjustment
        return basePriority;
      case 'low':
        // Low uncertainty: priority stands as calculated
        return basePriority;
      default:
        return basePriority;
    }
  }

  /**
   * Get numeric weight for priority level (for sorting)
   * @param priority Risk priority level
   * @returns Numeric weight (higher = more urgent)
   */
  static getPriorityWeight(priority: RiskPriority): number {
    switch (priority) {
      case 'extremely-high': return 5;
      case 'very-high': return 4;
      case 'high': return 3;
      case 'medium-high': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  /**
   * Validate ABC component values
   * @param value Component value to validate
   * @returns True if valid (1-5), false otherwise
   */
  static isValidComponent(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }

  /**
   * Get risk priority color for UI display
   * @param priority Risk priority level
   * @returns CSS color value
   */
  static getPriorityColor(priority: RiskPriority): string {
    switch (priority) {
      case 'extremely-high': return '#dc3545';
      case 'very-high': return '#ff6b35';
      case 'high': return '#ffc107';
      case 'medium-high': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  /**
   * Get human-readable priority label
   * @param priority Risk priority level
   * @returns Formatted label for display
   */
  static getPriorityLabel(priority: RiskPriority): string {
    return priority.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Calculate overall site risk from multiple assessments
   * @param assessments Array of risk assessments for a site
   * @returns Overall risk priority for the site
   */
  static calculateOverallSiteRisk(assessments: Array<{
    magnitude: number;
    priority: RiskPriority;
    uncertaintyLevel: UncertaintyLevel;
  }>): RiskPriority {
    if (assessments.length === 0) return 'low';

    // Find the highest priority assessment
    const priorities = assessments.map(a => this.getPriorityWeight(a.priority));
    const maxPriorityWeight = Math.max(...priorities);
    
    // Count high uncertainty assessments
    const highUncertaintyCount = assessments.filter(a => a.uncertaintyLevel === 'high').length;
    const uncertaintyRatio = highUncertaintyCount / assessments.length;
    
    // Apply precautionary principle if many assessments have high uncertainty
    let adjustedWeight = maxPriorityWeight;
    if (uncertaintyRatio > 0.5 && maxPriorityWeight < 5) {
      adjustedWeight = Math.min(maxPriorityWeight + 1, 5);
    }

    // Convert back to priority level
    const priorityLevels: RiskPriority[] = ['low', 'medium-high', 'high', 'very-high', 'extremely-high'];
    return priorityLevels[adjustedWeight - 1] || 'low';
  }

  /**
   * Generate risk assessment recommendations based on priority and threat type
   * @param priority Risk priority level
   * @param threatType Type of threat
   * @param magnitude Risk magnitude score
   * @returns Array of recommended actions
   */
  static generateRecommendations(
    priority: RiskPriority, 
    threatType: string, 
    magnitude: number
  ): string[] {
    const baseRecommendations = this.getBaseRecommendations(threatType);
    const urgencyPrefix = this.getUrgencyPrefix(priority);
    
    const recommendations = baseRecommendations.map((rec, index) => {
      if (index === 0 && urgencyPrefix) {
        return `${urgencyPrefix}: ${rec}`;
      }
      return rec;
    });

    // Add magnitude-specific recommendations
    if (magnitude >= 12) {
      recommendations.push('Consider emergency intervention protocols');
    } else if (magnitude >= 9) {
      recommendations.push('Schedule detailed assessment within 30 days');
    } else if (magnitude >= 6) {
      recommendations.push('Include in next quarterly review cycle');
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  /**
   * Calculate risk trend from historical assessments
   * @param assessments Historical assessments sorted by date (newest first)
   * @returns Trend indicator: 'increasing', 'stable', 'decreasing'
   */
  static calculateRiskTrend(assessments: Array<{
    magnitude: number;
    assessmentDate: Date;
  }>): 'increasing' | 'stable' | 'decreasing' {
    if (assessments.length < 2) return 'stable';

    // Compare recent assessments (last 6 months) with older ones
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentAssessments = assessments.filter(a => a.assessmentDate >= sixMonthsAgo);
    const olderAssessments = assessments.filter(a => a.assessmentDate < sixMonthsAgo);

    if (recentAssessments.length === 0 || olderAssessments.length === 0) {
      return 'stable';
    }

    const recentAverage = recentAssessments.reduce((sum, a) => sum + a.magnitude, 0) / recentAssessments.length;
    const olderAverage = olderAssessments.reduce((sum, a) => sum + a.magnitude, 0) / olderAssessments.length;

    const difference = recentAverage - olderAverage;

    if (difference > 1) return 'increasing';
    if (difference < -1) return 'decreasing';
    return 'stable';
  }

  // Private helper methods

  private static getBaseRecommendations(threatType: string): string[] {
    const recommendations: Record<string, string[]> = {
      'earthquake': [
        'Conduct structural engineering assessment',
        'Implement seismic retrofitting measures',
        'Develop emergency response plan'
      ],
      'flooding': [
        'Install flood monitoring systems',
        'Improve drainage infrastructure',
        'Develop flood emergency procedures'
      ],
      'weathering': [
        'Implement conservation treatments',
        'Install protective coverings',
        'Monitor environmental conditions'
      ],
      'vegetation': [
        'Develop vegetation management plan',
        'Remove invasive plant species',
        'Monitor root system impacts'
      ],
      'urban-development': [
        'Establish protective buffer zones',
        'Conduct environmental impact assessments',
        'Advocate for heritage-sensitive policies'
      ],
      'tourism-pressure': [
        'Implement visitor management system',
        'Develop sustainable tourism infrastructure',
        'Create visitor education programs'
      ],
      'looting': [
        'Enhance site security measures',
        'Collaborate with law enforcement',
        'Implement community engagement programs'
      ],
      'conflict': [
        'Develop emergency protection protocols',
        'Coordinate with international organizations',
        'Document and preserve heritage information'
      ],
      'climate-change': [
        'Develop climate adaptation strategies',
        'Monitor environmental conditions',
        'Implement resilient conservation techniques'
      ]
    };

    return recommendations[threatType] || [
      'Conduct detailed threat assessment',
      'Develop mitigation strategies',
      'Monitor threat progression'
    ];
  }

  private static getUrgencyPrefix(priority: RiskPriority): string | null {
    switch (priority) {
      case 'extremely-high': return 'URGENT';
      case 'very-high': return 'HIGH PRIORITY';
      case 'high': return 'PRIORITY';
      default: return null;
    }
  }
}