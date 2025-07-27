// Tests for TrendDashboard component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrendDashboard } from './TrendDashboard';
import { MockDataService } from '../../services/MockDataService';
import { TrendAnalysisService } from '../../services/TrendAnalysisService';

// Mock the services
jest.mock('../../services/MockDataService');
jest.mock('../../services/TrendAnalysisService');

const mockMockDataService = MockDataService as jest.Mocked<typeof MockDataService>;
const mockTrendAnalysisService = TrendAnalysisService as jest.Mocked<typeof TrendAnalysisService>;

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="trend-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )
}));

// Mock data
const mockSites = [
  {
    id: 'site-001',
    name: 'Test Heritage Site 1',
    location: {
      latitude: 32.0833,
      longitude: 36.3167,
      address: 'Test Address 1',
      country: 'Jordan'
    },
    description: 'Test description 1',
    significance: 'Test significance 1',
    currentStatus: 'active' as const,
    lastAssessment: new Date('2024-01-15'),
    riskProfile: {
      overallRisk: 'high' as const,
      lastUpdated: new Date('2024-01-15'),
      activeThreats: ['weathering' as const]
    },
    images: [],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'site-002',
    name: 'Test Heritage Site 2',
    location: {
      latitude: 30.3285,
      longitude: 35.4444,
      address: 'Test Address 2',
      country: 'Jordan'
    },
    description: 'Test description 2',
    significance: 'Test significance 2',
    currentStatus: 'at-risk' as const,
    lastAssessment: new Date('2024-02-01'),
    riskProfile: {
      overallRisk: 'very-high' as const,
      lastUpdated: new Date('2024-02-01'),
      activeThreats: ['tourism-pressure' as const]
    },
    images: [],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-02-01')
  }
];

const mockAssessments = [
  {
    id: 'risk-001',
    siteId: 'site-001',
    threatType: 'weathering' as const,
    probability: 4,
    lossOfValue: 3,
    fractionAffected: 2,
    magnitude: 9,
    priority: 'high' as const,
    uncertaintyLevel: 'low' as const,
    assessmentDate: new Date('2024-01-15'),
    assessor: 'Test Assessor',
    notes: 'Test notes'
  }
];

const mockTrendAnalysis = {
  metric: 'Average Risk Magnitude',
  siteId: 'site-001',
  siteName: 'Test Heritage Site 1',
  dataPoints: [
    {
      date: new Date('2024-01-01'),
      value: 8,
      siteId: 'site-001',
      siteName: 'Test Heritage Site 1'
    },
    {
      date: new Date('2024-02-01'),
      value: 9,
      siteId: 'site-001',
      siteName: 'Test Heritage Site 1'
    }
  ],
  trend: 'increasing' as const,
  trendStrength: 0.5,
  averageValue: 8.5,
  changeRate: 12.5,
  forecast: [
    {
      date: new Date('2024-03-01'),
      value: 10,
      siteId: 'site-001',
      siteName: 'Test Heritage Site 1'
    }
  ]
};

const mockComparativeAnalysis = {
  metric: 'Average Risk Magnitude',
  timeRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-02-01')
  },
  sites: [
    {
      siteId: 'site-001',
      siteName: 'Test Heritage Site 1',
      trend: mockTrendAnalysis
    }
  ],
  overallTrend: 'deteriorating' as const,
  correlations: [
    {
      siteA: 'Test Heritage Site 1',
      siteB: 'Test Heritage Site 2',
      correlation: 0.75
    }
  ]
};

const mockThreatEvolution = {
  threatType: 'weathering' as const,
  siteId: 'site-001',
  siteName: 'Test Heritage Site 1',
  timeline: [
    {
      date: new Date('2024-01-01'),
      magnitude: 8,
      priority: 'high' as const,
      assessor: 'Test Assessor',
      notes: 'Test notes'
    }
  ],
  evolution: 'escalating' as const,
  criticalPeriods: []
};

