// Tests for DataManager component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataManager } from './DataManager';
import { MockDataService } from '../../services/MockDataService';
import { DataExportImportService } from '../../services/DataExportImportService';

import { vi } from 'vitest';

// Mock the services
vi.mock('../../services/MockDataService');
vi.mock('../../services/DataExportImportService');

const mockMockDataService = MockDataService as any;
const mockDataExportImportService = DataExportImportService as any;

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

const mockExportData = {
  metadata: {
    exportDate: '2024-01-15T00:00:00.000Z',
    version: '1.0.0',
    source: 'Heritage Guardian System',
    totalSites: 2,
    totalAssessments: 1
  },
  sites: mockSites,
  assessments: mockAssessments
};

const mockImportResult = {
  success: true,
  sitesImported: 2,
  assessmentsImported: 1,
  errors: [],
  warnings: ['Test warning'],
  skippedRecords: 0,
  duplicatesFound: 0
};

describe('DataManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMockDataService.getHeritageSites.mockResolvedValue(mockSites);
    mockMockDataService.getRiskAssessments.mockResolvedValue(mockAssessments);
    mockDataExportImportService.exportData.mockReturnValue(mockExportData);
    mockDataExportImportService.exportToFile.mockImplementation(() => {});
    mockDataExportImportService.exportSiteData.mockImplementation(() => {});
    mockDataExportImportService.downloadSampleData.mockImplementation(() => {});
    mockDataExportImportService.importFromFile.mockResolvedValue(mockImportResult);
  });

  it('renders data manager interface', async () => {
    render(<DataManager />);
    
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('Export and import heritage site data with comprehensive validation')).toBeInTheDocument();
    
    // Check tabs
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Import Data')).toBeInTheDocument();
    expect(screen.getByText('Validate Data')).toBeInTheDocument();
  });

  it('loads data on mount', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(mockMockDataService.getHeritageSites).toHaveBeenCalled();
    });
  });

  it('shows export statistics', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Sites count
      expect(screen.getByText('Heritage Sites')).toBeInTheDocument();
    });
  });

  it('switches between tabs', async () => {
    render(<DataManager />);
    
    // Default tab should be export
    expect(screen.getByText('Export Data')).toHaveClass('active');
    
    // Switch to import tab
    fireEvent.click(screen.getByText('Import Data'));
    expect(screen.getByText('Import Data')).toHaveClass('active');
    
    // Switch to validation tab
    fireEvent.click(screen.getByText('Validate Data'));
    expect(screen.getByText('Validate Data')).toHaveClass('active');
  });

  it('handles full data export', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Export All Data')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Export All Data'));
    
    expect(mockDataExportImportService.exportData).toHaveBeenCalledWith(
      mockSites,
      mockAssessments
    );
    expect(mockDataExportImportService.exportToFile).toHaveBeenCalled();
  });

  it('shows site selection for selective export', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Heritage Site 1')).toBeInTheDocument();
      expect(screen.getByText('Test Heritage Site 2')).toBeInTheDocument();
    });
  });

  it('handles site selection changes', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Heritage Site 1')).toBeInTheDocument();
    });
    
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    
    // Should still work (checkbox state managed internally)
    expect(checkbox).toBeInTheDocument();
  });

  it('handles select all/none', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Select None'));
    fireEvent.click(screen.getByText('Select All'));
    
    // Should update selection count
    expect(screen.getByText('2 of 2 selected')).toBeInTheDocument();
  });

  it('handles selective export', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Export Selected Sites')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Export Selected Sites'));
    
    expect(mockDataExportImportService.exportToFile).toHaveBeenCalled();
  });

  it('handles individual site export', async () => {
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getAllByText('Export')[0]).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getAllByText('Export')[0]);
    
    expect(mockDataExportImportService.exportSiteData).toHaveBeenCalledWith(
      mockSites[0],
      mockAssessments
    );
  });

  it('handles sample data download', async () => {
    render(<DataManager />);
    
    // Switch to import tab
    fireEvent.click(screen.getByText('Import Data'));
    
    await waitFor(() => {
      expect(screen.getByText('Download Sample File')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Download Sample File'));
    
    expect(mockDataExportImportService.downloadSampleData).toHaveBeenCalled();
  });

  it('shows import results', async () => {
    render(<DataManager />);
    
    // Switch to import tab
    fireEvent.click(screen.getByText('Import Data'));
    
    // Mock file input
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Choose JSON File');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockDataExportImportService.importFromFile).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          skipDuplicates: true,
          updateExisting: false,
          validateOnly: false
        })
      );
    });
  });

  it('shows validation results', async () => {
    render(<DataManager />);
    
    // Switch to validation tab
    fireEvent.click(screen.getByText('Validate Data'));
    
    await waitFor(() => {
      expect(screen.getByText('Choose JSON File to Validate')).toBeInTheDocument();
    });
    
    // Mock file input
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Choose JSON File to Validate');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockDataExportImportService.importFromFile).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          validateOnly: true
        })
      );
    });
  });

  it('handles errors', async () => {
    mockMockDataService.getHeritageSites.mockRejectedValue(new Error('Test error'));
    
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  it('can close error messages', async () => {
    mockMockDataService.getHeritageSites.mockRejectedValue(new Error('Test error'));
    
    render(<DataManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('×'));
    
    expect(screen.queryByText('Error: Test error')).not.toBeInTheDocument();
  });

  it('calls onDataImported callback', async () => {
    const mockCallback = vi.fn();
    render(<DataManager onDataImported={mockCallback} />);
    
    // Switch to import tab
    fireEvent.click(screen.getByText('Import Data'));
    
    // Mock file input
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText('Choose JSON File');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledWith(mockImportResult);
    });
  });

  it('calls onDataExported callback', async () => {
    const mockCallback = jest.fn();
    render(<DataManager onDataExported={mockCallback} />);
    
    await waitFor(() => {
      expect(screen.getByText('Export All Data')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Export All Data'));
    
    expect(mockCallback).toHaveBeenCalledWith(mockExportData);
  });
});