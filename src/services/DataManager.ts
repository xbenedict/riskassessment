// Unified Data Manager - Single Source of Truth for Risk Assessments
// This service ensures all risk assessment data flows through one consistent system

import type { HeritageSite, RiskAssessment, RiskPriority, ThreatType } from '../types';
import { mockSites } from '../utils/mockData';
import { RiskCalculator } from '../utils/RiskCalculator';
import { comprehensiveAssessments } from './ComprehensiveAssessments';

/**
 * Unified Data Manager that serves as the single source of truth for all risk assessment data.
 * This ensures consistency across the entire application by:
 * 1. Managing all risk assessments in one place
 * 2. Automatically updating site risk profiles when assessments change
 * 3. Providing consistent data to all components and charts
 * 4. Handling data persistence and retrieval
 */
export class DataManager {
  private static readonly ASSESSMENTS_KEY = 'heritage_risk_assessments';
  private static readonly SITES_KEY = 'heritage_sites';
  
  // Cache for performance
  private static sitesCache: HeritageSite[] | null = null;
  private static assessmentsCache: RiskAssessment[] | null = null;
  private static lastCacheUpdate = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all heritage sites with up-to-date risk profiles
   */
  static async getHeritageSites(): Promise<HeritageSite[]> {
    await this.delay(200); // Simulate API delay
    
    if (this.isCacheValid() && this.sitesCache) {
      return [...this.sitesCache];
    }

    // Get stored sites or initialize with mock data
    let sites = this.getStoredSites();
    if (sites.length === 0) {
      sites = [...mockSites];
      this.storeSites(sites);
    }

    // Update all site risk profiles based on current assessments
    const assessments = await this.getAllAssessments();
    const updatedSites = sites.map(site => ({
      ...site,
      riskProfile: this.calculateSiteRiskProfile(site.id, assessments),
      lastAssessment: this.getLatestAssessmentDate(site.id, assessments)
    }));

    // Update stored sites with new risk profiles
    this.storeSites(updatedSites);
    
    // Update cache
    this.sitesCache = updatedSites;
    this.lastCacheUpdate = Date.now();
    
    return [...updatedSites];
  }

  /**
   * Get a specific heritage site by ID with current risk profile
   */
  static async getHeritageSite(siteId: string): Promise<HeritageSite | null> {
    const sites = await this.getHeritageSites();
    return sites.find(site => site.id === siteId) || null;
  }

