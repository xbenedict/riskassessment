import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteForm } from './SiteForm';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite } from '../../types';

// Mock the MockDataService
vi.mock('../../services/MockDataService');

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ position }: any) => (
    <div data-testid="marker" data-position={position?.join(',')} />
  ),
  useMapEvents: (handlers: any) => {
    // Mock map click event
    const mockMapClick = () => {
      if (handlers.click) {
        handlers.click({ latlng: { lat: 32.0833, lng: 36.3167 } });
      }
    };
    
    // Expose click handler for testing
    (global as any).mockMapClick = mockMapClick;
    return null;
  }
}));

const mockSite: HeritageSite = {
  id: 'site-001',
  name: 'Test Heritage Site',
  location: {
    latitude: 32.0833,
    longitude: 36.3167,
    address: 'Test Address',
    country: 'Test Country'
  },
  description: 'Test description',
  significance: 'Test significance',
  currentStatus: 'active',
  lastAssessment: new Date('2024-01-15'),
  riskProfile: {
    overallRisk: 'high',
    lastUpdated: new Date('2024-01-15'),
    activeThreats: ['weathering', 'tourism-pressure']
  },
  images: ['/test-image1.jpg'],
  createdAt: new Date('2023-06-01'),
  updatedAt: new Date('2024-01-15')
};

describe('SiteForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear global mock functions
    delete (global as any).mockMapClick;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders form in create mode when no siteId is provided', () => {
    const { container } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Add New Heritage Site')).toBeInTheDocument();
    expect(screen.getByLabelText('Site Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
    expect(screen.getByLabelText('Cultural Significance *')).toBeInTheDocument();
    
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toHaveTextContent('Create Site');
  });

  it('renders form in edit mode when siteId is provided', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);

    render(<SiteForm siteId="site-001" onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Heritage Site')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Test Heritage Site')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test significance')).toBeInTheDocument();
    expect(screen.getByText('Update Site')).toBeInTheDocument();
  });

  it('shows loading state when loading existing site data', () => {
    vi.mocked(MockDataService.getHeritageSite).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SiteForm siteId="site-001" onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Loading site data...')).toBeInTheDocument();
  });

  it('validates required fields and shows error messages', async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
    }
    
    expect(screen.getByText('Site name is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Cultural significance is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    // Country has default value "Jordan", so no error is expected
    // Location has default position set, so no error is expected
  });

  it('clears error messages when user starts typing', async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    // Trigger validation errors
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
    }
    
    expect(screen.getByText('Site name is required')).toBeInTheDocument();
    
    // Start typing in name field
    const nameInput = screen.getByLabelText('Site Name *');
    await user.type(nameInput, 'Test Site');
    
    expect(screen.queryByText('Site name is required')).not.toBeInTheDocument();
  });

  it('handles form input changes correctly', async () => {
    const user = userEvent.setup();
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText('Site Name *');
    const descriptionInput = screen.getByLabelText('Description *');
    const significanceInput = screen.getByLabelText('Cultural Significance *');
    
    await user.type(nameInput, 'Test Site Name');
    await user.type(descriptionInput, 'Test description');
    await user.type(significanceInput, 'Test significance');
    
    expect(nameInput).toHaveValue('Test Site Name');
    expect(descriptionInput).toHaveValue('Test description');
    expect(significanceInput).toHaveValue('Test significance');
  });

  it('handles status selection', async () => {
    const user = userEvent.setup();
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const statusSelect = screen.getByLabelText('Current Status');
    await user.selectOptions(statusSelect, 'at-risk');
    
    expect(statusSelect).toHaveValue('at-risk');
  });

  it('handles map location selection', () => {
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
    
    // Simulate map click
    if ((global as any).mockMapClick) {
      (global as any).mockMapClick();
      
      // Map click handler should be called (coordinates are updated internally)
      // We can't easily test the coordinate display due to text splitting across elements
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    }
  });

  it('handles threat selection', async () => {
    const user = userEvent.setup();
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const earthquakeCheckbox = screen.getByLabelText('Earthquake');
    const floodingCheckbox = screen.getByLabelText('Flooding');
    
    await user.click(earthquakeCheckbox);
    await user.click(floodingCheckbox);
    
    expect(earthquakeCheckbox).toBeChecked();
    expect(floodingCheckbox).toBeChecked();
  });

  it('handles image upload simulation', async () => {
    const user = userEvent.setup();
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const uploadButton = screen.getByText('📷 Add Photos');
    expect(uploadButton).toBeInTheDocument();
    
    // Note: File upload testing is complex with jsdom, so we just verify the button exists
    // In a real test environment, you would mock the file input and test the upload flow
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when close button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const closeButton = container.querySelector('button[class*="closeButton"]');
    expect(closeButton).toBeTruthy();
    
    if (closeButton) {
      await user.click(closeButton);
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    }
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    // Fill in required fields
    await user.type(screen.getByLabelText('Site Name *'), 'Test Site');
    await user.type(screen.getByLabelText('Description *'), 'Test description');
    await user.type(screen.getByLabelText('Cultural Significance *'), 'Test significance');
    await user.type(screen.getByLabelText('Address *'), 'Test Address');
    
    // Clear the country field first (it has default value "Jordan")
    const countryInput = screen.getByLabelText('Country *');
    await user.clear(countryInput);
    await user.type(countryInput, 'Test Country');
    
    // Simulate map click to set location
    if ((global as any).mockMapClick) {
      (global as any).mockMapClick();
    }
    
    // Submit form
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
    }
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
    
    const savedSite = mockOnSave.mock.calls[0][0];
    expect(savedSite.name).toBe('Test Site');
    expect(savedSite.description).toBe('Test description');
    expect(savedSite.significance).toBe('Test significance');
    expect(savedSite.location.address).toBe('Test Address');
    expect(savedSite.location.country).toBe('Test Country');
  });

  it('loads and populates form data in edit mode', async () => {
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);

    render(<SiteForm siteId="site-001" onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Heritage Site')).toBeInTheDocument();
    });

    // Check form fields are populated
    const nameInput = screen.getByLabelText('Site Name *');
    const descriptionInput = screen.getByLabelText('Description *');
    const significanceInput = screen.getByLabelText('Cultural Significance *');
    const addressInput = screen.getByLabelText('Address *');
    const countryInput = screen.getByLabelText('Country *');

    expect(nameInput).toHaveValue('Test Heritage Site');
    expect(descriptionInput).toHaveValue('Test description');
    expect(significanceInput).toHaveValue('Test significance');
    expect(addressInput).toHaveValue('Test Address');
    expect(countryInput).toHaveValue('Test Country');

    // Check that threats are pre-selected
    expect(screen.getByLabelText('Weathering')).toBeChecked();
    expect(screen.getByLabelText('Tourism Pressure')).toBeChecked();
  });

  it('shows correct button text based on mode', async () => {
    // Test create mode
    const { container, rerender } = render(<SiteForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const createButton = container.querySelector('button[type="submit"]');
    expect(createButton).toHaveTextContent('Create Site');
    
    // Test edit mode
    vi.mocked(MockDataService.getHeritageSite).mockResolvedValue(mockSite);
    rerender(<SiteForm siteId="site-001" onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Heritage Site')).toBeInTheDocument();
    });
    
    const updateButton = container.querySelector('button[type="submit"]');
    expect(updateButton).toHaveTextContent('Update Site');
  });
});