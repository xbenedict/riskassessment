import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteList } from './SiteList';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite } from '../../types';

// Mock the MockDataService
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
    images: ['/test-image1.jpg'],
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
    images: ['/test-image2.jpg'],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'site-003',
    name: 'Test Site Egypt',
    location: {
      latitude: 25.7340,
      longitude: 32.6065,
      address: 'Luxor, Egypt',
      country: 'Egypt'
    },
    description: 'Test site in Egypt for filtering',
    significance: 'Test significance',
    currentStatus: 'critical',
    lastAssessment: new Date('2024-01-10'),
    riskProfile: {
      overallRisk: 'extremely-high',
      lastUpdated: new Date('2024-01-10'),
      activeThreats: ['looting', 'conflict']
    },
    images: [],
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-01-10')
  }
];

describe('SiteList', () => {
  const mockOnSiteSelect = vi.fn();
  const mockOnSiteEdit = vi.fn();
  const mockOnSiteAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state initially', () => {
    vi.mocked(MockDataService.getHeritageSites).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SiteList />);
    
    expect(screen.getByText('Loading heritage sites...')).toBeInTheDocument();
  });

  it('renders error state when loading fails', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockRejectedValue(new Error('Failed to load'));

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load heritage sites')).toBeInTheDocument();
    });
  });

  it('renders sites list when data is loaded', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    expect(screen.getByText('Al-Hallabat Complex')).toBeInTheDocument();
    expect(screen.getByText('Petra Archaeological Park')).toBeInTheDocument();
    expect(screen.getByText('Test Site Egypt')).toBeInTheDocument();
    expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
  });

  it('renders add button when onSiteAdd is provided', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList onSiteAdd={mockOnSiteAdd} />);
    
    await waitFor(() => {
      expect(screen.getByText('+ Add New Site')).toBeInTheDocument();
    });
  });

  it('does not render add button when onSiteAdd is not provided', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    expect(screen.queryByText('+ Add New Site')).not.toBeInTheDocument();
  });

  it('filters sites by search term', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search sites by name, description, or location...');
    await user.type(searchInput, 'Petra');

    expect(screen.getByText('1 of 3 sites')).toBeInTheDocument();
    expect(screen.getByText('Petra Archaeological Park')).toBeInTheDocument();
    expect(screen.queryByText('Al-Hallabat Complex')).not.toBeInTheDocument();
  });

  it('filters sites by status', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText('Status:');
    await user.selectOptions(statusFilter, 'critical');

    expect(screen.getByText('1 of 3 sites')).toBeInTheDocument();
    expect(screen.getByText('Test Site Egypt')).toBeInTheDocument();
    expect(screen.queryByText('Al-Hallabat Complex')).not.toBeInTheDocument();
  });

  it('filters sites by risk level', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    const riskFilter = screen.getByLabelText('Risk Level:');
    await user.selectOptions(riskFilter, 'extremely-high');

    expect(screen.getByText('1 of 3 sites')).toBeInTheDocument();
    expect(screen.getByText('Test Site Egypt')).toBeInTheDocument();
    expect(screen.queryByText('Al-Hallabat Complex')).not.toBeInTheDocument();
  });

  it('filters sites by country', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    const countryFilter = screen.getByLabelText('Country:');
    await user.selectOptions(countryFilter, 'Egypt');

    expect(screen.getByText('1 of 3 sites')).toBeInTheDocument();
    expect(screen.getByText('Test Site Egypt')).toBeInTheDocument();
    expect(screen.queryByText('Al-Hallabat Complex')).not.toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    // Apply filters
    const searchInput = screen.getByPlaceholderText('Search sites by name, description, or location...');
    await user.type(searchInput, 'Petra');
    
    expect(screen.getByText('1 of 3 sites')).toBeInTheDocument();

    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    await user.click(clearButton);

    expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('sorts sites by name', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    // Sites should be sorted by name by default (ascending)
    const siteRows = screen.getAllByRole('row');
    // Skip header row (index 0) and check the order
    expect(siteRows[1]).toHaveTextContent('Al-Hallabat Complex');
    expect(siteRows[2]).toHaveTextContent('Petra Archaeological Park');
    expect(siteRows[3]).toHaveTextContent('Test Site Egypt');

    // Click name header to reverse sort (descending)
    const nameHeader = screen.getByText(/Site Name/);
    await user.click(nameHeader);

    // Now should be in reverse order
    const updatedRows = screen.getAllByRole('row');
    expect(updatedRows[1]).toHaveTextContent('Test Site Egypt');
    expect(updatedRows[2]).toHaveTextContent('Petra Archaeological Park');
    expect(updatedRows[3]).toHaveTextContent('Al-Hallabat Complex');
  });

  it('calls onSiteSelect when view button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList onSiteSelect={mockOnSiteSelect} />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTitle('View Details');
    await user.click(viewButtons[0]);

    expect(mockOnSiteSelect).toHaveBeenCalledWith('site-001');
  });

  it('calls onSiteEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList onSiteEdit={mockOnSiteEdit} />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Edit Site');
    await user.click(editButtons[0]);

    expect(mockOnSiteEdit).toHaveBeenCalledWith('site-001');
  });

  it('calls onSiteAdd when add button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList onSiteAdd={mockOnSiteAdd} />);
    
    await waitFor(() => {
      expect(screen.getByText('+ Add New Site')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add New Site');
    await user.click(addButton);

    expect(mockOnSiteAdd).toHaveBeenCalledTimes(1);
  });

  it('shows no results message when no sites match filters', async () => {
    const user = userEvent.setup();
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 sites')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search sites by name, description, or location...');
    await user.type(searchInput, 'NonexistentSite');

    expect(screen.getByText('0 of 3 sites')).toBeInTheDocument();
    expect(screen.getByText('No heritage sites found matching your criteria.')).toBeInTheDocument();
  });

  it('displays correct status and risk badges', async () => {
    vi.mocked(MockDataService.getHeritageSites).mockResolvedValue(mockSites);

    render(<SiteList />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });

    expect(screen.getByText('AT RISK')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM HIGH')).toBeInTheDocument();
    expect(screen.getByText('EXTREMELY HIGH')).toBeInTheDocument();
  });
});