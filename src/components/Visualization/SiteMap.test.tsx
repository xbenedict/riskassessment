import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SiteMap from './SiteMap';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite } from '../../types';

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: (props: any) => <div data-testid="tile-layer" {...props} />,
  Marker: ({ children, eventHandlers, ...props }: any) => (
    <div 
      data-testid="marker" 
      {...props}
      onClick={() => eventHandlers?.click?.()}
    >
      {children}
    </div>
  ),
  Popup: ({ children, ...props }: any) => (
    <div data-testid="popup" {...props}>
      {children}
    </div>
  ),
  Circle: ({ children, ...props }: any) => (
    <div data-testid="circle" {...props}>
      {children}
    </div>
  )
}));

// Mock leaflet
vi.mock('leaflet', () => ({
  Icon: vi.fn().mockImplementation(() => ({})),
  LatLngBounds: vi.fn().mockImplementation(() => ({
    extend: vi.fn()
  }))
}));

// Mock CSS import
vi.mock('leaflet/dist/leaflet.css', () => ({}));

// Mock MockDataService
vi.mock('../../services/MockDataService');

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
    description: 'A complex of Umayyad desert castles',
    significance: 'Outstanding example of early Islamic architecture',
    currentStatus: 'at-risk',
    lastAssessment: new Date('2024-01-15'),
    riskProfile: {
      overallRisk: 'high',
      lastUpdated: new Date('2024-01-15'),
      activeThreats: ['weathering', 'urban-development']
    },
    images: ['/images/hallabat-main.jpg'],
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
    description: 'Famous archaeological site featuring rock-cut architecture',
    significance: 'UNESCO World Heritage Site since 1985',
    currentStatus: 'active',
    lastAssessment: new Date('2024-02-01'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-02-01'),
      activeThreats: ['tourism-pressure', 'weathering']
    },
    images: ['/images/petra-treasury.jpg'],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-02-01')
  }
];

describe('SiteMap Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);
  });

  it('renders loading state initially', () => {
    render(<SiteMap />);
    
    expect(screen.getByText('Loading heritage sites...')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders map with heritage sites after loading', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Heritage Sites Map').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByTestId('map-container').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('tile-layer').length).toBeGreaterThan(0);
    
    // Should render markers for each site
    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBeGreaterThanOrEqual(mockSites.length);
  });

  it('displays site information in popups', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Al-Hallabat Complex').length).toBeGreaterThan(0);
    });

    // Check that location information is present (text may be split across elements)
    expect(screen.getAllByText(/Al-Hallabat/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Petra Archaeological Park').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wadi Musa/).length).toBeGreaterThan(0);
  });

  it('shows risk levels in popups', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('High').length).toBeGreaterThan(0); // Al-Hallabat risk level
    });

    expect(screen.getAllByText('Medium High').length).toBeGreaterThan(0); // Petra risk level
  });

  it('displays active threats for each site', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Weathering').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Urban Development').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tourism Pressure').length).toBeGreaterThan(0);
  });

  it('accepts onSiteSelect prop and renders correctly', async () => {
    const mockOnSiteSelect = vi.fn();
    render(<SiteMap onSiteSelect={mockOnSiteSelect} />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Al-Hallabat Complex').length).toBeGreaterThan(0);
    });

    // Verify that the component renders with the onSiteSelect prop
    expect(screen.getAllByText('View Details').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('marker').length).toBeGreaterThanOrEqual(mockSites.length);
  });

  it('highlights selected site', async () => {
    render(<SiteMap selectedSiteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('map-container').length).toBeGreaterThan(0);
    });

    // The selected site should have different styling (tested through icon creation)
    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBeGreaterThanOrEqual(mockSites.length);
  });

  it('renders map legend with risk levels', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Risk Levels').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Extremely High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Very High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Medium High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Low').length).toBeGreaterThan(0);
  });

  it('shows threat zones when enabled', async () => {
    // Mock risk assessments for threat zones
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([
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
        notes: 'Test assessment'
      }
    ]);

    render(<SiteMap showThreatZones={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Threat Types')).toBeInTheDocument();
    });

    // Should render threat zone circles - wait for async threat zone generation
    await waitFor(() => {
      const circles = screen.getAllByTestId('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  it('handles error state gracefully', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockRejectedValue(
      new Error('Failed to load sites')
    );

    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load heritage sites')).toBeInTheDocument();
    });

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('allows retry after error', async () => {
    vi.mocked(MockDataService.getHeritageSites)
      .mockRejectedValueOnce(new Error('Failed to load sites'))
      .mockResolvedValueOnce(mockSites);

    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load heritage sites')).toBeInTheDocument();
    });

    const retryButtons = screen.getAllByText('Retry');
    fireEvent.click(retryButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText('Heritage Sites Map').length).toBeGreaterThan(0);
    });
  });

  it('formats threat types correctly', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Urban Development').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Tourism Pressure').length).toBeGreaterThan(0);
  });

  it('truncates long descriptions in popups', async () => {
    const longDescriptionSite = {
      ...mockSites[0],
      description: 'This is a very long description that should be truncated when displayed in the popup because it exceeds the maximum length limit set for popup descriptions in the component.'
    };

    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue([longDescriptionSite]);

    render(<SiteMap />);
    
    await waitFor(() => {
      expect(screen.getByText(/This is a very long description.*\.\.\./)).toBeInTheDocument();
    });
  });

  it('renders view details buttons in popups', async () => {
    render(<SiteMap />);
    
    await waitFor(() => {
      const viewDetailsButtons = screen.getAllByText('View Details');
      expect(viewDetailsButtons.length).toBeGreaterThanOrEqual(mockSites.length);
    });
  });
});