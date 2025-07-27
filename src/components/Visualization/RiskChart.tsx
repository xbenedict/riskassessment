// Interactive Risk Charts Component using Chart.js
// Provides bar charts for risk magnitude comparison and pie charts for risk category distribution

import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Bar, Pie, getElementAtEvent } from 'react-chartjs-2';
import type { RiskAssessment, ThreatType, RiskPriority } from '../../types';
import { RiskCalculator } from '../../utils/RiskCalculator';
import styles from './RiskChart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RiskChartProps {
  assessments: RiskAssessment[];
  chartType: 'magnitude' | 'category' | 'threat-comparison';
  title?: string;
  onChartClick?: (data: any) => void;
  showExport?: boolean;
  responsive?: boolean;
}

/**
 * Interactive Risk Chart Component
 * Supports multiple chart types for different risk visualization needs
 */
export const RiskChart: React.FC<RiskChartProps> = ({
  assessments,
  chartType,
  title,
  onChartClick,
  showExport = true,
  responsive = true
}) => {
  const chartRef = useRef<ChartJS>(null);

  // Color schemes for different risk priorities
  const riskColors = {
    'extremely-high': '#dc2626', // Red
    'very-high': '#ea580c',      // Orange-red
    'high': '#f59e0b',           // Orange
    'medium-high': '#eab308',    // Yellow
    'low': '#22c55e'             // Green
  };

  const threatColors = {
    'earthquake': '#8b5cf6',
    'flooding': '#3b82f6',
    'weathering': '#f59e0b',
    'vegetation': '#22c55e',
    'urban-development': '#ef4444',
    'tourism-pressure': '#f97316',
    'looting': '#dc2626',
    'conflict': '#991b1b',
    'climate-change': '#0ea5e9'
  };

  // Generate chart data based on chart type
  const chartData = useMemo(() => {
    switch (chartType) {
      case 'magnitude':
        return generateMagnitudeChart(assessments);
      case 'category':
        return generateCategoryChart(assessments);
      case 'threat-comparison':
        return generateThreatComparisonChart(assessments);
      default:
        return generateMagnitudeChart(assessments);
    }
  }, [assessments, chartType]);

  // Generate bar chart data for risk magnitude comparison
  function generateMagnitudeChart(assessments: RiskAssessment[]): ChartData<'bar'> {
    const sortedAssessments = [...assessments].sort((a, b) => b.magnitude - a.magnitude);
    
    return {
      labels: sortedAssessments.map(assessment => 
        `${assessment.threatType.replace('-', ' ').toUpperCase()}`
      ),
      datasets: [{
        label: 'Risk Magnitude',
        data: sortedAssessments.map(assessment => assessment.magnitude),
        backgroundColor: sortedAssessments.map(assessment => 
          riskColors[assessment.priority] + '80' // Add transparency
        ),
        borderColor: sortedAssessments.map(assessment => 
          riskColors[assessment.priority]
        ),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }]
    };
  }

  // Generate pie chart data for risk category distribution
  function generateCategoryChart(assessments: RiskAssessment[]): ChartData<'pie'> {
    const categoryCount: Record<RiskPriority, number> = {
      'extremely-high': 0,
      'very-high': 0,
      'high': 0,
      'medium-high': 0,
      'low': 0
    };

    assessments.forEach(assessment => {
      categoryCount[assessment.priority]++;
    });

    const categories = Object.keys(categoryCount) as RiskPriority[];
    const data = categories.map(category => categoryCount[category]);
    const colors = categories.map(category => riskColors[category]);

    return {
      labels: categories.map(category => 
        category.replace('-', ' ').toUpperCase()
      ),
      datasets: [{
        label: 'Risk Categories',
        data,
        backgroundColor: colors.map(color => color + '80'),
        borderColor: colors,
        borderWidth: 2,
      }]
    };
  }

  // Generate bar chart data for threat type comparison
  function generateThreatComparisonChart(assessments: RiskAssessment[]): ChartData<'bar'> {
    const threatData: Record<ThreatType, { count: number; avgMagnitude: number; maxMagnitude: number }> = {};

    assessments.forEach(assessment => {
      if (!threatData[assessment.threatType]) {
        threatData[assessment.threatType] = { count: 0, avgMagnitude: 0, maxMagnitude: 0 };
      }
      threatData[assessment.threatType].count++;
      threatData[assessment.threatType].avgMagnitude += assessment.magnitude;
      threatData[assessment.threatType].maxMagnitude = Math.max(
        threatData[assessment.threatType].maxMagnitude,
        assessment.magnitude
      );
    });

    // Calculate averages
    Object.keys(threatData).forEach(threat => {
      const data = threatData[threat as ThreatType];
      data.avgMagnitude = data.avgMagnitude / data.count;
    });

    const threats = Object.keys(threatData) as ThreatType[];
    const avgMagnitudes = threats.map(threat => threatData[threat].avgMagnitude);
    const maxMagnitudes = threats.map(threat => threatData[threat].maxMagnitude);

    return {
      labels: threats.map(threat => 
        threat.replace('-', ' ').toUpperCase()
      ),
      datasets: [
        {
          label: 'Average Magnitude',
          data: avgMagnitudes,
          backgroundColor: threats.map(threat => threatColors[threat] + '60'),
          borderColor: threats.map(threat => threatColors[threat]),
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Maximum Magnitude',
          data: maxMagnitudes,
          backgroundColor: threats.map(threat => threatColors[threat] + '40'),
          borderColor: threats.map(threat => threatColors[threat]),
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  }

  // Chart options for different chart types
  const getChartOptions = (): ChartOptions<'bar' | 'pie'> => {
    const baseOptions = {
      responsive,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!title,
          text: title,
          font: {
            size: 16,
            weight: 'bold' as const
          },
          padding: 20
        },
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            afterLabel: (context: any) => {
              if (chartType === 'magnitude') {
                const assessment = assessments[context.dataIndex];
                return [
                  `Priority: ${assessment.priority.replace('-', ' ').toUpperCase()}`,
                  `A: ${assessment.probability}, B: ${assessment.lossOfValue}, C: ${assessment.fractionAffected}`,
                  `Uncertainty: ${assessment.uncertaintyLevel}`
                ];
              }
              return [];
            }
          }
        }
      },
      onClick: (event: any, elements: any[]) => {
        if (elements.length > 0 && onChartClick) {
          const elementIndex = elements[0].index;
          onChartClick({
            index: elementIndex,
            assessment: assessments[elementIndex],
            chartType
          });
        }
      }
    };

    if (chartType === 'pie') {
      return baseOptions;
    }

    // Bar chart specific options
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          max: 15,
          ticks: {
            stepSize: 1,
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: chartType === 'threat-comparison' ? 'Risk Magnitude' : 'Magnitude (A + B + C)',
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            font: {
              size: 11
            }
          },
          grid: {
            display: false
          }
        }
      }
    } as ChartOptions<'bar'>;
  };

  // Export chart as image
  const exportChart = (format: 'png' | 'jpeg' = 'png') => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image(format, 1.0);
      const link = document.createElement('a');
      link.download = `risk-chart-${chartType}-${Date.now()}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle chart click events
  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (chartRef.current) {
      const elements = getElementAtEvent(chartRef.current, event);
      if (elements.length > 0 && onChartClick) {
        const elementIndex = elements[0].index;
        onChartClick({
          index: elementIndex,
          assessment: assessments[elementIndex],
          chartType
        });
      }
    }
  };

  if (assessments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No risk assessment data available for visualization.</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      {showExport && (
        <div className={styles.exportControls}>
          <button 
            onClick={() => exportChart('png')}
            className={styles.exportButton}
            title="Export as PNG"
          >
            📊 PNG
          </button>
          <button 
            onClick={() => exportChart('jpeg')}
            className={styles.exportButton}
            title="Export as JPEG"
          >
            📊 JPEG
          </button>
        </div>
      )}
      
      <div className={styles.chartWrapper}>
        {chartType === 'pie' ? (
          <Pie
            ref={chartRef}
            data={chartData as ChartData<'pie'>}
            options={getChartOptions() as ChartOptions<'pie'>}
            onClick={handleChartClick}
          />
        ) : (
          <Bar
            ref={chartRef}
            data={chartData as ChartData<'bar'>}
            options={getChartOptions() as ChartOptions<'bar'>}
            onClick={handleChartClick}
          />
        )}
      </div>
      
      {chartType === 'magnitude' && (
        <div className={styles.chartLegend}>
          <h4>Risk Priority Levels:</h4>
          <div className={styles.priorityLegend}>
            {Object.entries(riskColors).map(([priority, color]) => (
              <div key={priority} className={styles.priorityItem}>
                <div 
                  className={styles.colorBox} 
                  style={{ backgroundColor: color }}
                />
                <span>{priority.replace('-', ' ').toUpperCase()}</span>
                <small>({RiskCalculator.getPriorityDescription(priority as RiskPriority)})</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskChart;