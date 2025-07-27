// Trend Chart component for temporal analysis and forecasting visualization
// Uses Chart.js for interactive time-series charts

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import type { 
  TrendAnalysis, 
  ComparativeTrendAnalysis, 
  ThreatEvolution 
} from '../../services/TrendAnalysisService';
import styles from './TrendChart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface TrendChartProps {
  data: TrendAnalysis | ComparativeTrendAnalysis | ThreatEvolution;
  title?: string;
  height?: number;
  showForecast?: boolean;
  showTrendLine?: boolean;
}

/**
 * Trend Chart Component
 * Displays time-series data with trend analysis and forecasting
 * Supports single site trends, comparative analysis, and threat evolution
 */
export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title,
  height = 400,
  showForecast = true,
  showTrendLine = true
}) => {
  
  /**
   * Generate Chart.js data configuration based on input data type
   */
  const chartData = useMemo(() => {
    // Handle single trend analysis
    if ('dataPoints' in data && 'trend' in data) {
      const trendData = data as TrendAnalysis;
      
      const datasets = [
        {
          label: `${trendData.siteName} - ${trendData.metric}`,
          data: trendData.dataPoints.map(point => ({
            x: point.date,
            y: point.value
          })),
          borderColor: getTrendColor(trendData.trend),
          backgroundColor: getTrendColor(trendData.trend, 0.1),
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        }
      ];
      
      // Add forecast data if available and enabled
      if (showForecast && trendData.forecast && trendData.forecast.length > 0) {
        datasets.push({
          label: 'Forecast',
          data: trendData.forecast.map(point => ({
            x: point.date,
            y: point.value
          })),
          borderColor: getTrendColor(trendData.trend, 0.5),
          backgroundColor: getTrendColor(trendData.trend, 0.05),
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1
        });
      }
      
      return { datasets };
    }
    
    // Handle comparative trend analysis
    if ('sites' in data && 'overallTrend' in data) {
      const comparativeData = data as ComparativeTrendAnalysis;
      
      const datasets = comparativeData.sites.map((site, index) => ({
        label: site.siteName,
        data: site.trend.dataPoints.map(point => ({
          x: point.date,
          y: point.value
        })),
        borderColor: getColorByIndex(index),
        backgroundColor: getColorByIndex(index, 0.1),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.1
      }));
      
      return { datasets };
    }
    
    // Handle threat evolution
    if ('timeline' in data && 'evolution' in data) {
      const evolutionData = data as ThreatEvolution;
      
      const datasets = [
        {
          label: `${evolutionData.threatType} - ${evolutionData.siteName}`,
          data: evolutionData.timeline.map(entry => ({
            x: entry.date,
            y: entry.magnitude
          })),
          borderColor: getEvolutionColor(evolutionData.evolution),
          backgroundColor: getEvolutionColor(evolutionData.evolution, 0.1),
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        }
      ];
      
      return { datasets };
    }
    
    return { datasets: [] };
  }, [data, showForecast]);
  
  /**
   * Chart.js options configuration
   */
  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy',
            quarter: 'MMM yyyy',
            year: 'yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        max: 15, // ABC scale maximum
        title: {
          display: true,
          text: 'Risk Magnitude'
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }), [title]);
  
  /**
   * Render trend statistics
   */
  const renderTrendStats = () => {
    if ('trend' in data && 'trendStrength' in data) {
      const trendData = data as TrendAnalysis;
      
      return (
        <div className={styles.trendStats}>
          <div className={styles.stat}>
            <span className={styles.label}>Trend:</span>
            <span className={`${styles.value} ${styles[`trend-${trendData.trend}`]}`}>
              {trendData.trend}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Strength:</span>
            <span className={styles.value}>
              {Math.abs(trendData.trendStrength * 100).toFixed(1)}%
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Average:</span>
            <span className={styles.value}>{trendData.averageValue}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Change Rate:</span>
            <span className={`${styles.value} ${trendData.changeRate >= 0 ? styles.positive : styles.negative}`}>
              {trendData.changeRate >= 0 ? '+' : ''}{trendData.changeRate.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    
    if ('overallTrend' in data) {
      const comparativeData = data as ComparativeTrendAnalysis;
      
      return (
        <div className={styles.trendStats}>
          <div className={styles.stat}>
            <span className={styles.label}>Overall Trend:</span>
            <span className={`${styles.value} ${styles[`trend-${comparativeData.overallTrend}`]}`}>
              {comparativeData.overallTrend}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Sites Analyzed:</span>
            <span className={styles.value}>{comparativeData.sites.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Time Range:</span>
            <span className={styles.value}>
              {comparativeData.timeRange.start.toLocaleDateString()} - {comparativeData.timeRange.end.toLocaleDateString()}
            </span>
          </div>
        </div>
      );
    }
    
    if ('evolution' in data) {
      const evolutionData = data as ThreatEvolution;
      
      return (
        <div className={styles.trendStats}>
          <div className={styles.stat}>
            <span className={styles.label}>Evolution:</span>
            <span className={`${styles.value} ${styles[`evolution-${evolutionData.evolution}`]}`}>
              {evolutionData.evolution}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Assessments:</span>
            <span className={styles.value}>{evolutionData.timeline.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Critical Periods:</span>
            <span className={styles.value}>{evolutionData.criticalPeriods.length}</span>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={styles.trendChart}>
      {renderTrendStats()}
      <div className={styles.chartContainer} style={{ height: `${height}px` }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

/**
 * Get color based on trend direction
 */
function getTrendColor(trend: 'increasing' | 'decreasing' | 'stable', alpha: number = 1): string {
  const colors = {
    increasing: `rgba(220, 53, 69, ${alpha})`, // Red for increasing risk
    decreasing: `rgba(40, 167, 69, ${alpha})`, // Green for decreasing risk
    stable: `rgba(0, 123, 255, ${alpha})` // Blue for stable risk
  };
  return colors[trend];
}

/**
 * Get color based on evolution type
 */
function getEvolutionColor(evolution: 'escalating' | 'stable' | 'improving', alpha: number = 1): string {
  const colors = {
    escalating: `rgba(220, 53, 69, ${alpha})`, // Red for escalating
    stable: `rgba(255, 193, 7, ${alpha})`, // Yellow for stable
    improving: `rgba(40, 167, 69, ${alpha})` // Green for improving
  };
  return colors[evolution];
}

/**
 * Get color by index for multiple series
 */
function getColorByIndex(index: number, alpha: number = 1): string {
  const colors = [
    `rgba(0, 123, 255, ${alpha})`, // Blue
    `rgba(220, 53, 69, ${alpha})`, // Red
    `rgba(40, 167, 69, ${alpha})`, // Green
    `rgba(255, 193, 7, ${alpha})`, // Yellow
    `rgba(111, 66, 193, ${alpha})`, // Purple
    `rgba(255, 87, 34, ${alpha})`, // Orange
    `rgba(0, 188, 212, ${alpha})`, // Cyan
    `rgba(76, 175, 80, ${alpha})` // Light Green
  ];
  return colors[index % colors.length];
}