// Temporal Analysis Component Tests
// Tests for time-series analysis, comparative trends, and forecasting functionality

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TemporalAnalysis } from './TemporalAnalysis';
import { MockDataService } from '../../services/MockDataService';
import { TrendAnalysisService } from '../../services/TrendAnalysisService';
import type { HeritageSite, RiskAssessment } from '../../types';

// Mock the services
vi.mock('../../services/MockDataService');
vi.mock('../../services/TrendAnalysisService');

// Mock Chart.js to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="trend-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )
}));

const mockSites: HeritageSite[] = [
  {
    id: 'site-001',
    name: 'Al-Hallabat Complex',
    location: {
      latitude: 32.0833,
      longitude: 36.3167,
      address: 'Al-Hallabat, Zarqa Governorate',
      country: 'Jordan'
    },
    description: 'Umayyad desert castle complex',
    significance: 'Outstanding example of early Islamic architecture',
    currentStatus: 'at-risk',
    lastAssessment: new Date('2024-01-15'),
    riskProfile: {
      overallRisk: 'high',
      lastUpdated: new Date('2024-01-15'),
      activeThreats: ['weathering', 'urban-development']
    },
    images: [],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'site-002',
    name: 'Petra Archaeological Park',
    location: {
      latitude: 30.3285,
      longitude: 35.4444,
      address: 'Wadi Musa, Ma\'an Governorate',
      country: 'Jordan'
    },
    description: 'Famous archaeological site with rock-cut architecture',
    significance: 'UNESCO World Heritage Site since 1985',
    currentStatus: 'active',
    lastAssessment: new Date('2024-02-01'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-02-01'),
      activeThreats: ['tourism-pressure', 'weathering']
    },
    images: [],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-02-01')
  }
];

const mockAssessments: RiskAssessment[] = [
  {
    id: 'risk-001',
    siteId: 'site-001',
    threatType: 'weathering',
    probability: 4,
    lossOfValue: 3,
    fractionAffected: 2,
    magnitude: 9,
    priority: 'high',
    uncertaintyLevel: 'low',
    assessmentDate: new Date('2024-01-15'),
    assessor: 'Dr. Sarah Al-Rashid',
    notes: 'Ongoing erosion of limestone blocks'
  },
  {
    id: 'risk-002',
    siteId: 'site-002',
    threatType: 'tourism-pressure',
    probability: 5,
    lossOfValue: 3,
    fractionAffected: 4,
    magnitude: 12,
    priority: 'very-high',
    uncertaintyLevel: 'low',
    assessmentDate: new Date('2024-02-01'),
    assessor: 'Dr. Fadi Balaawi',
    notes: 'Over 1 million visitors annually'
  }
];

const mockTrendAnalysis = {
  metric: 'Average Risk Magnitude',
  siteId: 'site-001',
  siteName: 'Al-Hallabat Complex',
  dataPoints: [
    {
      date: new Date('2023-12-01'),
      value: 8,
      siteId: 'site-001',
      siteName: 'Al-Hallabat Complex'
    },
    {
      date: new Date('2024-01-01'),
      value: 9,
      siteId: 'site-001',
      siteName: 'Al-Hallabat Complex'
    }
  ],
  trend: 'increasing' as const,
  trendStrength: 0.5,
  averageValue: 8.5,
  changeRate: 12.5,
  forecast: [
    {
      date: new Date('2024-02-01'),
      value: 10,
      siteId: 'site-001',
      siteName: 'Al-Hallabat Complex'
    }
  ]
};

const mockComparativeTrend = {
  metric: 'Average Risk Magnitude',
  timeRange: {
    start: new Date('2023-12-01'),
    end: new Date('2024-01-01')
  },
  sites: [
    {
      siteId: 'site-001',
      siteName: 'Al-Hallabat Complex',
      trend: mockTrendAnalysis
    }
  ],
  overallTrend: 'deteriorating' as const,
  correlations: [
    {
      siteA: 'Al-Hallabat Complex',
      siteB: 'Petra Archaeological Park',
      correlation: 0.75
    }
  ]
};

const mockThreatEvolution = {
  threatType: 'weathering' as const,
  siteId: 'site-001',
  siteName: 'Al-Hallabat Complex',
  timeline: [
    {
      date: new Date('2023-12-01'),
      magnitude: 8,
      priority: 'high' as const,
      assessor: 'Dr. Sarah Al-Rashid',
      notes: 'Initial assessment'
    },
    {
      date: new Date('2024-01-01'),
      magnitude: 9,
      priority: 'high' as const,
      assessor: 'Dr. Sarah Al-Rashid',
      notes: 'Follow-up assessment'
    }
  ],
  evolution: 'escalating' as const,
  criticalPeriods: [
    {
      start: new Date('2023-12-01'),
      end: new Date('2024-01-01'),
      reason: 'High risk period for weathering',
      peakMagnitude: 9
    }
  ]
};

