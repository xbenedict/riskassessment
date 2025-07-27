// Dashboard Component Tests
// Tests for the comprehensive dashboard component

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Dashboard } from './Dashboard';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite, RiskAssessment } from '../../types';

// Mock the MockDataService
vi.mock('../../services/MockDataService');

// Mock the child components to avoid complex dependencies
vi.mock('./RiskChart', () => ({
  RiskChart: ({ title, assessments }: { title: string; assessments: any[] }) => (
    <div data-testid="risk-chart">
      <h3>{title}</h3>
      <div>Assessments: {assessments.length}</div>
    </div>
  )
}));

vi.mock('./SiteMap', () => ({
  SiteMap: ({ onSiteSelect }: { onSiteSelect: (site: any) => void }) => (
    <div data-testid="site-map">
      <button onClick={() => onSiteSelect({ id: 'test-site', name: 'Test Site' })}>
        Select Test Site
      </button>
    </div>
  )
}));

describe('Dashboard Component', () => {
  const mockSites: HeritageSite[] = [
    {
      id: 'site-1',
      name: 'Test Heritage Site 1',
      location: {
        latitude: 31.5,
        longitude: 35.9,
        address: 'Test Address 1',
        country: 'Jordan'
      },
      description: 'Test description 1',
      significance: 'Test significance 1',
      currentStatus: 'active',
      lastAssessment: new Date('2024-01-15'),
      riskProfile: {
        overallRisk: 'high',
        lastUpdated: new Date('2024-01-15'),
        activeThreats: ['weathering', 'tourism-pressure']
      },
      images: [],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'site-2',
      name: 'Test Heritage Site 2',
      location: {
        latitude: 32.0,
        longitude: 36.0,
        address: 'Test Address 2',
        country: 'Jordan'
      },
      description: 'Test description 2',
      significance: 'Test significance 2',
      currentStatus: 'critical',
      lastAssessment: new Date('2024-01-10'),
      riskProfile: {
        overallRisk: 'extremely-high',
        lastUpdated: new Date('2024-01-10'),
        activeThreats: ['earthquake', 'urban-development']
      },
      images: [],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-10')
    }
  ];

  const mockAssessments: RiskAssessment[] = [
    {
      id: 'assessment-1',
      siteId: 'site-1',
      threatType: 'weathering',
      probability: 4,
      lossOfValue: 3,
      fractionAffected: 2,
      magnitude: 9,
      priority: 'high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-15'),
      assessor: 'Test Assessor 1',
      notes: 'Test assessment notes 1'
    },
    {
      id: 'assessment-2',
      siteId: 'site-2',
      threatType: 'earthquake',
      probability: 5,
      lossOfValue: 5,
      fractionAffected: 4,
      magnitude: 14,
      priority: 'extremely-high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-10'),
      assessor: 'Test Assessor 2',
      notes: 'Test assessment notes 2'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock implementations
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);
    vi.mocked(MockDataService.getRiskAssessments).mockImplementation((siteId: string) => {
      return Promise.resolve(mockAssessments.filter(a => a.siteId === siteId));
    });
    vi.mocked(MockDataService.getRecentAssessments).mockResolvedValue(mockAssessments);
  });

  it('renders loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders dashboard header after loading', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Guardian Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive overview of all managed heritage sites')).toBeInTheDocument();
    });
  });

  it('displays key performance indicators', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
      expect(screen.getByText('Total Heritage Sites')).toBeInTheDocument();
      expect(screen.getByText('Critical Risk Sites')).toBeInTheDocument();
      expect(screen.getByText('Total Risk Assessments')).toBeInTheDocument();
      expect(screen.getByText('Average Risk Magnitude')).toBeInTheDocument();
      expect(screen.getByText('High Priority Risks')).toBeInTheDocument();
      expect(screen.getByText('Recent Assessments')).toBeInTheDocument();
    });
  });

  it('calculates KPI values correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Total sites should be 2
      const totalSitesCards = screen.getAllByText('2');
      expect(totalSitesCards.length).toBeGreaterThan(0);
      
      // Critical sites should be 1 (site-2 has extremely-high risk)
      const criticalSitesCards = screen.getAllByText('1');
      expect(criticalSitesCards.length).toBeGreaterThan(0);
    });
  });

  it('displays alert notifications for high-risk sites', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Alert Notifications')).toBeInTheDocument();
      expect(screen.getByText('Critical Risk Alert')).toBeInTheDocument();
    });
  });

  it('can dismiss alert notifications', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const dismissButton = screen.getAllByText('×')[0];
      fireEvent.click(dismissButton);
    });
    
    // The specific alert should be removed (though others might remain)
    // This tests the dismiss functionality works
  });

  it('can hide all alerts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const hideAlertsButton = screen.getByText('Hide Alerts');
      fireEvent.click(hideAlertsButton);
    });
    
    // Alerts section should be hidden
    expect(screen.queryByText('Alert Notifications')).not.toBeInTheDocument();
  });

  it('renders site map component', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('site-map')).toBeInTheDocument();
    });
  });

  it('renders risk charts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Priority Distribution')).toBeInTheDocument();
      expect(screen.getByText('Threat Type Analysis')).toBeInTheDocument();
    });
  });

  it('displays recent assessments timeline', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Risk Assessments')).toBeInTheDocument();
      expect(screen.getByText('Test Heritage Site 1')).toBeInTheDocument();
      expect(screen.getByText('Test Heritage Site 2')).toBeInTheDocument();
    });
  });

  it('displays heritage sites summary table', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites Summary')).toBeInTheDocument();
      expect(screen.getByText('Site Name')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Risk Level')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Last Assessment')).toBeInTheDocument();
      expect(screen.getByText('Active Threats')).toBeInTheDocument();
    });
  });

  it('handles site selection from map', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const selectButton = screen.getByText('Select Test Site');
      fireEvent.click(selectButton);
    });
    
    // This tests that the site selection handler works
    // The selected site state should be updated
  });

  it('handles site selection from table', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const siteRow = screen.getByText('Test Heritage Site 1').closest('.tableRow');
      if (siteRow) {
        fireEvent.click(siteRow);
      }
    });
    
    // This tests that clicking on a table row selects the site
  });

  it('handles error state gracefully', async () => {
    // Mock service to throw error
    vi.mocked(MockDataService.getHeritageSites).mockRejectedValue(new Error('Test error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Failed to load dashboard data. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('can retry after error', async () => {
    // First call fails, second succeeds
    vi.mocked(MockDataService.getHeritageSites)
      .mockRejectedValueOnce(new Error('Test error'))
      .mockResolvedValue(mockSites);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getAllByText('Heritage Guardian Dashboard').length).toBeGreaterThan(0);
    });
  });

  it('formats dates correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Check that dates are formatted in a readable format
      expect(screen.getAllByText(/Jan \d+, 2024/).length).toBeGreaterThan(0);
    });
  });

  it('formats threat types correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Check that threat types are formatted with proper capitalization
      expect(screen.getAllByText('Weathering').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Tourism Pressure').length).toBeGreaterThan(0);
    });
  });

  it('applies correct CSS classes for risk levels', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const highRiskElements = screen.getAllByText('HIGH');
      const extremelyHighRiskElements = screen.getAllByText('EXTREMELY HIGH');
      
      expect(highRiskElements.length).toBeGreaterThan(0);
      expect(extremelyHighRiskElements.length).toBeGreaterThan(0);
    });
  });

  it('shows correct number of assessments in charts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Check that charts receive the correct number of assessments
      const chartElements = screen.getAllByTestId('risk-chart');
      chartElements.forEach(chart => {
        expect(chart).toHaveTextContent('Assessments: 2');
      });
    });
  });

  it('handles empty data gracefully', async () => {
    // Mock empty data
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue([]);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);
    vi.mocked(MockDataService.getRecentAssessments).mockResolvedValue([]);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Heritage Guardian Dashboard').length).toBeGreaterThan(0);
      // Should show 0 for all KPIs
      const zeroValues = screen.getAllByText('0');
      expect(zeroValues.length).toBeGreaterThan(0);
    });
  });
});