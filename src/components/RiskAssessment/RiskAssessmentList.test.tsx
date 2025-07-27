import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RiskAssessmentList } from './RiskAssessmentList';
import type { RiskAssessment } from '../../types';
import { ThreatType } from '../../types';

const mockAssessments: RiskAssessment[] = [
  {
    id: '1',
    siteId: 'site-1',
    threatType: ThreatType.EARTHQUAKE,
    probability: 4,
    lossOfValue: 5,
    fractionAffected: 3,
    magnitude: 12,
    priority: 'very-high',
    uncertaintyLevel: 'low',
    assessmentDate: new Date('2024-01-15'),
    assessor: 'John Doe',
    notes: 'High seismic activity in the region poses significant threat to structural integrity.'
  },
  {
    id: '2',
    siteId: 'site-1',
    threatType: ThreatType.FLOODING,
    probability: 2,
    lossOfValue: 3,
    fractionAffected: 2,
    magnitude: 7,
    priority: 'high',
    uncertaintyLevel: 'medium',
    assessmentDate: new Date('2024-01-10'),
    assessor: 'Jane Smith',
    notes: 'Seasonal flooding could affect lower sections of the site.'
  },
  {
    id: '3',
    siteId: 'site-2',
    threatType: ThreatType.WEATHERING,
    probability: 3,
    lossOfValue: 2,
    fractionAffected: 1,
    magnitude: 6,
    priority: 'medium-high',
    uncertaintyLevel: 'high',
    assessmentDate: new Date('2024-01-05'),
    assessor: 'Bob Wilson',
    notes: 'Stone weathering is gradually affecting surface details.'
  }
];

const mockProps = {
  assessments: mockAssessments,
  onAssessmentClick: vi.fn(),
  onEditAssessment: vi.fn(),
  onDeleteAssessment: vi.fn()
};

