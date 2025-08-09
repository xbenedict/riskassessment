// Trend Analysis Dashboard for comprehensive temporal analysis
// Provides multiple views of risk trends and forecasting

import React, { useState, useEffect, useMemo } from 'react';
import { TrendChart } from '../Visualization/TrendChart';
import { MockDataService } from '../../services/MockDataService';
import { 
  TrendAnalysisService, 
  type TrendAnalysis, 
  type ComparativeTrendAnalysis,
  type ThreatEvolution 
} from '../../services/TrendAnalysisService';
import type { HeritageSite, RiskAssessment, ThreatType } from '../../types';
import styles from './TrendDashboard.module.css';

type AnalysisView = 'site-trends' | 'comparative' | 'threat-evolution' | 'correlations';

/**
 * Trend Analysis Dashboard Component
 * Provides comprehensive temporal analysis and forecasting capabilities
 * Supports multiple analysis views and interactive exploration
 */
export const TrendDashboard: React.FC = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [selectedView, setSelectedView] = useState<AnalysisView>('site-trends');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedThreatType, setSelectedThreatType] = useState<ThreatType>('weathering');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Analysis results
  const [siteTrends, setSiteTrends] = useState<TrendAnalysis[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<ComparativeTrendAnalysis | null>(null);
  const [threatEvolution, setThreatEvolution] = useState<ThreatEvolution | null>(null);
  
  /**
   * Load initial data and generate mock historical data for demonstration
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Load sites and current assessments
        const [sitesData, currentAssessments] = await Promise.all([
          MockDataService.getHeritageSites(),
          Promise.all((await MockDataService.getHeritageSites()).map(site => 
            MockDataService.getRiskAssessments(site.id)
          )).then(results => results.flat())
        ]);
        
        setSites(sitesData);
        
        // Generate mock historical data for trend analysis
        // TODO: Replace with real historical data from API
        const historicalAssessments: RiskAssessment[] = [];
        
        for (const site of sitesData) {
          const threatTypes: ThreatType[] = ['weathering', 'tourism-pressure', 'climate-change', 'urban-development'];
          
          for (const threatType of threatTypes) {
            const mockHistory = TrendAnalysisService.generateMockHistoricalData(
              site.id, 
              threatType, 
              18 // 18 months of historical data
            );
            historicalAssessments.push(...mockHistory);
          }
        }
        
        // Combine with current assessments
        const allAssessments = [...historicalAssessments, ...currentAssessments];
        setAssessments(allAssessments);
        
        // Set default selected site
        if (sitesData.length > 0 && !selectedSiteId) {
          setSelectedSiteId(sitesData[0].id);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedSiteId]);
  
  /**
   * Generate site trend analyses
   */
  useEffect(() => {
    if (assessments.length === 0 || sites.length === 0) return;
    
    const trends: TrendAnalysis[] = [];
    
    for (const site of sites) {
      const siteAssessments = assessments.filter(a => a.siteId === site.id);
      
      if (siteAssessments.length >= 2) {
        try {
          const timeSeries = TrendAnalysisService.generateRiskTimeSeries(siteAssessments, site.id);
          
          if (timeSeries.length >= 2) {
            // Update site names in time series
            const updatedTimeSeries = timeSeries.map(point => ({
              ...point,
              siteName: site.name
            }));
            
            const trendAnalysis = TrendAnalysisService.analyzeTrend(
              updatedTimeSeries, 
              'Average Risk Magnitude'
            );
            
            trends.push(trendAnalysis);
          }
        } catch (err) {
          console.warn(`Failed to analyze trend for site ${site.name}:`, err);
        }
      }
    }
    
    setSiteTrends(trends);
  }, [assessments, sites]);
  
  /**
   * Generate comparative analysis
   */
  useEffect(() => {
    if (assessments.length === 0 || sites.length === 0) return;
    
    try {
      const analysis = TrendAnalysisService.performComparativeAnalysis(
        assessments,
        sites,
        'Average Risk Magnitude'
      );
      setComparativeAnalysis(analysis);
    } catch (err) {
      console.warn('Failed to generate comparative analysis:', err);
    }
  }, [assessments, sites]);
  
  /**
   * Generate threat evolution analysis
   */
  useEffect(() => {
    if (!selectedSiteId || !selectedThreatType || assessments.length === 0) return;
    
    const selectedSite = sites.find(s => s.id === selectedSiteId);
    if (!selectedSite) return;
    
    try {
      const evolution = TrendAnalysisService.analyzeThreatEvolution(
        assessments,
        selectedSiteId,
        selectedSite.name,
        selectedThreatType
      );
      setThreatEvolution(evolution);
    } catch (err) {
      console.warn('Failed to analyze threat evolution:', err);
      setThreatEvolution(null);
    }
  }, [selectedSiteId, selectedThreatType, assessments, sites]);
  
  /**
   * Get available threat types for selected site
   */
  const availableThreatTypes = useMemo(() => {
    if (!selectedSiteId) return [];
    
    const siteAssessments = assessments.filter(a => a.siteId === selectedSiteId);
    const threatTypes = [...new Set(siteAssessments.map(a => a.threatType))];
    
    return threatTypes;
  }, [selectedSiteId, assessments]);
  
  /**
   * Render view controls
   */
  const renderViewControls = () => (
    <div className={styles.viewControls}>
      <div className={styles.viewTabs}>
        <button
          className={`${styles.viewTab} ${selectedView === 'site-trends' ? styles.active : ''}`}
          onClick={() => setSelectedView('site-trends')}
        >
          Site Trends
        </button>
        <button
          className={`${styles.viewTab} ${selectedView === 'comparative' ? styles.active : ''}`}
          onClick={() => setSelectedView('comparative')}
        >
          Comparative Analysis
        </button>
        <button
          className={`${styles.viewTab} ${selectedView === 'threat-evolution' ? styles.active : ''}`}
          onClick={() => setSelectedView('threat-evolution')}
        >
          Threat Evolution
        </button>
        <button
          className={`${styles.viewTab} ${selectedView === 'correlations' ? styles.active : ''}`}
          onClick={() => setSelectedView('correlations')}
        >
          Correlations
        </button>
      </div>
      
      {(selectedView === 'threat-evolution' || selectedView === 'site-trends') && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="siteSelect">Site:</label>
            <select
              id="siteSelect"
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className={styles.select}
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedView === 'threat-evolution' && (
            <div className={styles.filterGroup}>
              <label htmlFor="threatSelect">Threat Type:</label>
              <select
                id="threatSelect"
                value={selectedThreatType}
                onChange={(e) => setSelectedThreatType(e.target.value as ThreatType)}
                className={styles.select}
              >
                {availableThreatTypes.map(threat => (
                  <option key={threat} value={threat}>
                    {threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  /**
   * Render site trends view
   */
  const renderSiteTrendsView = () => {
    const selectedSiteTrend = siteTrends.find(t => t.siteId === selectedSiteId);
    
    if (!selectedSiteTrend) {
      return (
        <div className={styles.noData}>
          <p>No trend data available for the selected site.</p>
          <p>At least 2 risk assessments are required for trend analysis.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.trendsView}>
        <TrendChart
          data={selectedSiteTrend}
          title={`Risk Trend Analysis - ${selectedSiteTrend.siteName}`}
          height={400}
          showForecast={true}
          showTrendLine={true}
        />
        
        <div className={styles.insights}>
          <h4>Key Insights</h4>
          <ul>
            <li>
              <strong>Trend Direction:</strong> Risk levels are {selectedSiteTrend.trend} 
              with {Math.abs(selectedSiteTrend.trendStrength * 100).toFixed(1)}% strength
            </li>
            <li>
              <strong>Change Rate:</strong> {selectedSiteTrend.changeRate >= 0 ? 'Increased' : 'Decreased'} by {Math.abs(selectedSiteTrend.changeRate).toFixed(1)}% over the analysis period
            </li>
            <li>
              <strong>Average Risk:</strong> {selectedSiteTrend.averageValue.toFixed(1)} magnitude on ABC scale
            </li>
            {selectedSiteTrend.forecast && selectedSiteTrend.forecast.length > 2 && (
              <li>
                <strong>3-Month Forecast:</strong> Predicted risk level of {selectedSiteTrend.forecast[2].value.toFixed(1)} 
                based on current trend
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };
  
  /**
   * Render comparative analysis view
   */
  const renderComparativeView = () => {
    if (!comparativeAnalysis || comparativeAnalysis.sites.length === 0) {
      return (
        <div className={styles.noData}>
          <p>No comparative data available.</p>
          <p>Multiple sites with historical data are required for comparative analysis.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.comparativeView}>
        <TrendChart
          data={comparativeAnalysis}
          title="Comparative Risk Trend Analysis"
          height={450}
          showForecast={false}
        />
        
        <div className={styles.correlations}>
          <h4>Site Correlations</h4>
          <div className={styles.correlationGrid}>
            {comparativeAnalysis.correlations.map((corr, index) => (
              <div key={index} className={styles.correlationItem}>
                <span className={styles.sitePair}>
                  {corr.siteA} ↔ {corr.siteB}
                </span>
                <span className={`${styles.correlationValue} ${getCorrelationClass(corr.correlation)}`}>
                  {(corr.correlation * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.insights}>
          <h4>Comparative Insights</h4>
          <ul>
            <li>
              <strong>Overall Trend:</strong> Portfolio is {comparativeAnalysis.overallTrend}
            </li>
            <li>
              <strong>Sites Analyzed:</strong> {comparativeAnalysis.sites.length} heritage sites
            </li>
            <li>
              <strong>Analysis Period:</strong> {comparativeAnalysis.timeRange.start.toLocaleDateString()} to {comparativeAnalysis.timeRange.end.toLocaleDateString()}
            </li>
            <li>
              <strong>Highest Risk Site:</strong> {comparativeAnalysis.sites[0]?.siteName || 'N/A'}
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  /**
   * Render threat evolution view
   */
  const renderThreatEvolutionView = () => {
    if (!threatEvolution) {
      return (
        <div className={styles.noData}>
          <p>No threat evolution data available for the selected site and threat type.</p>
          <p>Historical assessments are required for threat evolution analysis.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.evolutionView}>
        <TrendChart
          data={threatEvolution}
          title={`${threatEvolution.threatType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Evolution - ${threatEvolution.siteName}`}
          height={400}
          showForecast={false}
        />
        
        {threatEvolution.criticalPeriods.length > 0 && (
          <div className={styles.criticalPeriods}>
            <h4>Critical Periods</h4>
            <div className={styles.periodsGrid}>
              {threatEvolution.criticalPeriods.map((period, index) => (
                <div key={index} className={styles.periodItem}>
                  <div className={styles.periodHeader}>
                    <span className={styles.periodDates}>
                      {period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}
                    </span>
                    <span className={styles.peakMagnitude}>
                      Peak: {period.peakMagnitude}
                    </span>
                  </div>
                  <p className={styles.periodReason}>{period.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.insights}>
          <h4>Evolution Insights</h4>
          <ul>
            <li>
              <strong>Evolution Pattern:</strong> Threat is {threatEvolution.evolution}
            </li>
            <li>
              <strong>Assessment History:</strong> {threatEvolution.timeline.length} assessments over time
            </li>
            <li>
              <strong>Critical Periods:</strong> {threatEvolution.criticalPeriods.length} high-risk periods identified
            </li>
            <li>
              <strong>Current Status:</strong> Latest magnitude of {threatEvolution.timeline[threatEvolution.timeline.length - 1]?.magnitude || 'N/A'}
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  /**
   * Render correlations view
   */
  const renderCorrelationsView = () => {
    if (!comparativeAnalysis) {
      return (
        <div className={styles.noData}>
          <p>Correlation analysis requires comparative data.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.correlationsView}>
        <h3>Site Risk Correlations</h3>
        <p>Correlation analysis shows how risk trends at different sites relate to each other.</p>
        
        <div className={styles.correlationMatrix}>
          {comparativeAnalysis.correlations.map((corr, index) => (
            <div key={index} className={styles.correlationCard}>
              <div className={styles.correlationHeader}>
                <h4>{corr.siteA} ↔ {corr.siteB}</h4>
                <span className={`${styles.correlationBadge} ${getCorrelationClass(corr.correlation)}`}>
                  {(corr.correlation * 100).toFixed(0)}%
                </span>
              </div>
              <div className={styles.correlationDescription}>
                {getCorrelationDescription(corr.correlation)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading trend analysis data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className={styles.trendDashboard}>
      <div className={styles.header}>
        <h2>Heritage Risk Trend Analysis</h2>
        <p>Temporal analysis and forecasting for heritage site risk management</p>
      </div>
      
      {renderViewControls()}
      
      <div className={styles.content}>
        {selectedView === 'site-trends' && renderSiteTrendsView()}
        {selectedView === 'comparative' && renderComparativeView()}
        {selectedView === 'threat-evolution' && renderThreatEvolutionView()}
        {selectedView === 'correlations' && renderCorrelationsView()}
      </div>
    </div>
  );
};

/**
 * Get CSS class for correlation strength
 */
function getCorrelationClass(correlation: number): string {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return 'strong';
  if (abs >= 0.4) return 'moderate';
  return 'weak';
}

/**
 * Get description for correlation value
 */
function getCorrelationDescription(correlation: number): string {
  const abs = Math.abs(correlation);
  const direction = correlation >= 0 ? 'positive' : 'negative';
  
  if (abs >= 0.7) {
    return `Strong ${direction} correlation - sites tend to follow similar risk patterns`;
  } else if (abs >= 0.4) {
    return `Moderate ${direction} correlation - some relationship between site risk trends`;
  } else {
    return `Weak correlation - little relationship between site risk trends`;
  }
}