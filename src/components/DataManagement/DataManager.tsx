// Data Management component for export and import functionality
// Provides comprehensive data management interface with validation

import React, { useState, useRef, useCallback } from 'react';
import { 
  DataExportImportService, 
  type ImportResult, 
  type ExportData 
} from '../../services/DataExportImportService';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite, RiskAssessment } from '../../types';
import styles from './DataManager.module.css';

type ActiveTab = 'export' | 'import' | 'validation';

interface DataManagerProps {
  onDataImported?: (result: ImportResult) => void;
  onDataExported?: (data: ExportData) => void;
}

/**
 * Data Management Component
 * Provides comprehensive export and import functionality for heritage risk assessment data
 * Includes validation, error handling, and progress feedback
 */
export const DataManager: React.FC<DataManagerProps> = ({
  onDataImported,
  onDataExported
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('export');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [validationResult, setValidationResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [sitesData, allAssessments] = await Promise.all([
          MockDataService.getHeritageSites(),
          Promise.all((await MockDataService.getHeritageSites()).map(site => 
            MockDataService.getRiskAssessments(site.id)
          )).then(results => results.flat())
        ]);
        
        setSites(sitesData);
        setAssessments(allAssessments);
        setSelectedSiteIds(sitesData.map(site => site.id)); // Select all by default
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };
    
    loadData();
  }, []);
  
  /**
   * Handle full data export
   */
  const handleFullExport = useCallback(() => {
    try {
      const exportData = DataExportImportService.exportData(sites, assessments);
      DataExportImportService.exportToFile(sites, assessments);
      onDataExported?.(exportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }, [sites, assessments, onDataExported]);
  
  /**
   * Handle selective site export
   */
  const handleSelectiveExport = useCallback(() => {
    try {
      const selectedSites = sites.filter(site => selectedSiteIds.includes(site.id));
      const selectedAssessments = assessments.filter(assessment => 
        selectedSiteIds.includes(assessment.siteId)
      );
      
      const exportData = DataExportImportService.exportData(selectedSites, selectedAssessments);
      DataExportImportService.exportToFile(
        selectedSites, 
        selectedAssessments,
        `heritage-selective-export-${Date.now()}.json`
      );
      onDataExported?.(exportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Selective export failed');
    }
  }, [sites, assessments, selectedSiteIds, onDataExported]);
  
  /**
   * Handle individual site export
   */
  const handleSiteExport = useCallback((siteId: string) => {
    try {
      const site = sites.find(s => s.id === siteId);
      if (!site) {
        setError('Site not found');
        return;
      }
      
      const siteAssessments = assessments.filter(a => a.siteId === siteId);
      DataExportImportService.exportSiteData(site, siteAssessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Site export failed');
    }
  }, [sites, assessments]);
  
  /**
   * Handle file import
   */
  const handleFileImport = useCallback(async (file: File, validateOnly: boolean = false) => {
    setIsLoading(true);
    setError('');
    setImportResult(null);
    setValidationResult(null);
    
    try {
      const result = await DataExportImportService.importFromFile(file, {
        skipDuplicates: true,
        updateExisting: false,
        validateOnly
      });
      
      if (validateOnly) {
        setValidationResult(result);
      } else {
        setImportResult(result);
        onDataImported?.(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsLoading(false);
    }
  }, [onDataImported]);
  
  /**
   * Handle file selection for import
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileImport(file, false);
    }
  }, [handleFileImport]);
  
  /**
   * Handle file selection for validation
   */
  const handleValidationFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileImport(file, true);
    }
  }, [handleFileImport]);
  
  /**
   * Handle site selection change
   */
  const handleSiteSelectionChange = useCallback((siteId: string, selected: boolean) => {
    setSelectedSiteIds(prev => 
      selected 
        ? [...prev, siteId]
        : prev.filter(id => id !== siteId)
    );
  }, []);
  
  /**
   * Handle select all/none
   */
  const handleSelectAll = useCallback((selectAll: boolean) => {
    setSelectedSiteIds(selectAll ? sites.map(site => site.id) : []);
  }, [sites]);
  
  /**
   * Download sample data file
   */
  const handleDownloadSample = useCallback(() => {
    DataExportImportService.downloadSampleData();
  }, []);
  
  /**
   * Render export tab
   */
  const renderExportTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Full Data Export</h3>
        <p>Export all heritage sites and risk assessments in JSON format.</p>
        <div className={styles.exportStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{sites.length}</span>
            <span className={styles.statLabel}>Heritage Sites</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{assessments.length}</span>
            <span className={styles.statLabel}>Risk Assessments</span>
          </div>
        </div>
        <button onClick={handleFullExport} className={styles.primaryButton}>
          Export All Data
        </button>
      </div>
      
      <div className={styles.section}>
        <h3>Selective Export</h3>
        <p>Choose specific heritage sites to export with their assessments.</p>
        
        <div className={styles.selectionControls}>
          <button 
            onClick={() => handleSelectAll(true)} 
            className={styles.secondaryButton}
          >
            Select All
          </button>
          <button 
            onClick={() => handleSelectAll(false)} 
            className={styles.secondaryButton}
          >
            Select None
          </button>
          <span className={styles.selectionCount}>
            {selectedSiteIds.length} of {sites.length} selected
          </span>
        </div>
        
        <div className={styles.siteList}>
          {sites.map(site => (
            <div key={site.id} className={styles.siteItem}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedSiteIds.includes(site.id)}
                  onChange={(e) => handleSiteSelectionChange(site.id, e.target.checked)}
                />
                <span className={styles.siteName}>{site.name}</span>
                <span className={styles.siteLocation}>{site.location.country}</span>
              </label>
              <button
                onClick={() => handleSiteExport(site.id)}
                className={styles.exportSiteButton}
                title="Export this site only"
              >
                Export
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleSelectiveExport}
          disabled={selectedSiteIds.length === 0}
          className={styles.primaryButton}
        >
          Export Selected Sites
        </button>
      </div>
    </div>
  );
  
  /**
   * Render import tab
   */
  const renderImportTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Import Heritage Data</h3>
        <p>Import heritage sites and risk assessments from JSON file.</p>
        
        <div className={styles.importControls}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="import-file"
          />
          <label htmlFor="import-file" className={styles.fileLabel}>
            Choose JSON File
          </label>
          
          <button onClick={handleDownloadSample} className={styles.secondaryButton}>
            Download Sample File
          </button>
        </div>
        
        {isLoading && (
          <div className={styles.loading}>
            <p>Processing import...</p>
          </div>
        )}
        
        {importResult && (
          <div className={styles.importResult}>
            <h4>Import Results</h4>
            <div className={styles.resultStats}>
              <div className={`${styles.resultStat} ${importResult.success ? styles.success : styles.error}`}>
                <span className={styles.resultLabel}>Status:</span>
                <span className={styles.resultValue}>
                  {importResult.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultLabel}>Sites Imported:</span>
                <span className={styles.resultValue}>{importResult.sitesImported}</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultLabel}>Assessments Imported:</span>
                <span className={styles.resultValue}>{importResult.assessmentsImported}</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultLabel}>Skipped Records:</span>
                <span className={styles.resultValue}>{importResult.skippedRecords}</span>
              </div>
            </div>
            
            {importResult.errors.length > 0 && (
              <div className={styles.errors}>
                <h5>Errors:</h5>
                <ul>
                  {importResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {importResult.warnings.length > 0 && (
              <div className={styles.warnings}>
                <h5>Warnings:</h5>
                <ul>
                  {importResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  /**
   * Render validation tab
   */
  const renderValidationTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Data Validation</h3>
        <p>Validate import file format and content without importing data.</p>
        
        <div className={styles.importControls}>
          <input
            type="file"
            accept=".json"
            onChange={handleValidationFileSelect}
            className={styles.fileInput}
            id="validation-file"
          />
          <label htmlFor="validation-file" className={styles.fileLabel}>
            Choose JSON File to Validate
          </label>
        </div>
        
        {isLoading && (
          <div className={styles.loading}>
            <p>Validating file...</p>
          </div>
        )}
        
        {validationResult && (
          <div className={styles.validationResult}>
            <h4>Validation Results</h4>
            <div className={styles.resultStats}>
              <div className={`${styles.resultStat} ${validationResult.success ? styles.success : styles.error}`}>
                <span className={styles.resultLabel}>Validation:</span>
                <span className={styles.resultValue}>
                  {validationResult.success ? 'Passed' : 'Failed'}
                </span>
              </div>
            </div>
            
            {validationResult.errors.length > 0 && (
              <div className={styles.errors}>
                <h5>Validation Errors:</h5>
                <ul>
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.warnings.length > 0 && (
              <div className={styles.warnings}>
                <h5>Validation Warnings:</h5>
                <ul>
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.success && (
              <div className={styles.validationSuccess}>
                <p>✅ File is valid and ready for import!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className={styles.dataManager}>
      <div className={styles.header}>
        <h2>Data Management</h2>
        <p>Export and import heritage site data with comprehensive validation</p>
      </div>
      
      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={() => setError('')} className={styles.closeError}>
            ×
          </button>
        </div>
      )}
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'export' ? styles.active : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export Data
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'import' ? styles.active : ''}`}
          onClick={() => setActiveTab('import')}
        >
          Import Data
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'validation' ? styles.active : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          Validate Data
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'export' && renderExportTab()}
        {activeTab === 'import' && renderImportTab()}
        {activeTab === 'validation' && renderValidationTab()}
      </div>
    </div>
  );
};