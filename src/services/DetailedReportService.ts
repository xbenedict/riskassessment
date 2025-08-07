// Service for managing detailed research reports from researchers
// Handles storage, retrieval, and management of comprehensive site assessments

import type { ThreatType } from '../types';

export interface DetailedReport {
  id: string;
  siteId: string;
  title: string;
  researcherName: string;
  researcherAffiliation: string;
  reportDate: Date;
  executiveSummary: string;
  detailedFindings: string;
  threatsIdentified: ThreatType[];
  recommendations: string;
  methodology: string;
  references: string;
  images: File[];
  attachments: File[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing detailed research reports
 * In a production environment, this would integrate with a backend API
 */
export class DetailedReportService {
  private static readonly STORAGE_KEY = 'heritage_detailed_reports';

  /**
   * Get all detailed reports for a specific site
   */
  static async getReportsForSite(siteId: string): Promise<DetailedReport[]> {
    try {
      const reports = this.getAllReports();
      return reports.filter(report => report.siteId === siteId);
    } catch (error) {
      console.error('Error fetching reports for site:', error);
      return [];
    }
  }

  /**
   * Get all detailed reports
   */
  static getAllReports(): DetailedReport[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const reports = JSON.parse(stored);
      return reports.map((report: any) => ({
        ...report,
        reportDate: new Date(report.reportDate),
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),
        // Note: File objects can't be stored in localStorage
        // In production, these would be URLs to uploaded files
        images: [],
        attachments: []
      }));
    } catch (error) {
      console.error('Error loading detailed reports:', error);
      return [];
    }
  }

