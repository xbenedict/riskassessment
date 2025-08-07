// Mock Data Service for simulating API calls during development
// In production, this would be replaced with actual API calls

import type { HeritageSite, RiskAssessment, ThreatType } from '../types';
import { mockSites } from '../utils/mockData';

/**
 * Mock service for heritage site and risk assessment data
 * Simulates async API calls with realistic delays
 */
export class MockDataService {
  
  /**
   * Get all heritage sites
   */
  static async getHeritageSites(): Promise<HeritageSite[]> {
    // Simulate API delay
    await this.delay(300);
    return [...mockSites];
  }

  /**
   * Get a specific heritage site by ID
   */
  static async getHeritageSite(siteId: string): Promise<HeritageSite | null> {
    await this.delay(200);
    return mockSites.find(site => site.id === siteId) || null;
  }

  /**
   * Get risk assessments for a specific site
   */
  static async getRiskAssessments(siteId: string): Promise<RiskAssessment[]> {
    await this.delay(400);
    
    // Generate mock risk assessments based on site's active threats
    const site = mockSites.find(s => s.id === siteId);
    if (!site) return [];

    const assessments: RiskAssessment[] = site.riskProfile.activeThreats.map((threat, index) => {
      const probability = Math.floor(Math.random() * 5) + 1;
      const lossOfValue = Math.floor(Math.random() * 5) + 1;
      const fractionAffected = Math.floor(Math.random() * 5) + 1;
      const magnitude = probability + lossOfValue + fractionAffected;
      
      return {
        id: `assessment-${siteId}-${threat}-${index}`,
        siteId,
        threatType: threat,
        probability,
        lossOfValue,
        fractionAffected,
        magnitude,
        priority: this.calculatePriority(magnitude),
        uncertaintyLevel: this.getRandomUncertaintyLevel(),
        assessmentDate: this.getRandomAssessmentDate(),
        assessor: this.getRandomAssessor(),
        notes: this.generateAssessmentNotes(threat, magnitude)
      };
    });

    // Add some additional historical assessments
    const additionalAssessments = this.generateAdditionalAssessments(siteId, site.riskProfile.activeThreats);
    
    return [...assessments, ...additionalAssessments].sort(
      (a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime()
    );
  }

  /**
   * Search heritage sites by various criteria
   */
  static async searchSites(criteria: {
    country?: string;
    riskLevel?: string;
    threatType?: ThreatType;
    searchTerm?: string;
  }): Promise<HeritageSite[]> {
    await this.delay(250);
    
    let filteredSites = [...mockSites];

    if (criteria.country) {
      filteredSites = filteredSites.filter(site => 
        site.location.country.toLowerCase().includes(criteria.country!.toLowerCase())
      );
    }

    if (criteria.riskLevel) {
      filteredSites = filteredSites.filter(site => 
        site.riskProfile.overallRisk === criteria.riskLevel
      );
    }

    if (criteria.threatType) {
      filteredSites = filteredSites.filter(site => 
        site.riskProfile.activeThreats.includes(criteria.threatType!)
      );
    }

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      filteredSites = filteredSites.filter(site => 
        site.name.toLowerCase().includes(term) ||
        site.description.toLowerCase().includes(term) ||
        site.significance.toLowerCase().includes(term)
      );
    }

    return filteredSites;
  }

  /**
   * Get recent risk assessments across all sites
   */
  static async getRecentAssessments(limit: number = 10): Promise<RiskAssessment[]> {
    await this.delay(300);
    
    // Get all assessments from all sites
    const allAssessments: RiskAssessment[] = [];
    
    for (const site of mockSites) {
      const siteAssessments = await this.getRiskAssessments(site.id);
      allAssessments.push(...siteAssessments);
    }
    
    // Sort by assessment date (newest first) and limit results
    return allAssessments
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())
      .slice(0, limit);
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<{
    totalSites: number;
    sitesAtRisk: number;
    totalThreats: number;
    recentAssessments: number;
  }> {
    await this.delay(200);
    
    const totalSites = mockSites.length;
    const sitesAtRisk = mockSites.filter(site => 
      site.riskProfile.overallRisk === 'extremely-high' || 
      site.riskProfile.overallRisk === 'very-high' ||
      site.riskProfile.overallRisk === 'high'
    ).length;
    
    const totalThreats = mockSites.reduce((sum, site) => 
      sum + site.riskProfile.activeThreats.length, 0
    );

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentAssessments = mockSites.filter(site => 
      site.riskProfile.lastUpdated >= oneMonthAgo
    ).length;

    return {
      totalSites,
      sitesAtRisk,
      totalThreats,
      recentAssessments
    };
  }

  // Private helper methods

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static calculatePriority(magnitude: number): string {
    if (magnitude >= 13) return 'extremely-high';
    if (magnitude >= 10) return 'very-high';
    if (magnitude >= 7) return 'high';
    if (magnitude >= 4) return 'medium-high';
    return 'low';
  }

