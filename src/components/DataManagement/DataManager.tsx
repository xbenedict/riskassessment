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
import { Icon, Button, Card, Loading } from '../UI';
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
  const validationFileInputRef = useRef<HTMLInputElement>(null);
  
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
      <Card padding="large" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Icon name="download" size="lg" className={styles.sectionIcon} />
          <div>
            <h3>Full Data Export</h3>
            <p>Export all heritage sites and risk assessments in JSON format.</p>
          </div>
        </div>
        
        <div className={styles.exportStats}>
          <Card variant="outlined" padding="medium" className={styles.stat}>
            <Icon name="map-pin" size="md" className={styles.statIcon} />
            <span className={styles.statValue}>{sites.length}</span>
            <span className={styles.statLabel}>Heritage Sites</span>
          </Card>
          <Card variant="outlined" padding="medium" className={styles.stat}>
            <Icon name="shield-alert" size="md" className={styles.statIcon} />
            <span className={styles.statValue}>{assessments.length}</span>
            <span className={styles.statLabel}>Risk Assessments</span>
          </Card>
        </div>
        
        <Button 
          onClick={handleFullExport} 
          icon="download"
          size="large"
          fullWidth
        >
          Export All Data
        </Button>
      </Card>
      
      <Card padding="large" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Icon name="check-square" size="lg" className={styles.sectionIcon} />
          <div>
            <h3>Selective Export</h3>
            <p>Choose specific heritage sites to export with their assessments.</p>
          </div>
        </div>
        
        <div className={styles.selectionControls}>
          <Button 
            onClick={() => handleSelectAll(true)} 
            variant="secondary"
            icon="check-square"
            size="small"
          >
            Select All
          </Button>
          <Button 
            onClick={() => handleSelectAll(false)} 
            variant="ghost"
            icon="square"
            size="small"
          >
            Select None
          </Button>
          <span className={styles.selectionCount}>
            <Icon name="info" size="sm" />
            {selectedSiteIds.length} of {sites.length} selected
          </span>
        </div>
        
        <Card variant="outlined" padding="none" className={styles.siteList}>
          {sites.map(site => (
            <div key={site.id} className={styles.siteItem}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedSiteIds.includes(site.id)}
                  onChange={(e) => handleSiteSelectionChange(site.id, e.target.checked)}
                />
                <div className={styles.siteInfo}>
                  <Icon name="map-pin" size="sm" className={styles.siteIcon} />
                  <div>
                    <span className={styles.siteName}>{site.name}</span>
                    <span className={styles.siteLocation}>{site.location.country}</span>
                  </div>
                </div>
              </label>
              <Button
                onClick={() => handleSiteExport(site.id)}
                variant="ghost"
                size="small"
                icon="download"
              >
                Export
              </Button>
            </div>
          ))}
        </Card>
        
        <Button 
          onClick={handleSelectiveExport}
          disabled={selectedSiteIds.length === 0}
          icon="download"
          size="large"
          fullWidth
        >
          Export Selected Sites ({selectedSiteIds.length})
        </Button>
      </Card>
    </div>
  );
  
  /**
   * Render import tab
   */
  const renderImportTab = () => (
    <div className={styles.tabContent}>
      <Card padding="large" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Icon name="upload" size="lg" className={styles.sectionIcon} />
          <div>
            <h3>Import Heritage Data</h3>
            <p>Import heritage sites and risk assessments from JSON file.</p>
          </div>
        </div>
        
        <div className={styles.importControls}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="import-file"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            icon="file-plus"
            size="large"
            fullWidth
          >
            Choose JSON File
          </Button>
          
          <Button 
            onClick={handleDownloadSample} 
            variant="ghost"
            icon="download"
            size="medium"
            fullWidth
          >
            Download Sample File
          </Button>
        </div>
        
        {isLoading && (
          <Loading 
            variant="container" 
            message="Processing import..." 
            size="large"
          />
        )}
        
        {importResult && (
          <Card variant="outlined" padding="large" className={styles.importResult}>
            <div className={styles.resultHeader}>
              <Icon 
                name={importResult.success ? "check-circle" : "x-circle"} 
                size="lg" 
                className={importResult.success ? styles.successIcon : styles.errorIcon}
              />
              <h4>Import Results</h4>
            </div>
            
            <div className={styles.resultStats}>
              <Card variant="outlined" padding="medium" className={`${styles.resultStat} ${importResult.success ? styles.success : styles.error}`}>
                <Icon name={importResult.success ? "check-circle" : "x-circle"} size="sm" />
                <div>
                  <span className={styles.resultLabel}>Status</span>
                  <span className={styles.resultValue}>
                    {importResult.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </Card>
              
              <Card variant="outlined" padding="medium" className={styles.resultStat}>
                <Icon name="map-pin" size="sm" />
                <div>
                  <span className={styles.resultLabel}>Sites Imported</span>
                  <span className={styles.resultValue}>{importResult.sitesImported}</span>
                </div>
              </Card>
              
              <Card variant="outlined" padding="medium" className={styles.resultStat}>
                <Icon name="shield-alert" size="sm" />
                <div>
                  <span className={styles.resultLabel}>Assessments Imported</span>
                  <span className={styles.resultValue}>{importResult.assessmentsImported}</span>
                </div>
              </Card>
              
              <Card variant="outlined" padding="medium" className={styles.resultStat}>
                <Icon name="skip-forward" size="sm" />
                <div>
                  <span className={styles.resultLabel}>Skipped Records</span>
                  <span className={styles.resultValue}>{importResult.skippedRecords}</span>
                </div>
              </Card>
            </div>
            
            {importResult.errors.length > 0 && (
              <Card variant="outlined" padding="medium" className={styles.errors}>
                <div className={styles.messageHeader}>
                  <Icon name="alert-triangle" size="md" />
                  <h5>Errors</h5>
                </div>
                <ul>
                  {importResult.errors.map((error, index) => (
                    <li key={index}>
                      <Icon name="x-circle" size="sm" />
                      {error}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            
            {importResult.warnings.length > 0 && (
              <Card variant="outlined" padding="medium" className={styles.warnings}>
                <div className={styles.messageHeader}>
                  <Icon name="alert-circle" size="md" />
                  <h5>Warnings</h5>
                </div>
                <ul>
                  {importResult.warnings.map((warning, index) => (
                    <li key={index}>
                      <Icon name="alert-triangle" size="sm" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </Card>
        )}
      </Card>
    </div>
  );
  
  /**
   * Render validation tab
   */
  const renderValidationTab = () => (
    <div className={styles.tabContent}>
      <Card padding="large" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Icon name="shield-check" size="lg" className={styles.sectionIcon} />
          <div>
            <h3>Data Validation</h3>
            <p>Validate import file format and content without importing data.</p>
          </div>
        </div>
        
        <div className={styles.importControls}>
          <input
            ref={validationFileInputRef}
            type="file"
            accept=".json"
            onChange={handleValidationFileSelect}
            className={styles.fileInput}
            id="validation-file"
          />
          <Button 
            onClick={() => validationFileInputRef.current?.click()}
            variant="secondary"
            icon="shield-check"
            size="large"
            fullWidth
          >
            Choose JSON File to Validate
          </Button>
        </div>
        
        {isLoading && (
          <Loading 
            variant="container" 
            message="Validating file..." 
            size="large"
          />
        )}
        
        {validationResult && (
          <Card variant="outlined" padding="large" className={styles.validationResult}>
            <div className={styles.resultHeader}>
              <Icon 
                name={validationResult.success ? "shield-check" : "shield-x"} 
                size="lg" 
                className={validationResult.success ? styles.successIcon : styles.errorIcon}
              />
              <h4>Validation Results</h4>
            </div>
            
            <Card variant="outlined" padding="medium" className={`${styles.resultStat} ${validationResult.success ? styles.success : styles.error}`}>
              <Icon name={validationResult.success ? "check-circle" : "x-circle"} size="sm" />
              <div>
                <span className={styles.resultLabel}>Validation</span>
                <span className={styles.resultValue}>
                  {validationResult.success ? 'Passed' : 'Failed'}
                </span>
              </div>
            </Card>
            
            {validationResult.errors.length > 0 && (
              <Card variant="outlined" padding="medium" className={styles.errors}>
                <div className={styles.messageHeader}>
                  <Icon name="alert-triangle" size="md" />
                  <h5>Validation Errors</h5>
                </div>
                <ul>
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>
                      <Icon name="x-circle" size="sm" />
                      {error}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            
            {validationResult.warnings.length > 0 && (
              <Card variant="outlined" padding="medium" className={styles.warnings}>
                <div className={styles.messageHeader}>
                  <Icon name="alert-circle" size="md" />
                  <h5>Validation Warnings</h5>
                </div>
                <ul>
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>
                      <Icon name="alert-triangle" size="sm" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            
            {validationResult.success && (
              <Card variant="outlined" padding="medium" className={styles.validationSuccess}>
                <div className={styles.successMessage}>
                  <Icon name="check-circle" size="md" />
                  <p>File is valid and ready for import!</p>
                </div>
              </Card>
            )}
          </Card>
        )}
      </Card>
    </div>
  );
  
  return (
    <div className={styles.dataManager}>
      <Card padding="large" className={styles.header}>
        <div className={styles.headerContent}>
          <Icon name="database" size="xl" className={styles.headerIcon} />
          <div>
            <h2>Data Management</h2>
            <p>Export and import heritage site data with comprehensive validation</p>
          </div>
        </div>
      </Card>
      
      {error && (
        <Card variant="outlined" padding="medium" className={styles.error}>
          <div className={styles.errorContent}>
            <Icon name="alert-triangle" size="md" className={styles.errorIcon} />
            <p>{error}</p>
            <Button
              onClick={() => setError('')}
              variant="ghost"
              size="small"
              icon="x"
              className={styles.closeError}
            />
          </div>
        </Card>
      )}
      
      <Card padding="none" className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'export' ? styles.active : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Icon name="download" size="sm" />
            Export Data
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'import' ? styles.active : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <Icon name="upload" size="sm" />
            Import Data
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'validation' ? styles.active : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            <Icon name="shield-check" size="sm" />
            Validate Data
          </button>
        </div>
      </Card>
      
      <div className={styles.content}>
        {activeTab === 'export' && renderExportTab()}
        {activeTab === 'import' && renderImportTab()}
        {activeTab === 'validation' && renderValidationTab()}
      </div>
    </div>
  );
};