  /**
   * Save a new detailed report
   */
  static async saveReport(reportData: Omit<DetailedReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<DetailedReport> {
    try {
      const report: DetailedReport = {
        ...reportData,
        id: `detailed-report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingReports = this.getAllReports();
      const updatedReports = [...existingReports, report];

      // In production, files would be uploaded to a file storage service
      // For now, we'll store metadata without the actual files
      const reportToStore = {
        ...report,
        images: report.images.map(file => ({ name: file.name, size: file.size, type: file.type })),
        attachments: report.attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReports.map(r => 
        r.id === report.id ? reportToStore : r
      )));

      return report;
    } catch (error) {
      console.error('Error saving detailed report:', error);
      throw new Error('Failed to save report');
    }
  }

  /**
   * Update an existing detailed report
   */
  static async updateReport(reportId: string, updates: Partial<DetailedReport>): Promise<DetailedReport> {
    try {
      const existingReports = this.getAllReports();
      const reportIndex = existingReports.findIndex(r => r.id === reportId);

      if (reportIndex === -1) {
        throw new Error('Report not found');
      }

      const updatedReport: DetailedReport = {
        ...existingReports[reportIndex],
        ...updates,
        updatedAt: new Date()
      };

      existingReports[reportIndex] = updatedReport;

      const reportToStore = {
        ...updatedReport,
        images: updatedReport.images.map(file => ({ name: file.name, size: file.size, type: file.type })),
        attachments: updatedReport.attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingReports.map(r => 
        r.id === updatedReport.id ? reportToStore : r
      )));

      return updatedReport;
    } catch (error) {
      console.error('Error updating detailed report:', error);
      throw new Error('Failed to update report');
    }
  }

  /**
   * Delete a detailed report
   */
  static async deleteReport(reportId: string): Promise<boolean> {
    try {
      const existingReports = this.getAllReports();
      const filteredReports = existingReports.filter(r => r.id !== reportId);

      if (filteredReports.length === existingReports.length) {
        throw new Error('Report not found');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredReports));
      return true;
    } catch (error) {
      console.error('Error deleting detailed report:', error);
      return false;
    }
  }

  /**
   * Get a specific detailed report by ID
   */
  static async getReportById(reportId: string): Promise<DetailedReport | null> {
    try {
      const reports = this.getAllReports();
      return reports.find(r => r.id === reportId) || null;
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      return null;
    }
  }

  /**
   * Search reports by various criteria
   */
  static async searchReports(criteria: {
    siteId?: string;
    researcherName?: string;
    dateRange?: { start: Date; end: Date };
    threatsIdentified?: ThreatType[];
    searchTerm?: string;
  }): Promise<DetailedReport[]> {
    try {
      let reports = this.getAllReports();

      if (criteria.siteId) {
        reports = reports.filter(r => r.siteId === criteria.siteId);
      }

      if (criteria.researcherName) {
        reports = reports.filter(r => 
          r.researcherName.toLowerCase().includes(criteria.researcherName!.toLowerCase())
        );
      }

      if (criteria.dateRange) {
        reports = reports.filter(r => 
          r.reportDate >= criteria.dateRange!.start && 
          r.reportDate <= criteria.dateRange!.end
        );
      }

      if (criteria.threatsIdentified && criteria.threatsIdentified.length > 0) {
        reports = reports.filter(r => 
          criteria.threatsIdentified!.some(threat => r.threatsIdentified.includes(threat))
        );
      }

      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        reports = reports.filter(r => 
          r.title.toLowerCase().includes(term) ||
          r.executiveSummary.toLowerCase().includes(term) ||
          r.detailedFindings.toLowerCase().includes(term) ||
          r.recommendations.toLowerCase().includes(term)
        );
      }

      return reports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
    } catch (error) {
      console.error('Error searching reports:', error);
      return [];
    }
  }

  /**
   * Get summary statistics for reports
   */
  static getReportStatistics(): {
    totalReports: number;
    reportsBySite: Record<string, number>;
    reportsByResearcher: Record<string, number>;
    commonThreats: Record<ThreatType, number>;
    recentReports: number;
  } {
    try {
      const reports = this.getAllReports();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const reportsBySite = reports.reduce((acc, report) => {
        acc[report.siteId] = (acc[report.siteId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const reportsByResearcher = reports.reduce((acc, report) => {
        acc[report.researcherName] = (acc[report.researcherName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonThreats = reports.reduce((acc, report) => {
        report.threatsIdentified.forEach(threat => {
          acc[threat] = (acc[threat] || 0) + 1;
        });
        return acc;
      }, {} as Record<ThreatType, number>);

      const recentReports = reports.filter(r => r.reportDate >= oneMonthAgo).length;

      return {
        totalReports: reports.length,
        reportsBySite,
        reportsByResearcher,
        commonThreats,
        recentReports
      };
    } catch (error) {
      console.error('Error calculating report statistics:', error);
      return {
        totalReports: 0,
        reportsBySite: {},
        reportsByResearcher: {},
        commonThreats: {} as Record<ThreatType, number>,
        recentReports: 0
      };
    }
  }

  /**
   * Export report data for backup or analysis
   */
  static exportReports(format: 'json' | 'csv' = 'json'): string {
    try {
      const reports = this.getAllReports();

      if (format === 'csv') {
        const headers = [
          'ID', 'Site ID', 'Title', 'Researcher Name', 'Affiliation', 
          'Report Date', 'Executive Summary', 'Threats Identified', 
          'Created At', 'Updated At'
        ];

        const csvRows = reports.map(report => [
          report.id,
          report.siteId,
          `"${report.title.replace(/"/g, '""')}"`,
          `"${report.researcherName.replace(/"/g, '""')}"`,
          `"${report.researcherAffiliation.replace(/"/g, '""')}"`,
          report.reportDate.toISOString(),
          `"${report.executiveSummary.replace(/"/g, '""')}"`,
          `"${report.threatsIdentified.join(', ')}"`,
          report.createdAt.toISOString(),
          report.updatedAt.toISOString()
        ]);

        return [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      }

      return JSON.stringify(reports, null, 2);
    } catch (error) {
      console.error('Error exporting reports:', error);
      return '';
    }
  }

  /**
   * Import report data from backup
   */
  static async importReports(data: string, format: 'json' = 'json'): Promise<boolean> {
    try {
      if (format === 'json') {
        const importedReports = JSON.parse(data);
        const existingReports = this.getAllReports();
        
        // Merge reports, avoiding duplicates by ID
        const existingIds = new Set(existingReports.map(r => r.id));
        const newReports = importedReports.filter((r: DetailedReport) => !existingIds.has(r.id));
        
        const allReports = [...existingReports, ...newReports];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReports));
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error importing reports:', error);
      return false;
    }
  }
}