  private static getRandomUncertaintyLevel(): 'low' | 'medium' | 'high' {
    const levels = ['low', 'medium', 'high'];
    return levels[Math.floor(Math.random() * levels.length)] as 'low' | 'medium' | 'high';
  }

  private static getRandomAssessmentDate(): Date {
    const now = new Date();
    const monthsAgo = Math.floor(Math.random() * 24); // Up to 2 years ago
    const date = new Date(now);
    date.setMonth(date.getMonth() - monthsAgo);
    return date;
  }

  private static getRandomAssessor(): string {
    const assessors = [
      'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      'Prof. Ahmed Hassan, Archaeological Institute',
      'Dr. Maria Rodriguez, Conservation Expert',
      'Dr. James Thompson, Risk Assessment Specialist',
      'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      'Prof. Giovanni Rossi, ICOMOS Representative',
      'Dr. Chen Wei, Cultural Heritage Analyst',
      'Dr. Amara Okafor, Site Management Specialist'
    ];
    return assessors[Math.floor(Math.random() * assessors.length)];
  }

  private static generateAssessmentNotes(threat: ThreatType, magnitude: number): string {
    const threatNotes: Record<ThreatType, string[]> = {
      'earthquake': [
        'Seismic activity monitoring shows increased vulnerability in structural elements.',
        'Recent geological surveys indicate potential for moderate seismic events.',
        'Foundation stability assessment reveals areas of concern requiring attention.'
      ],
      'flooding': [
        'Seasonal flooding patterns show increasing frequency and intensity.',
        'Drainage systems require immediate upgrade to handle extreme weather events.',
        'Water damage assessment reveals ongoing deterioration of lower structures.'
      ],
      'weathering': [
        'Accelerated weathering observed on exposed stone surfaces.',
        'Chemical analysis shows increased sulfate attack on limestone elements.',
        'Regular monitoring reveals progressive material degradation.'
      ],
      'vegetation': [
        'Root system penetration causing structural damage to foundations.',
        'Invasive plant species requiring immediate removal and management.',
        'Vegetation growth patterns indicate need for comprehensive management plan.'
      ],
      'urban-development': [
        'Nearby construction activities creating vibration and dust concerns.',
        'Urban expansion pressures requiring buffer zone establishment.',
        'Development impact assessment shows potential for cumulative effects.'
      ],
      'tourism-pressure': [
        'Visitor numbers exceeding sustainable capacity during peak seasons.',
        'Physical wear patterns indicate need for pathway management.',
        'Tourist impact monitoring shows accelerated deterioration in high-traffic areas.'
      ],
      'looting': [
        'Security assessment reveals vulnerabilities in site protection.',
        'Recent incidents indicate need for enhanced surveillance measures.',
        'Community engagement programs showing positive results in site protection.'
      ],
      'conflict': [
        'Regional instability creating risks for site security and preservation.',
        'Emergency protection protocols activated for moveable heritage items.',
        'International monitoring mission reports ongoing concerns.'
      ],
      'climate-change': [
        'Long-term climate data shows changing precipitation and temperature patterns.',
        'Climate adaptation strategies require implementation for site resilience.',
        'Environmental monitoring indicates accelerating climate-related impacts.'
      ]
    };

    const notes = threatNotes[threat] || ['General assessment notes for this threat type.'];
    const baseNote = notes[Math.floor(Math.random() * notes.length)];
    
    if (magnitude >= 10) {
      return `URGENT: ${baseNote} Immediate intervention required.`;
    } else if (magnitude >= 7) {
      return `HIGH PRIORITY: ${baseNote} Action needed within 6 months.`;
    }
    
    return baseNote;
  }

  private static generateAdditionalAssessments(siteId: string, activeThreats: ThreatType[]): RiskAssessment[] {
    const additionalAssessments: RiskAssessment[] = [];
    const assessmentCount = Math.floor(Math.random() * 3) + 1; // 1-3 additional assessments

    for (let i = 0; i < assessmentCount; i++) {
      const threat = activeThreats[Math.floor(Math.random() * activeThreats.length)];
      const probability = Math.floor(Math.random() * 5) + 1;
      const lossOfValue = Math.floor(Math.random() * 5) + 1;
      const fractionAffected = Math.floor(Math.random() * 5) + 1;
      const magnitude = probability + lossOfValue + fractionAffected;

      additionalAssessments.push({
        id: `assessment-${siteId}-${threat}-historical-${i}`,
        siteId,
        threatType: threat,
        probability,
        lossOfValue,
        fractionAffected,
        magnitude,
        priority: this.calculatePriority(magnitude),
        uncertaintyLevel: this.getRandomUncertaintyLevel(),
        assessmentDate: this.getRandomAssessmentDate(),
        assessor: this.getRandomAssessor(),
        notes: this.generateAssessmentNotes(threat, magnitude)
      });
    }

    return additionalAssessments;
  }
}