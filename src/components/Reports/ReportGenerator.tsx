// Report Generator component for creating standardized heritage risk assessment reports
// Supports PDF and Excel export functionality

import React, { useState, useCallback } from 'react';
import { ReportService, type RiskAssessmentReport, type ComparativeAnalysis } from '../../services/ReportService';
import { MockDataService } from '../../services/MockDataService';
import { PDFExport } from '../../utils/PDFExport';
import type { HeritageSite, RiskAssessment } from '../../types';
import { Button, Input, Select, Card, Icon, Progress, type SelectOption } from '../UI';
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

  // Prepare options for select components
  const reportTypeOptions: SelectOption[] = [
    { value: 'site-specific', label: 'Site-Specific Assessment' },
    { value: 'comparative', label: 'Comparative Analysis' },
    { value: 'executive-summary', label: 'Executive Summary' }
  ];

  const siteOptions: SelectOption[] = availableSites.map(site => ({
    value: site.id,
    label: `${site.name} (${site.location.country})`
  }));

  return (
    <div className={styles.reportGenerator}>
      <Card className={styles.headerCard}>
        <div className={styles.header}>
          <Icon name="file-text" size="xl" className={styles.headerIcon} />
          <div className={styles.headerContent}>
            <h2>Heritage Risk Assessment Report Generator</h2>
            <p>Generate standardized reports following international heritage guidelines</p>
          </div>
        </div>
      </Card>

      <Card className={styles.controlsCard}>
        <div className={styles.controls}>
          <div className={styles.formRow}>
            <Select
              label="Report Type"
              leftIcon="file-text"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              options={reportTypeOptions}
              fullWidth
            />

            {reportType === 'site-specific' && (
              <Select
                label="Select Site"
                leftIcon="map-pin"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                options={siteOptions}
                placeholder="Choose a heritage site"
                fullWidth
              />
            )}
          </div>

          <Input
            label="Generated By"
            leftIcon="users"
            value={generatedBy}
            onChange={(e) => setGeneratedBy(e.target.value)}
            placeholder="Organization or individual name"
            fullWidth
          />

          {isGenerating && (
            <div className={styles.progressContainer}>
              <Progress 
                indeterminate 
                variant="default" 
                size="medium"
                label="Generating report..."
                showLabel
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button
              onClick={handleGenerateReport}
              loading={isGenerating}
              disabled={isGenerating || (reportType === 'site-specific' && !selectedSiteId)}
              icon="file-text"
              size="large"
              fullWidth
            >
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className={styles.errorCard}>
          <div className={styles.error}>
            <Icon name="alert-triangle" size="md" className={styles.errorIcon} />
            <div className={styles.errorContent}>
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        </Card>
      )}

      {currentReport && (
        <Card className={styles.reportPreviewCard}>
          <div className={styles.reportHeader}>
            <div className={styles.reportHeaderContent}>
              <Icon name="check-circle" size="lg" className={styles.reportHeaderIcon} />
              <div>
                <h3>Generated Report</h3>
                <p>Report successfully generated and ready for export</p>
              </div>
            </div>
            <div className={styles.exportActions}>
              <Button
                onClick={exportAsJSON}
                variant="secondary"
                icon="download"
                size="small"
              >
                JSON
              </Button>
              <Button
                onClick={exportAsCSV}
                variant="secondary"
                icon="download"
                size="small"
              >
                CSV
              </Button>
              <Button
                onClick={exportAsPDF}
                variant="primary"
                icon="download"
                size="small"
              >
                PDF
              </Button>
            </div>
          </div>

          {'riskComparison' in currentReport ? (
            // Comparative analysis preview
            <div className={styles.comparativePreview}>
              <h4>
                <Icon name="bar-chart-3" size="md" />
                Comparative Analysis - {currentReport.sites.length} Sites
              </h4>
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
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Icon name="map-pin" size="sm" />
                            {site.siteName}
                          </div>
                        </td>
                        <td className={styles[`risk-${site.overallRisk}`]}>
                          <Icon name="alert-triangle" size="sm" />
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
              <h4>
                <Icon name="map-pin" size="md" />
                {currentReport.site.name} - Risk Assessment Report
              </h4>
              
              <div className={styles.summary}>
                <h5>
                  <Icon name="bar-chart" size="sm" />
                  Summary
                </h5>
                <div className={styles.summaryStats}>
                  <div className={styles.stat}>
                    <span className={styles.label}>Total Threats:</span>
                    <span className={styles.value}>{currentReport.summary.totalThreats}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.label}>Highest Risk:</span>
                    <span className={`${styles.value} ${styles[`risk-${currentReport.summary.highestRisk}`]}`}>
                      <Icon name="alert-triangle" size="sm" />
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
                <h5>
                  <Icon name="check-circle" size="sm" />
                  Key Recommendations
                </h5>
                <ul>
                  {currentReport.recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index}>
                      <Icon name="arrow-right" size="sm" style={{ marginRight: 'var(--space-2)', color: 'var(--color-risk-low)' }} />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.assessments}>
                <h5>
                  <Icon name="shield" size="sm" />
                  Risk Assessments ({currentReport.assessments.length})
                </h5>
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
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <Icon name="alert-circle" size="sm" />
                              {assessment.threatType}
                            </div>
                          </td>
                          <td className={styles[`risk-${assessment.priority}`]}>
                            <Icon name="alert-triangle" size="sm" />
                            {assessment.priority}
                          </td>
                          <td>{assessment.magnitude}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <Icon name="calendar" size="sm" />
                              {assessment.assessmentDate.toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <Icon name="user" size="sm" />
                              {assessment.assessor}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className={styles.reportFooter}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Icon name="calendar" size="sm" />
              <p>
                Generated on {new Date().toLocaleDateString()} by {generatedBy}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
              <Icon name="shield" size="sm" />
              <p>
                Following ICCROM Heritage Risk Assessment Guidelines
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};