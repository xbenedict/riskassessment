// Report Generator component for creating standardized heritage risk assessment reports
// Supports PDF and Excel export functionality

import React, { useState, useCallback } from 'react';
import { ReportService, type RiskAssessmentReport, type ComparativeAnalysis } from '../../services/ReportService';
import { MockDataService } from '../../services/MockDataService';
import { PDFExport } from '../../utils/PDFExport';
import type { HeritageSite, RiskAssessment } from '../../types';
import styles from './ReportGenerator.module.css';

interface ReportGeneratorProps {
  selectedSites?: HeritageSite[];
  onReportGenerated?: (report: RiskAssessmentReport | ComparativeAnalysis) => void;
}

type ReportType = 'site-specific' | 'comparative' | 'executive-summary';

/**
 * Report Generator Component
 * Provides interface for generating standardized heritage risk assessment reports
 * Following international guidelines (ICCROM, UNESCO, ICOMOS)
 */
export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  selectedSites = [],
  onReportGenerated
}) => {
  const [reportType, setReportType] = useState<ReportType>('site-specific');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [generatedBy, setGeneratedBy] = useState<string>('Heritage Guardian User');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [availableSites, setAvailableSites] = useState<HeritageSite[]>([]);
  const [currentReport, setCurrentReport] = useState<RiskAssessmentReport | ComparativeAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  // Load available sites on component mount
  React.useEffect(() => {
    const loadSites = async () => {
      try {
        const sites = await MockDataService.getHeritageSites();
        setAvailableSites(sites);
        if (sites.length > 0 && !selectedSiteId) {
          setSelectedSiteId(sites[0].id);
        }
      } catch (err) {
        setError('Failed to load heritage sites');
      }
    };
    loadSites();
  }, [selectedSiteId]);

  /**
   * Generate site-specific risk assessment report
   */
  const generateSiteReport = useCallback(async (siteId: string) => {
    const site = availableSites.find(s => s.id === siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    const assessments = await MockDataService.getRiskAssessments(siteId);
    return ReportService.generateSiteReport(site, assessments, generatedBy);
  }, [availableSites, generatedBy]);

  /**
   * Generate comparative analysis report
   */
  const generateComparativeReport = useCallback(async () => {
    const sites = selectedSites.length > 0 ? selectedSites : availableSites;
    const allAssessments: RiskAssessment[] = [];
    
    // Collect all assessments for selected sites
    for (const site of sites) {
      const siteAssessments = await MockDataService.getRiskAssessments(site.id);
      allAssessments.push(...siteAssessments);
    }

    return ReportService.generateComparativeReport(sites, allAssessments, generatedBy);
  }, [selectedSites, availableSites, generatedBy]);

  /**
   * Generate executive summary report
   */
  const generateExecutiveSummary = useCallback(async () => {
    const sites = selectedSites.length > 0 ? selectedSites : availableSites;
    const allAssessments: RiskAssessment[] = [];
    
    // Collect all assessments for selected sites
    for (const site of sites) {
      const siteAssessments = await MockDataService.getRiskAssessments(site.id);
      allAssessments.push(...siteAssessments);
    }

    return ReportService.generateExecutiveSummary(sites, allAssessments, generatedBy);
  }, [selectedSites, availableSites, generatedBy]);

  /**
   * Handle report generation based on selected type
   */
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      let report: RiskAssessmentReport | ComparativeAnalysis;
      
      switch (reportType) {
        case 'site-specific':
          if (!selectedSiteId) {
            throw new Error('Please select a site for the report');
          }
          report = await generateSiteReport(selectedSiteId);
          break;
        case 'comparative':
          report = await generateComparativeReport();
          break;
        case 'executive-summary':
          report = await generateExecutiveSummary();
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      setCurrentReport(report);
      onReportGenerated?.(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Export report as JSON
   */
  const exportAsJSON = () => {
    if (!currentReport) return;
    
    let exportData;
    if ('riskComparison' in currentReport) {
      // Comparative analysis
      exportData = currentReport;
    } else {
      // Standard report
      exportData = ReportService.formatReportForExport(currentReport);
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `heritage-risk-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Export report as CSV (simplified format)
   * TODO: Implement full Excel export with formatting
   */
  const exportAsCSV = () => {
    if (!currentReport) return;
    
    let csvContent = '';
    
    if ('riskComparison' in currentReport) {
      // Comparative analysis CSV
      csvContent = 'Site Name,Overall Risk,Total Assessments,Average Magnitude,Urgent Threats\n';
      currentReport.riskComparison.forEach(site => {
        csvContent += `"${site.siteName}","${site.overallRisk}",${site.totalAssessments},${site.averageMagnitude},${site.urgentThreats}\n`;
      });
    } else {
      // Standard report CSV
      csvContent = 'Threat Type,Probability,Loss of Value,Fraction Affected,Magnitude,Priority,Assessment Date,Assessor\n';
      currentReport.assessments.forEach(assessment => {
        csvContent += `"${assessment.threatType}",${assessment.probability},${assessment.lossOfValue},${assessment.fractionAffected},${assessment.magnitude},"${assessment.priority}","${assessment.assessmentDate.toLocaleDateString()}","${assessment.assessor}"\n`;
      });
    }
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `heritage-risk-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Export report as PDF using browser print functionality
   */
  const exportAsPDF = () => {
    if (!currentReport) return;
    
    const filename = 'riskComparison' in currentReport 
      ? `heritage-comparative-analysis-${Date.now()}.pdf`
      : `heritage-risk-report-${currentReport.site.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    
    PDFExport.exportToPDF(currentReport, filename);
  };

  return (
    <div className={styles.reportGenerator}>
      <div className={styles.header}>
        <h2>Heritage Risk Assessment Report Generator</h2>
        <p>Generate standardized reports following international heritage guidelines</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.formGroup}>
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className={styles.select}
          >
            <option value="site-specific">Site-Specific Assessment</option>
            <option value="comparative">Comparative Analysis</option>
            <option value="executive-summary">Executive Summary</option>
          </select>
        </div>

        {reportType === 'site-specific' && (
          <div className={styles.formGroup}>
            <label htmlFor="siteSelect">Select Site:</label>
            <select
              id="siteSelect"
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className={styles.select}
            >
              {availableSites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.location.country})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="generatedBy">Generated By:</label>
          <input
            id="generatedBy"
            type="text"
            value={generatedBy}
            onChange={(e) => setGeneratedBy(e.target.value)}
            className={styles.input}
            placeholder="Organization or individual name"
          />
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={styles.generateButton}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}

      {currentReport && (
        <div className={styles.reportPreview}>
          <div className={styles.reportHeader}>
            <h3>Generated Report</h3>
            <div className={styles.exportActions}>
              <button onClick={exportAsJSON} className={styles.exportButton}>
                Export JSON
              </button>
              <button onClick={exportAsCSV} className={styles.exportButton}>
                Export CSV
              </button>
              <button onClick={exportAsPDF} className={styles.exportButton}>
                Export PDF
              </button>
            </div>
          </div>

          {'riskComparison' in currentReport ? (
            // Comparative analysis preview
            <div className={styles.comparativePreview}>
              <h4>Comparative Analysis - {currentReport.sites.length} Sites</h4>
              <div className={styles.comparisonTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Site Name</th>
                      <th>Overall Risk</th>
                      <th>Assessments</th>
                      <th>Avg. Magnitude</th>
                      <th>Urgent Threats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReport.riskComparison.map(site => (
                      <tr key={site.siteId}>
                        <td>{site.siteName}</td>
                        <td className={styles[`risk-${site.overallRisk}`]}>
                          {site.overallRisk}
                        </td>
                        <td>{site.totalAssessments}</td>
                        <td>{site.averageMagnitude}</td>
                        <td>{site.urgentThreats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Standard report preview
            <div className={styles.standardPreview}>
              <h4>{currentReport.site.name} - Risk Assessment Report</h4>
              
              <div className={styles.summary}>
                <h5>Summary</h5>
                <div className={styles.summaryStats}>
                  <div className={styles.stat}>
                    <span className={styles.label}>Total Threats:</span>
                    <span className={styles.value}>{currentReport.summary.totalThreats}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Highest Risk:</span>
                    <span className={`${styles.value} ${styles[`risk-${currentReport.summary.highestRisk}`]}`}>
                      {currentReport.summary.highestRisk}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Average Magnitude:</span>
                    <span className={styles.value}>{currentReport.summary.averageMagnitude}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Urgent Actions:</span>
                    <span className={styles.value}>{currentReport.summary.urgentActions}</span>
                  </div>
                </div>
              </div>

              <div className={styles.recommendations}>
                <h5>Key Recommendations</h5>
                <ul>
                  {currentReport.recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.assessments}>
                <h5>Risk Assessments ({currentReport.assessments.length})</h5>
                <div className={styles.assessmentTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Threat</th>
                        <th>Priority</th>
                        <th>Magnitude</th>
                        <th>Date</th>
                        <th>Assessor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReport.assessments.slice(0, 10).map(assessment => (
                        <tr key={assessment.id}>
                          <td>{assessment.threatType}</td>
                          <td className={styles[`risk-${assessment.priority}`]}>
                            {assessment.priority}
                          </td>
                          <td>{assessment.magnitude}</td>
                          <td>{assessment.assessmentDate.toLocaleDateString()}</td>
                          <td>{assessment.assessor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className={styles.reportFooter}>
            <p>
              Generated on {new Date().toLocaleDateString()} by {generatedBy}
            </p>
            <p>
              Following ICCROM Heritage Risk Assessment Guidelines
            </p>
          </div>
        </div>
      )}
    </div>
  );
};