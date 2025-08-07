// Mock Data Service for simulating API calls during development
// Now delegates to DataManager for unified data management

import type { HeritageSite, RiskAssessment, ThreatType } from '../types';
import { DataManager } from './DataManager';

/**
 * Mock service for heritage site and risk assessment data
 * Now uses DataManager as the single source of truth
 * @deprecated Use DataManager directly for new code
 */
export class MockDataService {
  
  /**
   * Get all heritage sites
   */
  static async getHeritageSites(): Promise<HeritageSite[]> {
    return DataManager.getHeritageSites();
  }

  /**
   * Get a specific heritage site by ID
   */
  static async getHeritageSite(siteId: string): Promise<HeritageSite | null> {
    return DataManager.getHeritageSite(siteId);
  }

  /**
   * Get risk assessments for a specific site
   */
  static async getRiskAssessments(siteId: string): Promise<RiskAssessment[]> {
    return DataManager.getAssessmentsForSite(siteId);
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
    const searchCriteria: any = {};
    if (criteria.country) searchCriteria.country = criteria.country;
    if (criteria.riskLevel) searchCriteria.riskLevel = criteria.riskLevel as any;
    if (criteria.threatType) searchCriteria.threatType = criteria.threatType;
    if (criteria.searchTerm) searchCriteria.searchTerm = criteria.searchTerm;

    const { sites } = await DataManager.searchData(searchCriteria);
    return sites;
  }

  /**
   * Get recent risk assessments across all sites
   */
  static async getRecentAssessments(limit: number = 10): Promise<RiskAssessment[]> {
    return DataManager.getRecentAssessments(limit);
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
    return DataManager.getDashboardStats();
  }


}