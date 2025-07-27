// Temporal Analysis Component for Heritage Risk Dashboard
// Provides comprehensive time-series analysis, comparative trends, and forecasting

import React, { useState, useEffect, useMemo } from 'react';
import { TrendChart } from '../Visualization/TrendChart';
import { TrendAnalysisService } from '../../services/TrendAnalysisService';
import { MockDataService } from '../../services/MockDataService';
import type { 
  HeritageSite, 
  RiskAssessment, 
  ThreatType,
  TrendAnalysis,
  ComparativeTrendAnalysis,
  ThreatEvolution
} from '../../types';
import styles from './TemporalAnalysis.module.css';

interface TemporalAnalysisProps {
  className?: string;
}

type AnalysisMode = 'single-site' | 'comparative' | 'threat-evolution';

/**
 * Temporal Analysis Component
 * Implements Requirements 5.2 and 5.3:
 * - Time-series charts showing risk evolution over time
 * - Comparative analysis between different heritage sites
 * - Trend indicators and forecasting visualizations
 */
export const TemporalAnalysis: React.FC<TemporalAnalysisProps> = ({ className }) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analysis configuration state
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('single-site');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [selectedThreatType, setSelectedThreatType] = useState<ThreatType>('weathering');
  const [timeRange, setTimeRange] = useState<number>(12); // months
  
  // Analysis results state
  const [singleSiteTrend, setSingleSiteTrend] = useState<TrendAnalysis | null>(null);
  const [comparativeTrend, setComparativeTrend] = useState<ComparativeTrendAnalysis | null>(null);
  const [threatEvolution, setThreatEvolution] = useState<ThreatEvolution | null>(null);

  /**
   * Load initial data
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [sitesData, allAssessments] = await Promise.all([
          MockDataService.getHeritageSites(),
          loadAllAssessments()
        ]);
        
        setSites(sitesData);
        setAssessments(allAssessments);
        
        // Set default selections
        if (sitesData.length > 0) {
          setSelectedSiteId(sitesData[0].id);
          setSelectedSiteIds([sitesData[0].id, sitesData[1]?.id].filter(Boolean));
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  /**
   * Load all risk assessments including historical mock data
   */
  const loadAllAssessments = async (): Promise<RiskAssessment[]> => {
    const sites = await MockDataService.getHeritageSites();
    const allAssessments: RiskAssessment[] = [];
    
    // Load existing assessments
    for (const site of sites) {
      const siteAssessments = await MockDataService.getRiskAssessments(site.id);
      allAssessments.push(...siteAssessments);
    }
    
    // Generate additional historical data for better trend analysis
    const threatTypes: ThreatType[] = ['weathering', 'tourism-pressure', 'climate-change', 'flooding', 'urban-development'];
    
    for (const site of sites) {
      for (const threatType of threatTypes) {
        // Only generate if we don't have enough historical data
        const existingData = allAssessments.filter(a => a.siteId === site.id && a.threatType === threatType);
        if (existingData.length < 6) {
          const historicalData = TrendAnalysisService.generateMockHistoricalData(
            site.id, 
            threatType, 
            timeRange
          );
          allAssessments.push(...historicalData);
        }
      }
    }
    
    return allAssessments;
  };

  /**
   * Perform single site trend analysis
   */
  useEffect(() => {
    if (analysisMode === 'single-site' && selectedSiteId && assessments.length > 0) {
      try {
        const siteAssessments = assessments.filter(a => a.siteId === selectedSiteId);
        const timeSeries = TrendAnalysisService.generateRiskTimeSeries(siteAssessments, selectedSiteId);
        
        if (timeSeries.length >= 2) {
          const site = sites.find(s => s.id === selectedSiteId);
          const updatedTimeSeries = timeSeries.map(point => ({
            ...point,
            siteName: site?.name || point.siteName
          }));
          
          const trend = TrendAnalysisService.analyzeTrend(updatedTimeSeries, 'Average Risk Magnitude');
          setSingleSiteTrend(trend);
        } else {
          setSingleSiteTrend(null);
        }
      } catch (err) {
        console.error('Error analyzing single site trend:', err);
        setSingleSiteTrend(null);
      }
    }
  }, [analysisMode, selectedSiteId, assessments, sites]);

  /**
   * Perform comparative trend analysis
   */
  useEffect(() => {
    if (analysisMode === 'comparative' && selectedSiteIds.length >= 2 && assessments.length > 0) {
      try {
        const selectedSites = sites.filter(s => selectedSiteIds.includes(s.id));
        const comparative = TrendAnalysisService.performComparativeAnalysis(
          assessments,
          selectedSites,
          'Average Risk Magnitude'
        );
        setComparativeTrend(comparative);
      } catch (err) {
        console.error('Error performing comparative analysis:', err);
        setComparativeTrend(null);
      }
    }
  }, [analysisMode, selectedSiteIds, assessments, sites]);

  /**
   * Perform threat evolution analysis
   */
  useEffect(() => {
    if (analysisMode === 'threat-evolution' && selectedSiteId && selectedThreatType && assessments.length > 0) {
      try {
        const site = sites.find(s => s.id === selectedSiteId);
        if (site) {
          const evolution = TrendAnalysisService.analyzeThreatEvolution(
            assessments,
            selectedSiteId,
            site.name,
            selectedThreatType
          );
          setThreatEvolution(evolution);
        }
      } catch (err) {
        console.error('Error analyzing threat evolution:', err);
        setThreatEvolution(null);
      }
    }
  }, [analysisMode, selectedSiteId, selectedThreatType, assessments, sites]);

  /**
   * Available threat types for selection
   */
  const threatTypes: { value: ThreatType; label: string }[] = [
    { value: 'weathering', label: 'Weathering' },
    { value: 'tourism-pressure', label: 'Tourism Pressure' },
    { value: 'climate-change', label: 'Climate Change' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'urban-development', label: 'Urban Development' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'vegetation', label: 'Vegetation' },
    { value: 'looting', label: 'Looting' },
    { value: 'conflict', label: 'Conflict' }
  ];

  /**
   * Render analysis controls
   */
  const renderControls = () => (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <label htmlFor="analysis-type" className={styles.label}>Analysis Type:</label>
        <select 
          id="analysis-type"
          value={analysisMode} 
          onChange={(e) => setAnalysisMode(e.target.value as AnalysisMode)}
          className={styles.select}
        >
          <option value="single-site">Single Site Trend</option>
          <option value="comparative">Comparative Analysis</option>
          <option value="threat-evolution">Threat Evolution</option>
        </select>
      </div>

      {analysisMode === 'single-site' && (
        <div className={styles.controlGroup}>
          <label htmlFor="heritage-site" className={styles.label}>Heritage Site:</label>
          <select 
            id="heritage-site"
            value={selectedSiteId} 
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className={styles.select}
          >
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
      )}

      {analysisMode === 'comparative' && (
        <div className={styles.controlGroup}>
          <label className={styles.label}>Sites to Compare:</label>
          <div className={styles.multiSelect}>
            {sites.map(site => (
              <label key={site.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedSiteIds.includes(site.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSiteIds([...selectedSiteIds, site.id]);
                    } else {
                      setSelectedSiteIds(selectedSiteIds.filter(id => id !== site.id));
                    }
                  }}
                  className={styles.checkbox}
                />
                {site.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {analysisMode === 'threat-evolution' && (
        <>
          <div className={styles.controlGroup}>
            <label htmlFor="heritage-site-evolution" className={styles.label}>Heritage Site:</label>
            <select 
              id="heritage-site-evolution"
              value={selectedSiteId} 
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className={styles.select}
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="threat-type" className={styles.label}>Threat Type:</label>
            <select 
              id="threat-type"
              value={selectedThreatType} 
              onChange={(e) => setSelectedThreatType(e.target.value as ThreatType)}
              className={styles.select}
            >
              {threatTypes.map(threat => (
                <option key={threat.value} value={threat.value}>{threat.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className={styles.controlGroup}>
        <label htmlFor="time-range" className={styles.label}>Time Range:</label>
        <select 
          id="time-range"
          value={timeRange} 
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className={styles.select}
        >
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>
    </div>
  );

  /**
   * Render correlation matrix for comparative analysis
   */
  const renderCorrelationMatrix = () => {
    if (analysisMode !== 'comparative' || !comparativeTrend) return null;

    return (
      <div className={styles.correlationMatrix}>
        <h3 className={styles.sectionTitle}>Site Correlations</h3>
        <div className={styles.correlationGrid}>
          {comparativeTrend.correlations.map((correlation, index) => (
            <div key={index} className={styles.correlationItem}>
              <span className={styles.correlationSites}>
                {correlation.siteA} ↔ {correlation.siteB}
              </span>
              <span className={`${styles.correlationValue} ${
                correlation.correlation > 0.5 ? styles.highCorrelation :
                correlation.correlation < -0.5 ? styles.negativeCorrelation :
                styles.lowCorrelation
              }`}>
                {correlation.correlation.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render critical periods for threat evolution
   */
  const renderCriticalPeriods = () => {
    if (analysisMode !== 'threat-evolution' || !threatEvolution) return null;

    return (
      <div className={styles.criticalPeriods}>
        <h3 className={styles.sectionTitle}>Critical Periods</h3>
        {threatEvolution.criticalPeriods.length === 0 ? (
          <p className={styles.noCriticalPeriods}>No critical periods identified</p>
        ) : (
          <div className={styles.periodsGrid}>
            {threatEvolution.criticalPeriods.map((period, index) => (
              <div key={index} className={styles.periodItem}>
                <div className={styles.periodDates}>
                  {period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}
                </div>
                <div className={styles.periodReason}>{period.reason}</div>
                <div className={styles.periodMagnitude}>
                  Peak Magnitude: <strong>{period.peakMagnitude}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.temporalAnalysis} ${className || ''}`}>
        <div className={styles.loading}>
          <div className={styles.spinner} data-testid="spinner"></div>
          <p>Loading temporal analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.temporalAnalysis} ${className || ''}`}>
        <div className={styles.error}>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.temporalAnalysis} ${className || ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Temporal Risk Analysis</h2>
        <p className={styles.description}>
          Analyze risk trends over time, compare sites, and track threat evolution
        </p>
      </div>

      {renderControls()}

      <div className={styles.analysisContent}>
        {analysisMode === 'single-site' && singleSiteTrend && (
          <div className={styles.analysisSection}>
            <TrendChart 
              data={singleSiteTrend}
              title={`Risk Trend Analysis - ${singleSiteTrend.siteName}`}
              height={400}
              showForecast={true}
              showTrendLine={true}
            />
          </div>
        )}

        {analysisMode === 'comparative' && comparativeTrend && (
          <div className={styles.analysisSection}>
            <TrendChart 
              data={comparativeTrend}
              title="Comparative Risk Analysis"
              height={400}
              showForecast={false}
              showTrendLine={true}
            />
            {renderCorrelationMatrix()}
          </div>
        )}

        {analysisMode === 'threat-evolution' && threatEvolution && (
          <div className={styles.analysisSection}>
            <TrendChart 
              data={threatEvolution}
              title={`${threatEvolution.threatType} Evolution - ${threatEvolution.siteName}`}
              height={400}
              showForecast={false}
              showTrendLine={true}
            />
            {renderCriticalPeriods()}
          </div>
        )}

        {/* Show message if no data available */}
        {((analysisMode === 'single-site' && !singleSiteTrend) ||
          (analysisMode === 'comparative' && !comparativeTrend) ||
          (analysisMode === 'threat-evolution' && !threatEvolution)) && (
          <div className={styles.noData}>
            <h3>No Data Available</h3>
            <p>
              {analysisMode === 'single-site' && 'Not enough assessment data for trend analysis. At least 2 assessments are required.'}
              {analysisMode === 'comparative' && 'Please select at least 2 sites for comparative analysis.'}
              {analysisMode === 'threat-evolution' && 'No assessment data found for the selected threat type and site.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};