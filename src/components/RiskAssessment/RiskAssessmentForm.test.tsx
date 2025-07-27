import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { ThreatType } from '../../types';

const mockProps = {
  siteId: 'test-site-1',
  siteName: 'Test Heritage Site',
  onSubmit: vi.fn(),
  onCancel: vi.fn()
};

describe('RiskAssessmentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders form with all required elements', () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    expect(screen.getByText('Risk Assessment for Test Heritage Site')).toBeInTheDocument();
    expect(screen.getByText('Probability')).toBeInTheDocument();
    expect(screen.getByText('Loss of Value')).toBeInTheDocument();
    expect(screen.getByText('Fraction Affected')).toBeInTheDocument();
    expect(screen.getByText('Uncertainty Level')).toBeInTheDocument();
    expect(screen.getByText('Save Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('displays real-time risk calculation', () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    // Default values (3, 3, 3) should give magnitude 9
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
  });

  it('updates risk calculation when sliders change', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    const probabilitySlider = screen.getByRole('slider', { name: /likelihood of occurrence/i });
    fireEvent.change(probabilitySlider, { target: { value: '5' } });
    
    await waitFor(() => {
      // New magnitude should be 5 + 3 + 3 = 11
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('VERY HIGH PRIORITY')).toBeInTheDocument();
    });
  });

  it('shows component descriptions based on selected values', () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    expect(screen.getByText(/Possible to occur in the next 100 years/)).toBeInTheDocument();
    expect(screen.getByText(/Moderate loss of heritage value/)).toBeInTheDocument();
    expect(screen.getByText(/10-50% of the site affected/)).toBeInTheDocument();
  });

  it('applies uncertainty matrix adjustments', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    const uncertaintySelect = screen.getByDisplayValue(/Low - High confidence/);
    fireEvent.change(uncertaintySelect, { target: { value: 'high' } });
    
    await waitFor(() => {
      // With high uncertainty, medium-high (magnitude 6) should become very-high
      expect(screen.getByText('EXTREMELY HIGH PRIORITY')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Save Risk Assessment' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Assessor name is required')).toBeInTheDocument();
      expect(screen.getByText('Assessment notes are required')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with correct data when valid', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    // Fill required fields
    const assessorInput = screen.getByPlaceholderText('Enter your name');
    const notesInput = screen.getByPlaceholderText(/Provide detailed notes/);
    
    fireEvent.change(assessorInput, { target: { value: 'John Doe' } });
    fireEvent.change(notesInput, { target: { value: 'Test assessment notes' } });
    
    const submitButton = screen.getByRole('button', { name: 'Save Risk Assessment' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        siteId: 'test-site-1',
        threatType: ThreatType.WEATHERING,
        probability: 3,
        lossOfValue: 3,
        fractionAffected: 3,
        magnitude: 9,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessor: 'John Doe',
        notes: 'Test assessment notes'
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('populates form with initial data when provided', () => {
    const initialData = {
      threatType: ThreatType.EARTHQUAKE,
      probability: 4,
      lossOfValue: 2,
      fractionAffected: 1,
      uncertaintyLevel: 'medium' as const,
      assessor: 'Jane Smith',
      notes: 'Initial notes'
    };

    render(<RiskAssessmentForm {...mockProps} initialData={initialData} />);
    
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial notes')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Medium - Some uncertainty/)).toBeInTheDocument();
    
    // Check that magnitude is calculated correctly: 4 + 2 + 1 = 7
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('clears validation errors when user starts typing', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: 'Save Risk Assessment' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Assessor name is required')).toBeInTheDocument();
    });
    
    // Start typing in assessor field
    const assessorInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(assessorInput, { target: { value: 'J' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Assessor name is required')).not.toBeInTheDocument();
    });
  });

  it('handles all threat type options', () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    // Check that all threat types are available as options
    const threatOptions = [
      'Earthquake', 'Flooding', 'Weathering', 'Vegetation',
      'Urban Development', 'Tourism Pressure', 'Looting', 'Conflict', 'Climate Change'
    ];
    
    const threatSelect = screen.getByDisplayValue('Weathering');
    expect(threatSelect).toBeInTheDocument();
    
    // Check that options exist in the select
    threatOptions.forEach(threat => {
      expect(screen.getAllByText(threat).length).toBeGreaterThan(0);
    });
  });

  it('shows uncertainty adjustment indicator when applicable', async () => {
    render(<RiskAssessmentForm {...mockProps} />);
    
    // Find the uncertainty select by its id
    const uncertaintySelect = screen.getByDisplayValue(/Low - High confidence/);
    fireEvent.change(uncertaintySelect, { target: { value: 'medium' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Base priority.*Adjusted for uncertainty/)).toBeInTheDocument();
    });
  });
});