describe('RiskAssessmentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders list with all assessments', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    expect(screen.getByText('Risk Assessments')).toBeInTheDocument();
    expect(screen.getByText('Showing 3 of 3 assessments')).toBeInTheDocument();
    
    // Check that all assessments are displayed
    expect(screen.getByText('Earthquake')).toBeInTheDocument();
    expect(screen.getByText('Flooding')).toBeInTheDocument();
    expect(screen.getByText('Weathering')).toBeInTheDocument();
  });

  it('displays assessment details correctly', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    // Check magnitude display
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    
    // Check priority badges
    expect(screen.getByText('very high')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium high')).toBeInTheDocument();
    
    // Check assessor names
    expect(screen.getByText('By John Doe')).toBeInTheDocument();
    expect(screen.getByText('By Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('By Bob Wilson')).toBeInTheDocument();
  });

  it('sorts assessments by priority by default (high to low)', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const assessmentCards = screen.getAllByText(/^(Earthquake|Flooding|Weathering)$/);
    
    // Should be sorted by priority: very-high (Earthquake), high (Flooding), medium-high (Weathering)
    expect(assessmentCards[0]).toHaveTextContent('Earthquake');
    expect(assessmentCards[1]).toHaveTextContent('Flooding');
    expect(assessmentCards[2]).toHaveTextContent('Weathering');
  });

  it('filters assessments by threat type', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const threatFilter = screen.getByDisplayValue('All Threats');
    fireEvent.change(threatFilter, { target: { value: ThreatType.EARTHQUAKE } });
    
    expect(screen.getByText('Showing 1 of 3 assessments')).toBeInTheDocument();
    expect(screen.getByText('Earthquake')).toBeInTheDocument();
    expect(screen.queryByText('Flooding')).not.toBeInTheDocument();
    expect(screen.queryByText('Weathering')).not.toBeInTheDocument();
  });

  it('filters assessments by priority', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const priorityFilter = screen.getByDisplayValue('All Priorities');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });
    
    expect(screen.getByText('Showing 1 of 3 assessments')).toBeInTheDocument();
    expect(screen.getByText('Flooding')).toBeInTheDocument();
    expect(screen.queryByText('Earthquake')).not.toBeInTheDocument();
    expect(screen.queryByText('Weathering')).not.toBeInTheDocument();
  });

  it('searches assessments by text', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search assessments...');
    fireEvent.change(searchInput, { target: { value: 'seismic' } });
    
    expect(screen.getByText('Showing 1 of 3 assessments')).toBeInTheDocument();
    expect(screen.getByText('Earthquake')).toBeInTheDocument();
    expect(screen.queryByText('Flooding')).not.toBeInTheDocument();
    expect(screen.queryByText('Weathering')).not.toBeInTheDocument();
  });

  it('changes sort order when sort option is selected', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const sortSelect = screen.getByDisplayValue('Priority (High to Low)');
    fireEvent.change(sortSelect, { target: { value: 'magnitude-asc' } });
    
    const assessmentCards = screen.getAllByText(/^(Earthquake|Flooding|Weathering)$/);
    
    // Should be sorted by magnitude ascending: 6 (Weathering), 7 (Flooding), 12 (Earthquake)
    expect(assessmentCards[0]).toHaveTextContent('Weathering');
    expect(assessmentCards[1]).toHaveTextContent('Flooding');
    expect(assessmentCards[2]).toHaveTextContent('Earthquake');
  });

  it('displays ABC component breakdown', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    // Check that ABC components are displayed
    expect(screen.getByText('A:')).toBeInTheDocument();
    expect(screen.getByText('B:')).toBeInTheDocument();
    expect(screen.getByText('C:')).toBeInTheDocument();
    
    // Check specific values for first assessment (4, 5, 3)
    const aComponents = screen.getAllByText('4');
    const bComponents = screen.getAllByText('5');
    const cComponents = screen.getAllByText('3');
    
    expect(aComponents.length).toBeGreaterThan(0);
    expect(bComponents.length).toBeGreaterThan(0);
    expect(cComponents.length).toBeGreaterThan(0);
  });

  it('displays uncertainty levels with appropriate styling', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('truncates long notes', () => {
    const longNotesAssessment: RiskAssessment = {
      ...mockAssessments[0],
      id: '4',
      notes: 'This is a very long note that should be truncated when displayed in the list view because it exceeds the maximum length that we want to show in the card format for better readability and layout consistency.'
    };

    render(<RiskAssessmentList assessments={[longNotesAssessment]} />);
    
    expect(screen.getByText(/This is a very long note.*\.\.\./)).toBeInTheDocument();
  });

  it('calls onAssessmentClick when assessment card is clicked', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const earthquakeCard = screen.getByText('Earthquake').closest('div');
    fireEvent.click(earthquakeCard!);
    
    expect(mockProps.onAssessmentClick).toHaveBeenCalledWith(mockAssessments[0]);
  });

  it('shows empty state when no assessments provided', () => {
    render(<RiskAssessmentList assessments={[]} />);
    
    expect(screen.getByText('No Risk Assessments')).toBeInTheDocument();
    expect(screen.getByText(/No risk assessments have been created yet/)).toBeInTheDocument();
  });

  it('shows empty state when no assessments match filters', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search assessments...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No Matching Assessments')).toBeInTheDocument();
    expect(screen.getByText(/No assessments match your current filters/)).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 5, 2024')).toBeInTheDocument();
  });

  it('formats threat types correctly', () => {
    const urbanDevelopmentAssessment: RiskAssessment = {
      ...mockAssessments[0],
      id: '4',
      threatType: ThreatType.URBAN_DEVELOPMENT
    };

    render(<RiskAssessmentList assessments={[urbanDevelopmentAssessment]} />);
    
    expect(screen.getByText('Urban Development')).toBeInTheDocument();
  });

  it('applies correct CSS classes based on priority', () => {
    render(<RiskAssessmentList {...mockProps} />);
    
    const veryHighBadge = screen.getByText('very high');
    const highBadge = screen.getByText('high');
    const mediumHighBadge = screen.getByText('medium high');
    
    expect(veryHighBadge).toHaveClass('priorityVeryHigh');
    expect(highBadge).toHaveClass('priorityHigh');
    expect(mediumHighBadge).toHaveClass('priorityMediumHigh');
  });
});