describe('TrendDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMockDataService.getHeritageSites.mockResolvedValue(mockSites);
    mockMockDataService.getRiskAssessments.mockResolvedValue(mockAssessments);
    mockTrendAnalysisService.generateMockHistoricalData.mockReturnValue(mockAssessments);
    mockTrendAnalysisService.generateRiskTimeSeries.mockReturnValue(mockTrendAnalysis.dataPoints);
    mockTrendAnalysisService.analyzeTrend.mockReturnValue(mockTrendAnalysis);
    mockTrendAnalysisService.performComparativeAnalysis.mockReturnValue(mockComparativeAnalysis);
    mockTrendAnalysisService.analyzeThreatEvolution.mockReturnValue(mockThreatEvolution);
  });

  it('renders trend dashboard interface', async () => {
    render(<TrendDashboard />);
    
    expect(screen.getByText('Heritage Risk Trend Analysis')).toBeInTheDocument();
    expect(screen.getByText('Temporal analysis and forecasting for heritage site risk management')).toBeInTheDocument();
    
    // Check view tabs
    expect(screen.getByText('Site Trends')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis')).toBeInTheDocument();
    expect(screen.getByText('Threat Evolution')).toBeInTheDocument();
    expect(screen.getByText('Correlations')).toBeInTheDocument();
  });

  it('loads data on mount', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(mockMockDataService.getHeritageSites).toHaveBeenCalled();
    });
  });

  it('shows loading state initially', () => {
    render(<TrendDashboard />);
    
    expect(screen.getByText('Loading trend analysis data...')).toBeInTheDocument();
  });

  it('switches between view tabs', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    // Default view should be site trends
    expect(screen.getByText('Site Trends')).toHaveClass('active');
    
    // Switch to comparative analysis
    fireEvent.click(screen.getByText('Comparative Analysis'));
    expect(screen.getByText('Comparative Analysis')).toHaveClass('active');
    
    // Switch to threat evolution
    fireEvent.click(screen.getByText('Threat Evolution'));
    expect(screen.getByText('Threat Evolution')).toHaveClass('active');
  });

  it('shows site selection for site trends view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Site:')).toBeInTheDocument();
    });
  });

  it('shows threat type selection for threat evolution view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    // Switch to threat evolution view
    fireEvent.click(screen.getByText('Threat Evolution'));
    
    expect(screen.getByLabelText('Threat Type:')).toBeInTheDocument();
  });

  it('renders trend chart in site trends view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });
  });

  it('displays trend insights', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Key Insights')).toBeInTheDocument();
    });
  });

  it('handles site selection change', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Site:')).toBeInTheDocument();
    });
    
    const siteSelect = screen.getByLabelText('Site:');
    fireEvent.change(siteSelect, { target: { value: 'site-002' } });
    
    expect(siteSelect).toHaveValue('site-002');
  });

  it('shows comparative analysis view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Comparative Analysis'));
    
    await waitFor(() => {
      expect(screen.getByText('Comparative Risk Trend Analysis')).toBeInTheDocument();
    });
  });

  it('shows correlations in comparative view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Comparative Analysis'));
    
    await waitFor(() => {
      expect(screen.getByText('Site Correlations')).toBeInTheDocument();
    });
  });

  it('shows threat evolution view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Threat Evolution'));
    
    await waitFor(() => {
      expect(screen.getByText('Evolution Insights')).toBeInTheDocument();
    });
  });

  it('shows correlations view', async () => {
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading trend analysis data...')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Correlations'));
    
    await waitFor(() => {
      expect(screen.getByText('Site Risk Correlations')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockMockDataService.getHeritageSites.mockRejectedValue(new Error('Test error'));
    
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  it('shows no data message when insufficient data', async () => {
    mockTrendAnalysisService.analyzeTrend.mockImplementation(() => {
      throw new Error('Insufficient data');
    });
    
    render(<TrendDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No trend data available for the selected site.')).toBeInTheDocument();
    });
  });
});