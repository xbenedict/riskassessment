// PDF Export utility for heritage risk assessment reports
// Basic implementation using browser's print functionality
// TODO: Implement full PDF generation using libraries like jsPDF or Puppeteer

import type { RiskAssessmentReport, ComparativeAnalysis } from '../services/ReportService';

/**
 * PDF Export utility for generating PDF reports
 * Currently uses browser print functionality as a basic implementation
 * 
 * TODO: For production deployment:
 * - Implement jsPDF for client-side PDF generation
 * - Add custom PDF templates with proper formatting
 * - Include charts and visualizations in PDF exports
 * - Add digital signatures for official reports
 * - Support for multiple languages and localization
 */
export class PDFExport {
  
  /**
   * Generate HTML content for PDF export
   * @param report Risk assessment report or comparative analysis
   * @returns HTML string formatted for PDF printing
   */
  static generatePrintableHTML(report: RiskAssessmentReport | ComparativeAnalysis): string {
    const isComparative = 'riskComparison' in report;
    
    if (isComparative) {
      return this.generateComparativePrintHTML(report);
    } else {
      return this.generateStandardPrintHTML(report);
    }
  }
  
  /**
   * Generate HTML for standard risk assessment report
   * @param report Standard risk assessment report
   * @returns Formatted HTML string
   */
  private static generateStandardPrintHTML(report: RiskAssessmentReport): string {
    const styles = `
      <style>
        @media print {
          body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; }
          .page-break { page-break-before: always; }
          .no-print { display: none; }
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .header { text-align: center; margin-bottom: 2rem; }
          .summary { margin: 1rem 0; }
          .recommendations { margin: 1rem 0; }
          .risk-extremely-high { color: #721c24; font-weight: bold; }
          .risk-very-high { color: #856404; font-weight: bold; }
          .risk-high { color: #0c5460; font-weight: bold; }
          .risk-medium-high { color: #383d41; font-weight: bold; }
          .risk-low { color: #155724; font-weight: bold; }
        }
        @page { margin: 2cm; }
      </style>
    `;
    
    const header = `
      <div class="header">
        <h1>Heritage Risk Assessment Report</h1>
        <h2>${report.site.name}</h2>
        <p><strong>Location:</strong> ${report.site.location.address}, ${report.site.location.country}</p>
        <p><strong>Generated:</strong> ${report.generatedAt.toLocaleDateString()} by ${report.generatedBy}</p>
        <p><strong>Report ID:</strong> ${report.id}</p>
      </div>
    `;
    
    const siteInfo = `
      <div class="site-info">
        <h3>Site Information</h3>
        <p><strong>Description:</strong> ${report.site.description}</p>
        <p><strong>Significance:</strong> ${report.site.significance}</p>
        <p><strong>Current Status:</strong> ${report.site.currentStatus}</p>
        <p><strong>Last Assessment:</strong> ${report.site.lastAssessment.toLocaleDateString()}</p>
      </div>
    `;
    
    const summary = `
      <div class="summary">
        <h3>Risk Assessment Summary</h3>
        <table>
          <tr><td><strong>Total Threats Assessed:</strong></td><td>${report.summary.totalThreats}</td></tr>
          <tr><td><strong>Highest Risk Level:</strong></td><td class="risk-${report.summary.highestRisk}">${report.summary.highestRisk}</td></tr>
          <tr><td><strong>Average Risk Magnitude:</strong></td><td>${report.summary.averageMagnitude}</td></tr>
          <tr><td><strong>Urgent Actions Required:</strong></td><td>${report.summary.urgentActions}</td></tr>
          <tr><td><strong>Last Assessment Date:</strong></td><td>${report.summary.lastAssessmentDate.toLocaleDateString()}</td></tr>
        </table>
      </div>
    `;
    
    const recommendations = `
      <div class="recommendations">
        <h3>Key Recommendations</h3>
        <ol>
          ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ol>
      </div>
    `;
    
    const assessmentsTable = `
      <div class="assessments page-break">
        <h3>Detailed Risk Assessments</h3>
        <table>
          <thead>
            <tr>
              <th>Threat Type</th>
              <th>Probability (A)</th>
              <th>Loss of Value (B)</th>
              <th>Fraction Affected (C)</th>
              <th>Magnitude</th>
              <th>Priority</th>
              <th>Uncertainty</th>
              <th>Assessment Date</th>
              <th>Assessor</th>
            </tr>
          </thead>
          <tbody>
            ${report.assessments.map(assessment => `
              <tr>
                <td>${assessment.threatType}</td>
                <td>${assessment.probability}</td>
                <td>${assessment.lossOfValue}</td>
                <td>${assessment.fractionAffected}</td>
                <td>${assessment.magnitude}</td>
                <td class="risk-${assessment.priority}">${assessment.priority}</td>
                <td>${assessment.uncertaintyLevel}</td>
                <td>${assessment.assessmentDate.toLocaleDateString()}</td>
                <td>${assessment.assessor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    const notes = `
      <div class="notes page-break">
        <h3>Assessment Notes</h3>
        ${report.assessments.map(assessment => `
          <div style="margin-bottom: 1rem; border-left: 3px solid #007bff; padding-left: 1rem;">
            <h4>${assessment.threatType} (${assessment.priority})</h4>
            <p><strong>Assessor:</strong> ${assessment.assessor}</p>
            <p><strong>Date:</strong> ${assessment.assessmentDate.toLocaleDateString()}</p>
            <p><strong>Notes:</strong> ${assessment.notes}</p>
          </div>
        `).join('')}
      </div>
    `;
    
    const footer = `
      <div class="footer" style="margin-top: 2rem; text-align: center; font-size: 10px; color: #666;">
        <p>This report follows ICCROM Heritage Risk Assessment Guidelines</p>
        <p>Generated by Heritage Guardian System - ${new Date().toISOString()}</p>
      </div>
    `;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Heritage Risk Assessment Report - ${report.site.name}</title>
          ${styles}
        </head>
        <body>
          ${header}
          ${siteInfo}
          ${summary}
          ${recommendations}
          ${assessmentsTable}
          ${notes}
          ${footer}
        </body>
      </html>
    `;
  }
  
  /**
   * Generate HTML for comparative analysis report
   * @param report Comparative analysis report
   * @returns Formatted HTML string
   */
  private static generateComparativePrintHTML(report: ComparativeAnalysis): string {
    const styles = `
      <style>
        @media print {
          body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; }
          .page-break { page-break-before: always; }
          .no-print { display: none; }
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .header { text-align: center; margin-bottom: 2rem; }
          .risk-extremely-high { color: #721c24; font-weight: bold; }
          .risk-very-high { color: #856404; font-weight: bold; }
          .risk-high { color: #0c5460; font-weight: bold; }
          .risk-medium-high { color: #383d41; font-weight: bold; }
          .risk-low { color: #155724; font-weight: bold; }
        }
        @page { margin: 2cm; }
      </style>
    `;
    
    const header = `
      <div class="header">
        <h1>Heritage Sites Comparative Risk Analysis</h1>
        <p><strong>Sites Analyzed:</strong> ${report.sites.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    
    const comparisonTable = `
      <div class="comparison">
        <h3>Site Risk Comparison</h3>
        <table>
          <thead>
            <tr>
              <th>Site Name</th>
              <th>Location</th>
              <th>Overall Risk</th>
              <th>Total Assessments</th>
              <th>Average Magnitude</th>
              <th>Urgent Threats</th>
            </tr>
          </thead>
          <tbody>
            ${report.riskComparison.map(site => {
              const siteInfo = report.sites.find(s => s.id === site.siteId);
              return `
                <tr>
                  <td>${site.siteName}</td>
                  <td>${siteInfo?.location.address || 'N/A'}</td>
                  <td class="risk-${site.overallRisk}">${site.overallRisk}</td>
                  <td>${site.totalAssessments}</td>
                  <td>${site.averageMagnitude}</td>
                  <td>${site.urgentThreats}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    const regionalTrends = `
      <div class="regional-trends page-break">
        <h3>Regional Trends Analysis</h3>
        <table>
          <thead>
            <tr>
              <th>Country/Region</th>
              <th>Average Risk Level</th>
              <th>Common Threats</th>
            </tr>
          </thead>
          <tbody>
            ${report.regionalTrends.map(trend => `
              <tr>
                <td>${trend.country}</td>
                <td>${trend.averageRisk}</td>
                <td>${trend.commonThreats.join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    const footer = `
      <div class="footer" style="margin-top: 2rem; text-align: center; font-size: 10px; color: #666;">
        <p>This report follows ICCROM Heritage Risk Assessment Guidelines</p>
        <p>Generated by Heritage Guardian System - ${new Date().toISOString()}</p>
      </div>
    `;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Heritage Sites Comparative Risk Analysis</title>
          ${styles}
        </head>
        <body>
          ${header}
          ${comparisonTable}
          ${regionalTrends}
          ${footer}
        </body>
      </html>
    `;
  }
  
  /**
   * Export report as PDF using browser print functionality
   * @param report Risk assessment report or comparative analysis
   * @param filename Optional filename for the PDF
   */
  static exportToPDF(report: RiskAssessmentReport | ComparativeAnalysis, filename?: string): void {
    const htmlContent = this.generatePrintableHTML(report);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF reports');
      return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  }
  
  /**
   * Generate downloadable HTML file for the report
   * @param report Risk assessment report or comparative analysis
   * @param filename Optional filename for the HTML file
   */
  static exportToHTML(report: RiskAssessmentReport | ComparativeAnalysis, filename?: string): void {
    const htmlContent = this.generatePrintableHTML(report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `heritage-risk-report-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}