  /**
   * Add a new heritage site
   */
  static async addHeritageSite(siteData: Omit<HeritageSite, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeritageSite> {
    const newSite: HeritageSite = {
      ...siteData,
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Get existing sites and add the new one
    const existingSites = await this.getHeritageSites();
    const updatedSites = [...existingSites, newSite];
    
    // Store updated sites
    this.storeSites(updatedSites);

    // Clear cache to force refresh
    this.clearCache();

    return newSite;
  }

  /**
   * Update an existing heritage site
   */
  static async updateHeritageSite(siteId: string, updates: Partial<Omit<HeritageSite, 'id' | 'createdAt'>>): Promise<HeritageSite> {
    const existingSites = await this.getHeritageSites();
    const siteIndex = existingSites.findIndex(site => site.id === siteId);

    if (siteIndex === -1) {
      throw new Error('Heritage site not found');
    }

    const updatedSite: HeritageSite = {
      ...existingSites[siteIndex],
      ...updates,
      updatedAt: new Date()
    };

    existingSites[siteIndex] = updatedSite;
    this.storeSites(existingSites);

    // Clear cache to force refresh
    this.clearCache();

    return updatedSite;
  }

  /**
   * Delete a heritage site and all its associated assessments
   */
  static async deleteHeritageSite(siteId: string): Promise<boolean> {
    const existingSites = await this.getHeritageSites();
    const siteExists = existingSites.some(site => site.id === siteId);
    
    if (!siteExists) {
      return false;
    }

    // Remove the site
    const filteredSites = existingSites.filter(site => site.id !== siteId);
    this.storeSites(filteredSites);

    // Remove all assessments for this site
    const existingAssessments = await this.getAllAssessments();
    const filteredAssessments = existingAssessments.filter(assessment => assessment.siteId !== siteId);
    this.storeAssessments(filteredAssessments);

    // Clear cache to force refresh
    this.clearCache();

    return true;
  }

  /**
   * Get all risk assessments
   */
  static async getAllAssessments(): Promise<RiskAssessment[]> {
    if (this.isCacheValid() && this.assessmentsCache) {
      return [...this.assessmentsCache];
    }

    const stored = this.getStoredAssessments();
    
    // Check if we need to generate initial assessments
    // We should have at least 10 assessments per site from ComprehensiveAssessments
    const expectedMinimumAssessments = mockSites.length * 10;
    const predefinedAssessments = this.getPredefinedAssessments();
    const totalPredefinedCount = Object.values(predefinedAssessments).reduce((sum, assessments) => sum + assessments.length, 0);
    
    if (stored.length < totalPredefinedCount) {
      // Generate initial assessments and merge with any existing user-added assessments
      const initialAssessments = await this.generateInitialAssessments();
      
      // Keep any user-added assessments that aren't in the predefined set
      const userAssessments = stored.filter(assessment => 
        !assessment.id.startsWith('demo-') && !assessment.id.startsWith('generated-')
      );
      
      const allAssessments = [...initialAssessments, ...userAssessments];
      this.storeAssessments(allAssessments);
      this.assessmentsCache = allAssessments;
    } else {
      this.assessmentsCache = stored;
    }
    
    this.lastCacheUpdate = Date.now();
    return [...this.assessmentsCache];
  }

  /**
   * Get risk assessments for a specific site
   */
  static async getAssessmentsForSite(siteId: string): Promise<RiskAssessment[]> {
    const allAssessments = await this.getAllAssessments();
    return allAssessments
      .filter(assessment => assessment.siteId === siteId)
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  }

  /**
   * Add a new risk assessment and update site risk profile
   */
  static async addAssessment(assessmentData: Omit<RiskAssessment, 'id'>): Promise<RiskAssessment> {
    const assessment: RiskAssessment = {
      ...assessmentData,
      id: `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to stored assessments
    const existingAssessments = await this.getAllAssessments();
    const updatedAssessments = [...existingAssessments, assessment];
    this.storeAssessments(updatedAssessments);

    // Update site risk profile
    await this.updateSiteRiskProfile(assessment.siteId, updatedAssessments);

    // Clear cache to force refresh
    this.clearCache();

    return assessment;
  }

  /**
   * Update an existing risk assessment and recalculate site risk profile
   */
  static async updateAssessment(assessmentId: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const existingAssessments = await this.getAllAssessments();
    const assessmentIndex = existingAssessments.findIndex(a => a.id === assessmentId);

    if (assessmentIndex === -1) {
      throw new Error('Assessment not found');
    }

    const updatedAssessment: RiskAssessment = {
      ...existingAssessments[assessmentIndex],
      ...updates
    };

    existingAssessments[assessmentIndex] = updatedAssessment;
    this.storeAssessments(existingAssessments);

    // Update site risk profile
    await this.updateSiteRiskProfile(updatedAssessment.siteId, existingAssessments);

    // Clear cache to force refresh
    this.clearCache();

    return updatedAssessment;
  }

  /**
   * Delete a risk assessment and recalculate site risk profile
   */
  static async deleteAssessment(assessmentId: string): Promise<boolean> {
    const existingAssessments = await this.getAllAssessments();
    const assessmentToDelete = existingAssessments.find(a => a.id === assessmentId);
    
    if (!assessmentToDelete) {
      return false;
    }

    const filteredAssessments = existingAssessments.filter(a => a.id !== assessmentId);
    this.storeAssessments(filteredAssessments);

    // Update site risk profile
    await this.updateSiteRiskProfile(assessmentToDelete.siteId, filteredAssessments);

    // Clear cache to force refresh
    this.clearCache();

    return true;
  }

  /**
   * Get recent assessments across all sites
   */
  static async getRecentAssessments(limit: number = 10): Promise<RiskAssessment[]> {
    const allAssessments = await this.getAllAssessments();
    return allAssessments
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())
      .slice(0, limit);
  }

  /**
   * Get dashboard statistics with real-time data
   */
  static async getDashboardStats(): Promise<{
    totalSites: number;
    sitesAtRisk: number;
    totalThreats: number;
    recentAssessments: number;
  }> {
    const sites = await this.getHeritageSites();
    const assessments = await this.getAllAssessments();
    
    const totalSites = sites.length;
    const sitesAtRisk = sites.filter(site => 
      ['extremely-high', 'very-high', 'high'].includes(site.riskProfile.overallRisk)
    ).length;
    
    const totalThreats = assessments.length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentAssessments = assessments.filter(assessment => 
      assessment.assessmentDate >= oneMonthAgo
    ).length;

    return {
      totalSites,
      sitesAtRisk,
      totalThreats,
      recentAssessments
    };
  }

  /**
   * Clear all stored data and force regeneration (for development/testing)
   */
  static async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.ASSESSMENTS_KEY);
      localStorage.removeItem(this.SITES_KEY);
      this.clearCache();
      console.log('All stored data cleared. Data will be regenerated on next access.');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  /**
   * Search sites and assessments with unified criteria
   */
  static async searchData(criteria: {
    country?: string;
    riskLevel?: RiskPriority;
    threatType?: ThreatType;
    searchTerm?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<{
    sites: HeritageSite[];
    assessments: RiskAssessment[];
  }> {
    let sites = await this.getHeritageSites();
    let assessments = await this.getAllAssessments();

    // Filter sites
    if (criteria.country) {
      sites = sites.filter(site => 
        site.location.country.toLowerCase().includes(criteria.country!.toLowerCase())
      );
    }

    if (criteria.riskLevel) {
      sites = sites.filter(site => 
        site.riskProfile.overallRisk === criteria.riskLevel
      );
    }

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      sites = sites.filter(site => 
        site.name.toLowerCase().includes(term) ||
        site.description.toLowerCase().includes(term) ||
        site.significance.toLowerCase().includes(term)
      );
    }

    // Filter assessments
    if (criteria.threatType) {
      assessments = assessments.filter(assessment => 
        assessment.threatType === criteria.threatType
      );
    }

    if (criteria.dateRange) {
      assessments = assessments.filter(assessment => 
        assessment.assessmentDate >= criteria.dateRange!.start && 
        assessment.assessmentDate <= criteria.dateRange!.end
      );
    }

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      assessments = assessments.filter(assessment => 
        assessment.notes.toLowerCase().includes(term) ||
        assessment.assessor.toLowerCase().includes(term)
      );
    }

    // Filter assessments to only include those for filtered sites
    const siteIds = new Set(sites.map(site => site.id));
    assessments = assessments.filter(assessment => siteIds.has(assessment.siteId));

    return { sites, assessments };
  }

  // Private helper methods

  private static calculateSiteRiskProfile(siteId: string, assessments: RiskAssessment[]): {
    overallRisk: RiskPriority;
    lastUpdated: Date;
    activeThreats: ThreatType[];
  } {
    const siteAssessments = assessments.filter(a => a.siteId === siteId);
    
    if (siteAssessments.length === 0) {
      return {
        overallRisk: 'low',
        lastUpdated: new Date(),
        activeThreats: []
      };
    }

    // Calculate overall risk as the highest priority among all assessments
    const priorities: RiskPriority[] = ['extremely-high', 'very-high', 'high', 'medium-high', 'low'];
    const overallRisk = priorities.find(priority => 
      siteAssessments.some(assessment => assessment.priority === priority)
    ) || 'low';

    // Get unique active threats from recent assessments (last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    const recentAssessments = siteAssessments.filter(a => a.assessmentDate >= twoYearsAgo);
    const activeThreats = [...new Set(recentAssessments.map(a => a.threatType))];

    // Get the most recent assessment date
    const lastUpdated = new Date(Math.max(...siteAssessments.map(a => a.assessmentDate.getTime())));

    return {
      overallRisk,
      lastUpdated,
      activeThreats
    };
  }

  private static getLatestAssessmentDate(siteId: string, assessments: RiskAssessment[]): Date {
    const siteAssessments = assessments.filter(a => a.siteId === siteId);
    if (siteAssessments.length === 0) {
      return new Date();
    }
    return new Date(Math.max(...siteAssessments.map(a => a.assessmentDate.getTime())));
  }

  private static async updateSiteRiskProfile(siteId: string, assessments: RiskAssessment[]): Promise<void> {
    const sites = this.getStoredSites();
    const siteIndex = sites.findIndex(site => site.id === siteId);
    
    if (siteIndex === -1) return;

    const updatedRiskProfile = this.calculateSiteRiskProfile(siteId, assessments);
    const updatedSite = {
      ...sites[siteIndex],
      riskProfile: updatedRiskProfile,
      lastAssessment: this.getLatestAssessmentDate(siteId, assessments),
      updatedAt: new Date()
    };

    sites[siteIndex] = updatedSite;
    this.storeSites(sites);
  }

  private static async generateInitialAssessments(): Promise<RiskAssessment[]> {
    const assessments: RiskAssessment[] = [];
    
    // Comprehensive predefined assessments for each site to restore rich demo data
    const predefinedAssessments = this.getPredefinedAssessments();
    
    for (const site of mockSites) {
      const siteAssessments = predefinedAssessments[site.id] || [];
      
      // Add predefined assessments for this site
      siteAssessments.forEach((assessment, index) => {
        assessments.push({
          id: `demo-${site.id}-${assessment.threatType}-${index}`,
          siteId: site.id,
          ...assessment
        });
      });
      
      // Generate additional assessments for any remaining active threats not covered by predefined ones
      const coveredThreats = new Set(siteAssessments.map(a => a.threatType));
      const uncoveredThreats = site.riskProfile.activeThreats.filter(threat => !coveredThreats.has(threat));
      
      uncoveredThreats.forEach((threat, index) => {
        const probability = Math.floor(Math.random() * 5) + 1;
        const lossOfValue = Math.floor(Math.random() * 5) + 1;
        const fractionAffected = Math.floor(Math.random() * 5) + 1;
        const magnitude = probability + lossOfValue + fractionAffected;
        
        assessments.push({
          id: `generated-${site.id}-${threat}-${index}`,
          siteId: site.id,
          threatType: threat,
          probability,
          lossOfValue,
          fractionAffected,
          magnitude,
          priority: RiskCalculator.calculatePriority(magnitude),
          uncertaintyLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          assessmentDate: this.getRandomRecentDate(),
          assessor: this.getRandomAssessor(),
          notes: this.generateAssessmentNotes(threat, magnitude)
        });
      });
    }

    return assessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  }

  private static getStoredSites(): HeritageSite[] {
    try {
      const stored = localStorage.getItem(this.SITES_KEY);
      if (!stored) return [];

      const sites = JSON.parse(stored);
      return sites.map((site: any) => ({
        ...site,
        lastAssessment: new Date(site.lastAssessment),
        riskProfile: {
          ...site.riskProfile,
          lastUpdated: new Date(site.riskProfile.lastUpdated)
        },
        createdAt: new Date(site.createdAt),
        updatedAt: new Date(site.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading stored sites:', error);
      return [];
    }
  }

  private static storeSites(sites: HeritageSite[]): void {
    try {
      localStorage.setItem(this.SITES_KEY, JSON.stringify(sites));
    } catch (error) {
      console.error('Error storing sites:', error);
    }
  }

  private static getStoredAssessments(): RiskAssessment[] {
    try {
      const stored = localStorage.getItem(this.ASSESSMENTS_KEY);
      if (!stored) return [];

      const assessments = JSON.parse(stored);
      return assessments.map((assessment: any) => ({
        ...assessment,
        assessmentDate: new Date(assessment.assessmentDate)
      }));
    } catch (error) {
      console.error('Error loading stored assessments:', error);
      return [];
    }
  }

  private static storeAssessments(assessments: RiskAssessment[]): void {
    try {
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify(assessments));
    } catch (error) {
      console.error('Error storing assessments:', error);
    }
  }

  private static isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_DURATION;
  }

  private static clearCache(): void {
    this.sitesCache = null;
    this.assessmentsCache = null;
    this.lastCacheUpdate = 0;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static getRandomRecentDate(): Date {
    const now = new Date();
    const monthsAgo = Math.floor(Math.random() * 18); // Up to 18 months ago
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

  private static getPredefinedAssessments(): Record<string, Omit<RiskAssessment, 'id' | 'siteId'>[]> {
    return comprehensiveAssessments;
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
}