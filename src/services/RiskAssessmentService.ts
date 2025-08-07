// Service for managing risk assessments
// Now delegates to DataManager for unified data management

import type { RiskAssessment, HeritageSite } from '../types';
import { DataManager } from './DataManager';

/**
 * Service for managing risk assessments
 * Now uses DataManager as the single source of truth for all data
 * @deprecated Use DataManager directly for new code
 */
export class RiskAssessmentService {

  /**
   * Get all risk assessments for a specific site
   */
  static async getAssessmentsForSite(siteId: string): Promise<RiskAssessment[]> {
    return DataManager.getAssessmentsForSite(siteId);
  }

  /**
   * Get all risk assessments
   */
  static async getAllAssessments(): Promise<RiskAssessment[]> {
    return DataManager.getAllAssessments();
  }

  /**
   * Save a new risk assessment
   */
  static async saveAssessment(assessmentData: Omit<RiskAssessment, 'id'>): Promise<RiskAssessment> {
    return DataManager.addAssessment(assessmentData);
  }

  /**
   * Update an existing risk assessment
   */
  static async updateAssessment(assessmentId: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    return DataManager.updateAssessment(assessmentId, updates);
  }

  /**
   * Delete a risk assessment
   */
  static async deleteAssessment(assessmentId: string): Promise<boolean> {
    return DataManager.deleteAssessment(assessmentId);
  }

  /**
   * Get a specific risk assessment by ID
   */
  static async getAssessmentById(assessmentId: string): Promise<RiskAssessment | null> {
    const allAssessments = await DataManager.getAllAssessments();
    return allAssessments.find(a => a.id === assessmentId) || null;
  }

  /**
   * Get recent assessments across all sites
   */
  static async getRecentAssessments(limit: number = 10): Promise<RiskAssessment[]> {
    return DataManager.getRecentAssessments(limit);
  }

  /**
   * Search assessments by various criteria
   */
  static async searchAssessments(criteria: {
    siteId?: string;
    threatType?: string;
    priority?: string;
    assessor?: string;
    dateRange?: { start: Date; end: Date };
    searchTerm?: string;
  }): Promise<RiskAssessment[]> {
    // Convert to DataManager search format
    const searchCriteria: any = {};
    if (criteria.threatType) searchCriteria.threatType = criteria.threatType as any;
    if (criteria.dateRange) searchCriteria.dateRange = criteria.dateRange;
    if (criteria.searchTerm) searchCriteria.searchTerm = criteria.searchTerm;

    const { assessments } = await DataManager.searchData(searchCriteria);
    
    // Apply additional filters not supported by DataManager
    let filteredAssessments = assessments;
    
    if (criteria.siteId) {
      filteredAssessments = filteredAssessments.filter(a => a.siteId === criteria.siteId);
    }
    
    if (criteria.priority) {
      filteredAssessments = filteredAssessments.filter(a => a.priority === criteria.priority);
    }
    
    if (criteria.assessor) {
      filteredAssessments = filteredAssessments.filter(a => 
        a.assessor.toLowerCase().includes(criteria.assessor!.toLowerCase())
      );
    }

    return filteredAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  }

  /**
   * Get assessment statistics
   */
  static async getAssessmentStatistics(): Promise<{
    totalAssessments: number;
    assessmentsBySite: Record<string, number>;
    assessmentsByThreat: Record<string, number>;
    assessmentsByPriority: Record<string, number>;
    recentAssessments: number;
  }> {
    const assessments = await DataManager.getAllAssessments();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const assessmentsBySite = assessments.reduce((acc, assessment) => {
      acc[assessment.siteId] = (acc[assessment.siteId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assessmentsByThreat = assessments.reduce((acc, assessment) => {
      acc[assessment.threatType] = (acc[assessment.threatType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assessmentsByPriority = assessments.reduce((acc, assessment) => {
      acc[assessment.priority] = (acc[assessment.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentAssessments = assessments.filter(a => a.assessmentDate >= oneMonthAgo).length;

    return {
      totalAssessments: assessments.length,
      assessmentsBySite,
      assessmentsByThreat,
      assessmentsByPriority,
      recentAssessments
    };
  }

  /**
   * Export assessment data
   */
  static async exportAssessments(format: 'json' | 'csv' = 'json'): Promise<string> {
    const assessments = await DataManager.getAllAssessments();

    if (format === 'csv') {
      const headers = [
        'ID', 'Site ID', 'Threat Type', 'Probability', 'Loss of Value', 
        'Fraction Affected', 'Magnitude', 'Priority', 'Uncertainty Level',
        'Assessment Date', 'Assessor', 'Notes'
      ];

      const csvRows = assessments.map(assessment => [
        assessment.id,
        assessment.siteId,
        assessment.threatType,
        assessment.probability,
        assessment.lossOfValue,
        assessment.fractionAffected,
        assessment.magnitude,
        assessment.priority,
        assessment.uncertaintyLevel,
        assessment.assessmentDate.toISOString(),
        `"${assessment.assessor.replace(/"/g, '""')}"`,
        `"${assessment.notes.replace(/"/g, '""')}"`
      ]);

      return [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(assessments, null, 2);
  }
}