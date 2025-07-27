// Chart Dashboard Component
// Provides a comprehensive view of risk data through multiple chart types

import React, { useState, useEffect } from 'react';
import { RiskChart } from './RiskChart';
import { MockDataService } from '../../services/MockDataService';
import type { RiskAssessment, HeritageSite } from '../../types';
import styles from './ChartDashboard.module.css';

interface ChartDashboardProps {
  siteId?: string; // If provided, show charts for specific site only
  title?: string;
  showSiteSelector?: boolean;
}

/**
 * Chart Dashboard Component
 * Displays multiple chart types for comprehensive risk data visualization
 */
export const ChartDashboard: React.FC<ChartDashboardProps> = ({
  siteId,
  title = 'Risk Assessment Dashboard',
  showSiteSelector = true
}) => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(siteId || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount and when site selection changes
  useEffect(() => {
    loadData();
  }, [selectedSiteId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load sites for selector
      if (showSiteSelector) {
        const sitesData = await MockDataService.getHeritageSites();
        setSites(sitesData);
      }

      // Load assessments
      let assessmentsData: RiskAssessment[] = [];
      
      if (selectedSiteId === 'all') {
        // Load all assessments across all sites
        const allSites = await MockDataService.getHeritageSites();
        const assessmentPromises = allSites.map(site => 
          MockDataService.getRiskAssessments(site.id)
        );
        const assessmentArrays = await Promise.all(assessmentPromises);
        assessmentsData = assessmentArrays.flat();
      } else {
        // Load assessments for specific site
        assessmentsData = await MockDataService.getRiskAssessments(selectedSiteId);
      }

      setAssessments(assessmentsData);
    } catch (err) {
      setError('Failed to load risk assessment data. Please try again.');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChartClick = (data: any) => {
    console.log('Chart clicked:', data);
    // TODO: Implement chart click handling (e.g., navigate to detailed view)
  };

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSiteId(event.target.value);
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading risk assessment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={loadData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedSite = sites.find(site => site.id === selectedSiteId);
  const dashboardTitle = selectedSiteId === 'all' 
    ? 'All Heritage Sites - Risk Assessment Dashboard'
    : `${selectedSite?.name || 'Selected Site'} - Risk Assessment Dashboard`;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>{title}</h2>
        
        {showSiteSelector && sites.length > 0 && (
          <div className={styles.siteSelector}>
            <label htmlFor="site-select">View data for:</label>
            <select 
              id="site-select"
              value={selectedSiteId} 
              onChange={handleSiteChange}
              className={styles.select}
            >
              <option value="all">All Heritage Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className={styles.noData}>
          <h3>No Risk Assessment Data</h3>
          <p>
            {selectedSiteId === 'all' 
              ? 'No risk assessments found across all heritage sites.'
              : `No risk assessments found for ${selectedSite?.name || 'the selected site'}.`
            }
          </p>
        </div>
      ) : (
        <div className={styles.chartsGrid}>
          {/* Risk Magnitude Comparison Chart */}
          <div className={styles.chartSection}>
            <RiskChart
              assessments={assessments}
              chartType="magnitude"
              title="Risk Magnitude by Threat Type"
              onChartClick={handleChartClick}
              showExport={true}
              responsive={true}
            />
          </div>

          {/* Risk Category Distribution Chart */}
          <div className={styles.chartSection}>
            <RiskChart
              assessments={assessments}
              chartType="category"
              title="Risk Priority Distribution"
              onChartClick={handleChartClick}
              showExport={true}
              responsive={true}
            />
          </div>

          {/* Threat Type Comparison Chart */}
          <div className={styles.chartSection}>
            <RiskChart
              assessments={assessments}
              chartType="threat-comparison"
              title="Threat Type Analysis"
              onChartClick={handleChartClick}
              showExport={true}
              responsive={true}
            />
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {assessments.length > 0 && (
        <div className={styles.summaryStats}>
          <h3>Summary Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{assessments.length}</div>
              <div className={styles.statLabel}>Total Assessments</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {assessments.filter(a => a.priority === 'extremely-high' || a.priority === 'very-high').length}
              </div>
              <div className={styles.statLabel}>High Priority Risks</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {Math.round(assessments.reduce((sum, a) => sum + a.magnitude, 0) / assessments.length * 10) / 10}
              </div>
              <div className={styles.statLabel}>Average Magnitude</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {new Set(assessments.map(a => a.threatType)).size}
              </div>
              <div className={styles.statLabel}>Threat Types</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDashboard;