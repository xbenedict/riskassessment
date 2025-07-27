// Tests for RiskChart component

import React from 'react';
import { render, screen } from '@testing-library/react';
import { RiskChart } from './RiskChart';
import type { RiskAssessment } from '../../types';

// Mock Chart.js to avoid canvas issues in tests
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: any) => (
    <div data-testid="bar-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  ),
  Pie: ({ data, options }: any) => (
    <div data-testid="pie-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  ),
  getElementAtEvent: jest.fn(() => [])
}));

const mockAssessments: RiskAssessment[] = [
  {
    id: 'test-1',
    siteId: 'site-1',
    threatType: 'weathering',
    probability: 4,
    lossOfValue: 3,
    fractionAffected: 2,
    magnitude: 9,
    priority: 'high',
    uncertaintyLevel: 'low',
    assessmentDate: new Date('2024-01-15'),
    assessor: 'Test Assessor',
    notes: 'Test notes'
  },
  {
    id: 'test-2',
    siteId: 'site-1',
    threatType: 'urban-development',
    probability: 3,
    lossOfValue: 4,
    fractionAffected: 3,
    magnitude: 10,
    priority: 'very-high',
    uncertaintyLevel: 'medium',
    assessmentDate: new Date('2024-01-10'),
    assessor: 'Test Assessor 2',
    notes: 'Test notes 2'
  }
];

describe('RiskChart', () => {
  it('renders magnitude chart correctly', () => {
    render(
      <RiskChart
        assessments={mockAssessments}
        chartType="magnitude"
        title="Test Magnitude Chart"
      />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('📊 PNG')).toBeInTheDocument();
    expect(screen.getByText('📊 JPEG')).toBeInTheDocument();
  });

  it('renders category chart correctly', () => {
    render(
      <RiskChart
        assessments={mockAssessments}
        chartType="category"
        title="Test Category Chart"
      />
    );

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders threat comparison chart correctly', () => {
    render(
      <RiskChart
        assessments={mockAssessments}
        chartType="threat-comparison"
        title="Test Threat Comparison Chart"
      />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('shows empty state when no assessments provided', () => {
    render(
      <RiskChart
        assessments={[]}
        chartType="magnitude"
        title="Empty Chart"
      />
    );

    expect(screen.getByText('No risk assessment data available for visualization.')).toBeInTheDocument();
  });

  it('hides export controls when showExport is false', () => {
    render(
      <RiskChart
        assessments={mockAssessments}
        chartType="magnitude"
        showExport={false}
      />
    );

    expect(screen.queryByText('📊 PNG')).not.toBeInTheDocument();
    expect(screen.queryByText('📊 JPEG')).not.toBeInTheDocument();
  });

  it('shows risk priority legend for magnitude chart', () => {
    render(
      <RiskChart
        assessments={mockAssessments}
        chartType="magnitude"
        title="Test Chart"
      />
    );

    expect(screen.getByText('Risk Priority Levels:')).toBeInTheDocument();
    expect(screen.getByText('EXTREMELY HIGH')).toBeInTheDocument();
    expect(screen.getByText('VERY HIGH')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });
});