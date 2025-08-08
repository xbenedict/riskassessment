import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { SiteProfile } from './SiteProfile';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite, RiskAssessment } from '../../types';

// Mock the MockDataService
vi.mock('../../services/MockDataService');

const mockSite: HeritageSite = {
  id: 'site-001',
  name: 'Test Heritage Site',
  location: {
    latitude: 32.0833,
    longitude: 36.3167,
    address: 'Test Address',
    country: 'Test Country'
  },
  description: 'Test description of the heritage site',
  significance: 'Test significance of the site',
  currentStatus: 'active',
  lastAssessment: new Date('2024-01-15'),
  riskProfile: {
    overallRisk: 'high',
    lastUpdated: new Date('2024-01-15'),
    activeThreats: ['weathering', 'tourism-pressure']
  },
  images: ['/test-image1.jpg', '/test-image2.jpg'],
  createdAt: new Date('2023-06-01'),
  updatedAt: new Date('2024-01-15')
};

const mockRiskAssessments: RiskAssessment[] = [
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
    assessor: 'Dr. Test Assessor',
    notes: 'Test assessment notes'
  }
];

describe('SiteProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state initially', () => {
    vi.mocked(MockDataService.getHeritageSite).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    vi.mocked(MockDataService.getRiskAssessments).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SiteProfile siteId="site-001" />);
    
    expect(screen.getByText('Loading site profile...')).toBeInTheDocument();
  });

  it('renders error state when site is not found', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(null);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);

    render(<SiteProfile siteId="nonexistent" />);
    
    await waitFor(() => {
      expect(screen.getByText('Heritage site not found')).toBeInTheDocument();
    });
  });

  it('renders site profile with all sections when data is loaded', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue(mockRiskAssessments);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Heritage Site')).toBeInTheDocument();
    });

    // Check site information section
    expect(screen.getByText('Site Information')).toBeInTheDocument();
    expect(screen.getByText('Test description of the heritage site')).toBeInTheDocument();
    expect(screen.getByText('Test significance of the site')).toBeInTheDocument();

    // Check current threat status section
    expect(screen.getByText('Current Threat Status')).toBeInTheDocument();
    expect(screen.getAllByText('HIGH')).toHaveLength(2); // One in threat status, one in assessment history

    // Check active threats
    expect(screen.getByText('Active Threats')).toBeInTheDocument();
    expect(screen.getByText('weathering')).toBeInTheDocument();
    expect(screen.getByText('tourism pressure')).toBeInTheDocument();

    // Check recommended actions section
    expect(screen.getByText('Recommended Actions')).toBeInTheDocument();

    // Check risk assessment history section
    expect(screen.getByText('Risk Assessment History')).toBeInTheDocument();
    expect(screen.getByText('weathering Threat')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'by Dr. Test Assessor';
    })).toBeInTheDocument();
  });

  it('displays photo gallery when images are available', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getByText('Site Documentation')).toBeInTheDocument();
    });

    // Check main image
    const mainImage = screen.getByAltText('Test Heritage Site - Image 1');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', '/test-image1.jpg');

    // Check thumbnails
    const thumbnails = screen.getAllByRole('button');
    const imageThumbnails = thumbnails.filter(button => 
      button.querySelector('img')
    );
    expect(imageThumbnails).toHaveLength(2);
  });

  it('displays ABC scale components correctly in risk assessments', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue(mockRiskAssessments);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Assessment History')).toBeInTheDocument();
    });

    // Check ABC components
    expect(screen.getByText('Probability (A)')).toBeInTheDocument();
    expect(screen.getByText('Loss of Value (B)')).toBeInTheDocument();
    expect(screen.getByText('Fraction Affected (C)')).toBeInTheDocument();
    expect(screen.getByText('Magnitude')).toBeInTheDocument();

    // Check values
    expect(screen.getByText('4')).toBeInTheDocument(); // Probability
    expect(screen.getByText('3')).toBeInTheDocument(); // Loss of Value
    expect(screen.getByText('2')).toBeInTheDocument(); // Fraction Affected
    expect(screen.getByText('9')).toBeInTheDocument(); // Magnitude
  });

  it('shows no data message when no risk assessments exist', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getByText('No risk assessments available for this site.')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([]);

    render(<SiteProfile siteId="site-001" onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Heritage Site')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('formats dates correctly', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue(mockRiskAssessments);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getAllByText('January 15, 2024')).toHaveLength(2); // One in site info, one in assessment
    });
  });

  it('generates appropriate recommended actions based on risk levels', async () => {
    const highRiskAssessment: RiskAssessment = {
      ...mockRiskAssessments[0],
      priority: 'extremely-high',
      threatType: 'earthquake'
    };

    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    vi.mocked(MockDataService.getRiskAssessments).mockResolvedValue([highRiskAssessment]);

    render(<SiteProfile siteId="site-001" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Heritage Site')).toBeInTheDocument();
    });

    expect(screen.getByText('Immediate intervention required for earthquake threat')).toBeInTheDocument();
  });
});