describe('TemporalAnalysis Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock MockDataService methods
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue(mockAssessments);
    
    // Mock TrendAnalysisService methods
    vi.mocked(TrendAnalysisService.generateRiskTimeSeries).mockReturnValue([
      {
        date: new Date('2023-12-01'),
        value: 8,
        siteId: 'site-001',
        siteName: 'Al-Hallabat Complex'
      },
      {
        date: new Date('2024-01-01'),
        value: 9,
        siteId: 'site-001',
        siteName: 'Al-Hallabat Complex'
      }
    ]);
    
    vi.mocked(TrendAnalysisService.analyzeTrend).mockReturnValue(mockTrendAnalysis);
    vi.mocked(TrendAnalysisService.performComparativeAnalysis).mockReturnValue(mockComparativeTrend);
    vi.mocked(TrendAnalysisService.analyzeThreatEvolution).mockReturnValue(mockThreatEvolution);
    vi.mocked(TrendAnalysisService.generateMockHistoricalData).mockReturnValue([]);
  });

  it('renders loading state initially', () => {
    render(<TemporalAnalysis />);
    
    expect(screen.getByText('Loading temporal analysis data...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders temporal analysis interface after loading', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByText('Temporal Risk Analysis')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Analyze risk trends over time, compare sites, and track threat evolution')).toBeInTheDocument();
    expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Heritage Site:')).toBeInTheDocument();
    expect(screen.getByLabelText('Time Range:')).toBeInTheDocument();
  });

  it('displays single site trend analysis by default', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });
    
    // Check that the trend analysis was called
    expect(TrendAnalysisService.analyzeTrend).toHaveBeenCalledWith(
      expect.any(Array),
      'Average Risk Magnitude'
    );
  });

  it('switches to comparative analysis mode', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    });
    
    const analysisTypeSelect = screen.getByLabelText('Analysis Type:');
    fireEvent.change(analysisTypeSelect, { target: { value: 'comparative' } });
    
    await waitFor(() => {
      expect(screen.getByText('Sites to Compare:')).toBeInTheDocument();
    });
    
    // Check for site checkboxes
    expect(screen.getByLabelText('Al-Hallabat Complex')).toBeInTheDocument();
    expect(screen.getByLabelText('Petra Archaeological Park')).toBeInTheDocument();
  });

  it('switches to threat evolution analysis mode', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    });
    
    const analysisTypeSelect = screen.getByLabelText('Analysis Type:');
    fireEvent.change(analysisTypeSelect, { target: { value: 'threat-evolution' } });
    
    await waitFor(() => {
      expect(screen.getByText('Threat Type:')).toBeInTheDocument();
    });
    
    // Check for threat type options
    const threatSelect = screen.getByLabelText('Threat Type:');
    expect(threatSelect).toBeInTheDocument();
    
    // Verify some threat options are available
    fireEvent.click(threatSelect);
    expect(screen.getByText('Weathering')).toBeInTheDocument();
    expect(screen.getByText('Tourism Pressure')).toBeInTheDocument();
  });

  it('displays correlation matrix in comparative mode', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    });
    
    // Switch to comparative mode
    const analysisTypeSelect = screen.getByLabelText('Analysis Type:');
    fireEvent.change(analysisTypeSelect, { target: { value: 'comparative' } });
    
    await waitFor(() => {
      expect(screen.getByText('Site Correlations')).toBeInTheDocument();
    });
    
    // Check for correlation data
    expect(screen.getByText('Al-Hallabat Complex ↔ Petra Archaeological Park')).toBeInTheDocument();
    expect(screen.getByText('0.75')).toBeInTheDocument();
  });

  it('displays critical periods in threat evolution mode', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    });
    
    // Switch to threat evolution mode
    const analysisTypeSelect = screen.getByLabelText('Analysis Type:');
    fireEvent.change(analysisTypeSelect, { target: { value: 'threat-evolution' } });
    
    await waitFor(() => {
      expect(screen.getByText('Critical Periods')).toBeInTheDocument();
    });
    
    // Check for critical period data
    expect(screen.getByText('High risk period for weathering')).toBeInTheDocument();
    expect(screen.getByText('Peak Magnitude:')).toBeInTheDocument();
  });

  it('handles site selection changes', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Heritage Site:')).toBeInTheDocument();
    });
    
    const siteSelect = screen.getByLabelText('Heritage Site:');
    fireEvent.change(siteSelect, { target: { value: 'site-002' } });
    
    // Verify the selection changed
    expect(siteSelect).toHaveValue('site-002');
  });

  it('handles time range changes', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Time Range:')).toBeInTheDocument();
    });
    
    const timeRangeSelect = screen.getByLabelText('Time Range:');
    fireEvent.change(timeRangeSelect, { target: { value: '24' } });
    
    // Verify the selection changed
    expect(timeRangeSelect).toHaveValue('24');
  });

  it('displays error state when data loading fails', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockRejectedValue(new Error('Network error'));
    
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('displays no data message when insufficient data available', async () => {
    // Mock empty trend analysis
    vi.mocked(TrendAnalysisService.analyzeTrend).mockImplementation(() => {
      throw new Error('At least 2 data points required for trend analysis');
    });
    
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Not enough assessment data for trend analysis. At least 2 assessments are required.')).toBeInTheDocument();
  });

  it('handles comparative analysis with multiple site selection', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Analysis Type:')).toBeInTheDocument();
    });
    
    // Switch to comparative mode
    const analysisTypeSelect = screen.getByLabelText('Analysis Type:');
    fireEvent.change(analysisTypeSelect, { target: { value: 'comparative' } });
    
    await waitFor(() => {
      expect(screen.getByLabelText('Al-Hallabat Complex')).toBeInTheDocument();
    });
    
    // Select multiple sites
    const site1Checkbox = screen.getByLabelText('Al-Hallabat Complex');
    const site2Checkbox = screen.getByLabelText('Petra Archaeological Park');
    
    fireEvent.click(site1Checkbox);
    fireEvent.click(site2Checkbox);
    
    expect(site1Checkbox).toBeChecked();
    expect(site2Checkbox).toBeChecked();
  });

  it('calls TrendAnalysisService methods with correct parameters', async () => {
    render(<TemporalAnalysis />);
    
    await waitFor(() => {
      expect(TrendAnalysisService.generateRiskTimeSeries).toHaveBeenCalled();
    });
    
    expect(TrendAnalysisService.analyzeTrend).toHaveBeenCalledWith(
      expect.any(Array),
      'Average Risk Magnitude'
    );
  });
});