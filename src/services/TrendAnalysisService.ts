// Trend Analysis Service for temporal analysis and forecasting
// Provides time-series analysis and comparative trend visualization

import type { 
  HeritageSite, 
  RiskAssessment, 
  RiskPriority,
  ThreatType 
} from '../types';

/**
 * Time-series data point for trend analysis
 */
export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
  siteId: string;
  siteName: string;
  threatType?: ThreatType;
  priority?: RiskPriority;
}

/**
 * Trend analysis result for a specific metric
 */
export interface TrendAnalysis {
  metric: string;
  siteId: string;
  siteName: string;
  dataPoints: TimeSeriesDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  trendStrength: number; // -1 to 1, where -1 is strong decrease, 1 is strong increase
  averageValue: number;
  changeRate: number; // percentage change over time period
  forecast?: TimeSeriesDataPoint[]; // predicted future values
}

/**
 * Comparative trend analysis between multiple sites
 */
export interface ComparativeTrendAnalysis {
  metric: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  sites: {
    siteId: string;
    siteName: string;
    trend: TrendAnalysis;
  }[];
  overallTrend: 'improving' | 'deteriorating' | 'mixed';
  correlations: {
    siteA: string;
    siteB: string;
    correlation: number; // -1 to 1
  }[];
}

/**
 * Threat evolution analysis over time
 */
export interface ThreatEvolution {
  threatType: ThreatType;
  siteId: string;
  siteName: string;
  timeline: {
    date: Date;
    magnitude: number;
    priority: RiskPriority;
    assessor: string;
    notes: string;
  }[];
  evolution: 'escalating' | 'stable' | 'improving';
  criticalPeriods: {
    start: Date;
    end: Date;
    reason: string;
    peakMagnitude: number;
  }[];
}

/**
 * Trend Analysis Service for heritage risk temporal analysis
 * Provides comprehensive time-series analysis and forecasting capabilities
 * 
 * TODO: For production deployment:
 * - Integrate with advanced statistical libraries for better forecasting
 * - Add seasonal decomposition for climate-related threats
 * - Implement machine learning models for threat prediction
 * - Add confidence intervals for forecasts
 * - Include external data correlation (weather, tourism, etc.)
 */
export class TrendAnalysisService {
  
  /**
   * Generate time-series data for risk magnitude evolution
   * @param assessments Risk assessments for analysis
   * @param siteId Optional site ID to filter assessments
   * @param threatType Optional threat type to filter assessments
   * @returns Time-series data points
   */
  static generateRiskTimeSeries(
    assessments: RiskAssessment[], 
    siteId?: string,
    threatType?: ThreatType
  ): TimeSeriesDataPoint[] {
    let filteredAssessments = assessments;
    
    if (siteId) {
      filteredAssessments = filteredAssessments.filter(a => a.siteId === siteId);
    }
    
    if (threatType) {
      filteredAssessments = filteredAssessments.filter(a => a.threatType === threatType);
    }
    
    // Group assessments by site and date, taking the latest assessment per day
    const groupedData = filteredAssessments.reduce((groups, assessment) => {
      const dateKey = assessment.assessmentDate.toDateString();
      const siteKey = assessment.siteId;
      const key = `${siteKey}-${dateKey}`;
      
      if (!groups[key] || groups[key].assessmentDate < assessment.assessmentDate) {
        groups[key] = assessment;
      }
      
      return groups;
    }, {} as Record<string, RiskAssessment>);
    
    // Convert to time series data points
    return Object.values(groupedData).map(assessment => ({
      date: assessment.assessmentDate,
      value: assessment.magnitude,
      siteId: assessment.siteId,
      siteName: `Site ${assessment.siteId}`, // TODO: Get actual site name from site data
      threatType: assessment.threatType,
      priority: assessment.priority
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  /**
   * Analyze trend for a specific metric over time
   * @param dataPoints Time-series data points
   * @param metric Name of the metric being analyzed
   * @returns Trend analysis result
   */
  static analyzeTrend(dataPoints: TimeSeriesDataPoint[], metric: string): TrendAnalysis {
    if (dataPoints.length < 2) {
      throw new Error('At least 2 data points required for trend analysis');
    }
    
    // Sort data points by date
    const sortedPoints = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate linear regression for trend analysis
    const n = sortedPoints.length;
    const xValues = sortedPoints.map((_, index) => index);
    const yValues = sortedPoints.map(point => point.value);
    
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Determine trend direction and strength
    const trendStrength = Math.tanh(slope); // Normalize slope to -1 to 1 range
    let trend: 'increasing' | 'decreasing' | 'stable';
    
    if (Math.abs(trendStrength) < 0.1) {
      trend = 'stable';
    } else if (trendStrength > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
    
    // Calculate average value and change rate
    const averageValue = sumY / n;
    const firstValue = yValues[0];
    const lastValue = yValues[yValues.length - 1];
    const changeRate = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    
    // Generate simple linear forecast for next 3 months
    const lastDate = sortedPoints[sortedPoints.length - 1].date;
    const forecast: TimeSeriesDataPoint[] = [];
    
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      const forecastValue = intercept + slope * (n + i - 1);
      
      forecast.push({
        date: forecastDate,
        value: Math.max(0, forecastValue), // Ensure non-negative values
        siteId: sortedPoints[0].siteId,
        siteName: sortedPoints[0].siteName
      });
    }
    
    return {
      metric,
      siteId: sortedPoints[0].siteId,
      siteName: sortedPoints[0].siteName,
      dataPoints: sortedPoints,
      trend,
      trendStrength,
      averageValue: Math.round(averageValue * 100) / 100,
      changeRate: Math.round(changeRate * 100) / 100,
      forecast
    };
  }
  
  /**
   * Perform comparative trend analysis across multiple sites
   * @param assessments All risk assessments
   * @param sites Heritage sites for analysis
   * @param metric Metric to analyze (e.g., 'average_risk_magnitude')
   * @returns Comparative trend analysis
   */
  static performComparativeAnalysis(
    assessments: RiskAssessment[],
    sites: HeritageSite[],
    metric: string = 'average_risk_magnitude'
  ): ComparativeTrendAnalysis {
    const siteAnalyses: { siteId: string; siteName: string; trend: TrendAnalysis; }[] = [];
    
    // Analyze trend for each site
    for (const site of sites) {
      const siteAssessments = assessments.filter(a => a.siteId === site.id);
      
      if (siteAssessments.length >= 2) {
        const timeSeries = this.generateRiskTimeSeries(siteAssessments, site.id);
        
        if (timeSeries.length >= 2) {
          // Update site names in time series data
          const updatedTimeSeries = timeSeries.map(point => ({
            ...point,
            siteName: site.name
          }));
          
          const trendAnalysis = this.analyzeTrend(updatedTimeSeries, metric);
          
          siteAnalyses.push({
            siteId: site.id,
            siteName: site.name,
            trend: trendAnalysis
          });
        }
      }
    }
    
    // Determine overall trend
    const improvingCount = siteAnalyses.filter(s => s.trend.trend === 'decreasing').length; // Decreasing risk is improving
    const deterioratingCount = siteAnalyses.filter(s => s.trend.trend === 'increasing').length;
    const stableCount = siteAnalyses.filter(s => s.trend.trend === 'stable').length;
    
    let overallTrend: 'improving' | 'deteriorating' | 'mixed';
    if (improvingCount > deterioratingCount && improvingCount > stableCount) {
      overallTrend = 'improving';
    } else if (deterioratingCount > improvingCount && deterioratingCount > stableCount) {
      overallTrend = 'deteriorating';
    } else {
      overallTrend = 'mixed';
    }
    
    // Calculate correlations between sites
    const correlations: { siteA: string; siteB: string; correlation: number; }[] = [];
    
    for (let i = 0; i < siteAnalyses.length; i++) {
      for (let j = i + 1; j < siteAnalyses.length; j++) {
        const siteA = siteAnalyses[i];
        const siteB = siteAnalyses[j];
        
        const correlation = this.calculateCorrelation(
          siteA.trend.dataPoints.map(p => p.value),
          siteB.trend.dataPoints.map(p => p.value)
        );
        
        correlations.push({
          siteA: siteA.siteName,
          siteB: siteB.siteName,
          correlation: Math.round(correlation * 100) / 100
        });
      }
    }
    
    // Determine time range
    const allDates = siteAnalyses.flatMap(s => s.trend.dataPoints.map(p => p.date));
    const timeRange = {
      start: new Date(Math.min(...allDates.map(d => d.getTime()))),
      end: new Date(Math.max(...allDates.map(d => d.getTime())))
    };
    
    return {
      metric,
      timeRange,
      sites: siteAnalyses,
      overallTrend,
      correlations
    };
  }
  
  /**
   * Analyze threat evolution over time for a specific site
   * @param assessments Risk assessments for the site
   * @param siteId Site ID to analyze
   * @param siteName Site name
   * @param threatType Specific threat type to analyze
   * @returns Threat evolution analysis
   */
  static analyzeThreatEvolution(
    assessments: RiskAssessment[],
    siteId: string,
    siteName: string,
    threatType: ThreatType
  ): ThreatEvolution {
    const threatAssessments = assessments
      .filter(a => a.siteId === siteId && a.threatType === threatType)
      .sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime());
    
    if (threatAssessments.length === 0) {
      throw new Error(`No assessments found for threat ${threatType} at site ${siteId}`);
    }
    
    // Create timeline
    const timeline = threatAssessments.map(assessment => ({
      date: assessment.assessmentDate,
      magnitude: assessment.magnitude,
      priority: assessment.priority,
      assessor: assessment.assessor,
      notes: assessment.notes
    }));
    
    // Determine evolution trend
    let evolution: 'escalating' | 'stable' | 'improving';
    
    if (timeline.length >= 2) {
      const firstMagnitude = timeline[0].magnitude;
      const lastMagnitude = timeline[timeline.length - 1].magnitude;
      const change = lastMagnitude - firstMagnitude;
      
      if (change > 1) {
        evolution = 'escalating';
      } else if (change < -1) {
        evolution = 'improving';
      } else {
        evolution = 'stable';
      }
    } else {
      evolution = 'stable';
    }
    
    // Identify critical periods (periods with high risk magnitude)
    const criticalPeriods: ThreatEvolution['criticalPeriods'] = [];
    let currentPeriod: { start: Date; entries: typeof timeline; } | null = null;
    
    timeline.forEach((entry, index) => {
      const isHighRisk = entry.magnitude >= 10; // Very high or extremely high risk
      
      if (isHighRisk) {
        if (!currentPeriod) {
          currentPeriod = { start: entry.date, entries: [entry] };
        } else {
          currentPeriod.entries.push(entry);
        }
      } else if (currentPeriod) {
        // End of critical period
        const peakMagnitude = Math.max(...currentPeriod.entries.map(e => e.magnitude));
        const endDate = index > 0 ? timeline[index - 1].date : currentPeriod.entries[currentPeriod.entries.length - 1].date;
        
        criticalPeriods.push({
          start: currentPeriod.start,
          end: endDate,
          reason: `High risk period for ${threatType}`,
          peakMagnitude
        });
        
        currentPeriod = null;
      }
    });
    
    // Handle ongoing critical period
    if (currentPeriod) {
      const peakMagnitude = Math.max(...currentPeriod.entries.map(e => e.magnitude));
      criticalPeriods.push({
        start: currentPeriod.start,
        end: timeline[timeline.length - 1].date,
        reason: `Ongoing high risk period for ${threatType}`,
        peakMagnitude
      });
    }
    
    return {
      threatType,
      siteId,
      siteName,
      timeline,
      evolution,
      criticalPeriods
    };
  }
  
  /**
   * Calculate Pearson correlation coefficient between two data series
   * @param seriesA First data series
   * @param seriesB Second data series
   * @returns Correlation coefficient (-1 to 1)
   */
  private static calculateCorrelation(seriesA: number[], seriesB: number[]): number {
    if (seriesA.length !== seriesB.length || seriesA.length === 0) {
      return 0;
    }
    
    const n = seriesA.length;
    const sumA = seriesA.reduce((sum, val) => sum + val, 0);
    const sumB = seriesB.reduce((sum, val) => sum + val, 0);
    const sumAB = seriesA.reduce((sum, val, i) => sum + val * seriesB[i], 0);
    const sumAA = seriesA.reduce((sum, val) => sum + val * val, 0);
    const sumBB = seriesB.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumAB - sumA * sumB;
    const denominator = Math.sqrt((n * sumAA - sumA * sumA) * (n * sumBB - sumB * sumB));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  /**
   * Generate mock historical data for demonstration purposes
   * TODO: Remove when real historical data is available
   * @param siteId Site ID
   * @param threatType Threat type
   * @param months Number of months of historical data
   * @returns Mock historical assessments
   */
  static generateMockHistoricalData(
    siteId: string,
    threatType: ThreatType,
    months: number = 12
  ): RiskAssessment[] {
    const assessments: RiskAssessment[] = [];
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - months);
    
    for (let i = 0; i < months; i++) {
      const assessmentDate = new Date(baseDate);
      assessmentDate.setMonth(assessmentDate.getMonth() + i);
      
      // Generate realistic trend data with some randomness
      const trendFactor = i / months; // 0 to 1 over time
      const randomFactor = (Math.random() - 0.5) * 0.4; // -0.2 to 0.2
      
      // Simulate different threat patterns
      let baseMagnitude: number;
      switch (threatType) {
        case 'weathering':
          baseMagnitude = 6 + trendFactor * 3 + randomFactor; // Gradually increasing
          break;
        case 'tourism-pressure':
          baseMagnitude = 8 + Math.sin(trendFactor * Math.PI * 2) * 2 + randomFactor; // Seasonal pattern
          break;
        case 'climate-change':
          baseMagnitude = 5 + trendFactor * 5 + randomFactor; // Accelerating increase
          break;
        default:
          baseMagnitude = 7 + randomFactor;
      }
      
      const magnitude = Math.max(3, Math.min(15, Math.round(baseMagnitude)));
      const probability = Math.max(1, Math.min(5, Math.round(magnitude / 3)));
      const lossOfValue = Math.max(1, Math.min(5, Math.round(magnitude / 3)));
      const fractionAffected = Math.max(1, Math.min(5, magnitude - probability - lossOfValue + 1));
      
      // Determine priority based on magnitude
      let priority: RiskPriority;
      if (magnitude >= 13) priority = 'extremely-high';
      else if (magnitude >= 10) priority = 'very-high';
      else if (magnitude >= 7) priority = 'high';
      else if (magnitude >= 4) priority = 'medium-high';
      else priority = 'low';
      
      assessments.push({
        id: `mock-${siteId}-${threatType}-${i}`,
        siteId,
        threatType,
        probability,
        lossOfValue,
        fractionAffected,
        magnitude,
        priority,
        uncertaintyLevel: 'medium',
        assessmentDate,
        assessor: 'Historical Data Generator',
        notes: `Mock historical assessment for ${threatType} threat analysis`
      });
    }
    
    return assessments;
  }
}