// Data Export and Import Service for heritage risk assessment data
// Provides comprehensive data management capabilities with validation

import type { 
  HeritageSite, 
  RiskAssessment, 
  ValidationResult,
  ThreatType,
  RiskPriority,
  UncertaintyLevel,
  SiteStatus 
} from '../types';

/**
 * Export data structure for complete system backup
 */
export interface ExportData {
  metadata: {
    exportDate: string;
    version: string;
    source: string;
    totalSites: number;
    totalAssessments: number;
  };
  sites: HeritageSite[];
  assessments: RiskAssessment[];
}

/**
 * Import result with validation feedback
 */
export interface ImportResult {
  success: boolean;
  sitesImported: number;
  assessmentsImported: number;
  errors: string[];
  warnings: string[];
  skippedRecords: number;
  duplicatesFound: number;
}

/**
 * Data validation schema for import validation
 */
interface ValidationSchema {
  sites: {
    required: (keyof HeritageSite)[];
    optional: (keyof HeritageSite)[];
    types: Record<keyof HeritageSite, string>;
  };
  assessments: {
    required: (keyof RiskAssessment)[];
    optional: (keyof RiskAssessment)[];
    types: Record<keyof RiskAssessment, string>;
  };
}

/**
 * Data Export and Import Service
 * Provides comprehensive data management capabilities for heritage risk assessment data
 * 
 * TODO: For production deployment:
 * - Add encryption for sensitive heritage site data
 * - Implement incremental export/import for large datasets
 * - Add support for multiple file formats (XML, CSV with relationships)
 * - Include digital signatures for data integrity verification
 * - Add compression for large export files
 * - Implement real-time API synchronization
 * - Add audit logging for all import/export operations
 */
export class DataExportImportService {
  
  private static readonly EXPORT_VERSION = '1.0.0';
  private static readonly SUPPORTED_FORMATS = ['json'] as const;
  
  /**
   * Validation schema for data import
   */
  private static readonly validationSchema: ValidationSchema = {
    sites: {
      required: ['id', 'name', 'location', 'description', 'significance', 'currentStatus'],
      optional: ['lastAssessment', 'riskProfile', 'images', 'createdAt', 'updatedAt'],
      types: {
        id: 'string',
        name: 'string',
        location: 'object',
        description: 'string',
        significance: 'string',
        currentStatus: 'string',
        lastAssessment: 'date',
        riskProfile: 'object',
        images: 'array',
        createdAt: 'date',
        updatedAt: 'date'
      }
    },
    assessments: {
      required: ['id', 'siteId', 'threatType', 'probability', 'lossOfValue', 'fractionAffected', 'magnitude', 'priority'],
      optional: ['uncertaintyLevel', 'assessmentDate', 'assessor', 'notes'],
      types: {
        id: 'string',
        siteId: 'string',
        threatType: 'string',
        probability: 'number',
        lossOfValue: 'number',
        fractionAffected: 'number',
        magnitude: 'number',
        priority: 'string',
        uncertaintyLevel: 'string',
        assessmentDate: 'date',
        assessor: 'string',
        notes: 'string'
      }
    }
  };
  
  /**
   * Export all heritage sites and risk assessments to JSON format
   * @param sites Heritage sites to export
   * @param assessments Risk assessments to export
   * @param source Source system identifier
   * @returns Export data structure
   */
  static exportData(
    sites: HeritageSite[], 
    assessments: RiskAssessment[], 
    source: string = 'Heritage Guardian System'
  ): ExportData {
    return {
      metadata: {
        exportDate: new Date().toISOString(),
        version: this.EXPORT_VERSION,
        source,
        totalSites: sites.length,
        totalAssessments: assessments.length
      },
      sites: sites.map(site => ({
        ...site,
        lastAssessment: site.lastAssessment,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
        riskProfile: {
          ...site.riskProfile,
          lastUpdated: site.riskProfile.lastUpdated
        }
      })),
      assessments: assessments.map(assessment => ({
        ...assessment,
        assessmentDate: assessment.assessmentDate
      }))
    };
  }
  
  /**
   * Export data as downloadable JSON file
   * @param sites Heritage sites to export
   * @param assessments Risk assessments to export
   * @param filename Optional filename for the export
   * @param source Source system identifier
   */
  static exportToFile(
    sites: HeritageSite[], 
    assessments: RiskAssessment[], 
    filename?: string,
    source?: string
  ): void {
    const exportData = this.exportData(sites, assessments, source);
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `heritage-data-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Export specific site data with its assessments
   * @param site Heritage site to export
   * @param assessments Risk assessments for the site
   * @param filename Optional filename
   */
  static exportSiteData(
    site: HeritageSite, 
    assessments: RiskAssessment[], 
    filename?: string
  ): void {
    const siteAssessments = assessments.filter(a => a.siteId === site.id);
    const exportData = this.exportData([site], siteAssessments, 'Heritage Guardian System');
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${site.name.replace(/\s+/g, '-')}-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Validate import data structure and content
   * @param data Raw import data
   * @returns Validation result with errors and warnings
   */
  static validateImportData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check basic structure
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Invalid data format: Expected JSON object'],
        warnings: []
      };
    }
    
    // Check metadata
    if (!data.metadata) {
      warnings.push('Missing metadata section');
    } else {
      if (!data.metadata.exportDate) {
        warnings.push('Missing export date in metadata');
      }
      if (!data.metadata.version) {
        warnings.push('Missing version in metadata');
      }
    }
    
    // Check sites array
    if (!Array.isArray(data.sites)) {
      errors.push('Sites data must be an array');
    } else {
      data.sites.forEach((site: any, index: number) => {
        const siteValidation = this.validateSite(site);
        if (!siteValidation.isValid) {
          errors.push(`Site ${index + 1}: ${siteValidation.errors.join(', ')}`);
        }
        warnings.push(...siteValidation.warnings.map(w => `Site ${index + 1}: ${w}`));
      });
    }
    
    // Check assessments array
    if (!Array.isArray(data.assessments)) {
      errors.push('Assessments data must be an array');
    } else {
      data.assessments.forEach((assessment: any, index: number) => {
        const assessmentValidation = this.validateAssessment(assessment);
        if (!assessmentValidation.isValid) {
          errors.push(`Assessment ${index + 1}: ${assessmentValidation.errors.join(', ')}`);
        }
        warnings.push(...assessmentValidation.warnings.map(w => `Assessment ${index + 1}: ${w}`));
      });
    }
    
    // Check referential integrity
    if (Array.isArray(data.sites) && Array.isArray(data.assessments)) {
      const siteIds = new Set(data.sites.map((s: any) => s.id));
      data.assessments.forEach((assessment: any, index: number) => {
        if (assessment.siteId && !siteIds.has(assessment.siteId)) {
          errors.push(`Assessment ${index + 1}: References non-existent site ID ${assessment.siteId}`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validate individual heritage site data
   * @param site Site data to validate
   * @returns Validation result
   */
  private static validateSite(site: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const schema = this.validationSchema.sites;
    
    // Check required fields
    schema.required.forEach(field => {
      if (site[field] === undefined || site[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Validate specific fields
    if (site.id && typeof site.id !== 'string') {
      errors.push('Site ID must be a string');
    }
    
    if (site.name && typeof site.name !== 'string') {
      errors.push('Site name must be a string');
    }
    
    if (site.location) {
      if (typeof site.location !== 'object') {
        errors.push('Location must be an object');
      } else {
        if (typeof site.location.latitude !== 'number') {
          errors.push('Location latitude must be a number');
        }
        if (typeof site.location.longitude !== 'number') {
          errors.push('Location longitude must be a number');
        }
        if (!site.location.address || typeof site.location.address !== 'string') {
          errors.push('Location address must be a string');
        }
        if (!site.location.country || typeof site.location.country !== 'string') {
          errors.push('Location country must be a string');
        }
      }
    }
    
    if (site.currentStatus) {
      const validStatuses: SiteStatus[] = ['active', 'at-risk', 'critical', 'stable'];
      if (!validStatuses.includes(site.currentStatus)) {
        errors.push(`Invalid site status: ${site.currentStatus}`);
      }
    }
    
    // Validate dates
    if (site.lastAssessment) {
      const date = new Date(site.lastAssessment);
      if (isNaN(date.getTime())) {
        errors.push('Invalid lastAssessment date format');
      }
    }
    
    if (site.createdAt) {
      const date = new Date(site.createdAt);
      if (isNaN(date.getTime())) {
        errors.push('Invalid createdAt date format');
      }
    }
    
    if (site.updatedAt) {
      const date = new Date(site.updatedAt);
      if (isNaN(date.getTime())) {
        errors.push('Invalid updatedAt date format');
      }
    }
    
    // Validate risk profile
    if (site.riskProfile) {
      if (typeof site.riskProfile !== 'object') {
        errors.push('Risk profile must be an object');
      } else {
        const validPriorities: RiskPriority[] = ['extremely-high', 'very-high', 'high', 'medium-high', 'low'];
        if (site.riskProfile.overallRisk && !validPriorities.includes(site.riskProfile.overallRisk)) {
          errors.push(`Invalid overall risk priority: ${site.riskProfile.overallRisk}`);
        }
        
        if (site.riskProfile.lastUpdated) {
          const date = new Date(site.riskProfile.lastUpdated);
          if (isNaN(date.getTime())) {
            errors.push('Invalid risk profile lastUpdated date format');
          }
        }
        
        if (site.riskProfile.activeThreats && !Array.isArray(site.riskProfile.activeThreats)) {
          errors.push('Active threats must be an array');
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validate individual risk assessment data
   * @param assessment Assessment data to validate
   * @returns Validation result
   */
  private static validateAssessment(assessment: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const schema = this.validationSchema.assessments;
    
    // Check required fields
    schema.required.forEach(field => {
      if (assessment[field] === undefined || assessment[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Validate ABC scale components
    if (assessment.probability !== undefined) {
      if (!Number.isInteger(assessment.probability) || assessment.probability < 1 || assessment.probability > 5) {
        errors.push('Probability must be an integer between 1 and 5');
      }
    }
    
    if (assessment.lossOfValue !== undefined) {
      if (!Number.isInteger(assessment.lossOfValue) || assessment.lossOfValue < 1 || assessment.lossOfValue > 5) {
        errors.push('Loss of Value must be an integer between 1 and 5');
      }
    }
    
    if (assessment.fractionAffected !== undefined) {
      if (!Number.isInteger(assessment.fractionAffected) || assessment.fractionAffected < 1 || assessment.fractionAffected > 5) {
        errors.push('Fraction Affected must be an integer between 1 and 5');
      }
    }
    
    // Validate magnitude calculation
    if (assessment.probability && assessment.lossOfValue && assessment.fractionAffected) {
      const expectedMagnitude = assessment.probability + assessment.lossOfValue + assessment.fractionAffected;
      if (assessment.magnitude !== expectedMagnitude) {
        warnings.push(`Magnitude mismatch: expected ${expectedMagnitude}, got ${assessment.magnitude}`);
      }
    }
    
    // Validate threat type
    if (assessment.threatType) {
      const validThreats: ThreatType[] = [
        'earthquake', 'flooding', 'weathering', 'vegetation', 'urban-development',
        'tourism-pressure', 'looting', 'conflict', 'climate-change'
      ];
      if (!validThreats.includes(assessment.threatType)) {
        errors.push(`Invalid threat type: ${assessment.threatType}`);
      }
    }
    
    // Validate priority
    if (assessment.priority) {
      const validPriorities: RiskPriority[] = ['extremely-high', 'very-high', 'high', 'medium-high', 'low'];
      if (!validPriorities.includes(assessment.priority)) {
        errors.push(`Invalid priority: ${assessment.priority}`);
      }
    }
    
    // Validate uncertainty level
    if (assessment.uncertaintyLevel) {
      const validUncertainty: UncertaintyLevel[] = ['low', 'medium', 'high'];
      if (!validUncertainty.includes(assessment.uncertaintyLevel)) {
        errors.push(`Invalid uncertainty level: ${assessment.uncertaintyLevel}`);
      }
    }
    
    // Validate assessment date
    if (assessment.assessmentDate) {
      const date = new Date(assessment.assessmentDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid assessment date format');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Import data from JSON structure with validation and error handling
   * @param data Import data structure
   * @param options Import options
   * @returns Import result with statistics and errors
   */
  static async importData(
    data: any,
    options: {
      skipDuplicates?: boolean;
      updateExisting?: boolean;
      validateOnly?: boolean;
    } = {}
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      sitesImported: 0,
      assessmentsImported: 0,
      errors: [],
      warnings: [],
      skippedRecords: 0,
      duplicatesFound: 0
    };
    
    // Validate data structure
    const validation = this.validateImportData(data);
    result.errors.push(...validation.errors);
    result.warnings.push(...validation.warnings);
    
    if (!validation.isValid) {
      return result;
    }
    
    if (options.validateOnly) {
      result.success = true;
      return result;
    }
    
    try {
      // TODO: In a real implementation, this would interact with a database or API
      // For now, we'll simulate the import process
      
      // Process sites
      if (Array.isArray(data.sites)) {
        for (const siteData of data.sites) {
          try {
            // Convert date strings back to Date objects
            const site: HeritageSite = {
              ...siteData,
              lastAssessment: new Date(siteData.lastAssessment),
              createdAt: new Date(siteData.createdAt),
              updatedAt: new Date(siteData.updatedAt),
              riskProfile: {
                ...siteData.riskProfile,
                lastUpdated: new Date(siteData.riskProfile.lastUpdated)
              }
            };
            
            // TODO: Check for duplicates and handle according to options
            // TODO: Save to storage service or database
            
            result.sitesImported++;
          } catch (error) {
            result.errors.push(`Failed to import site ${siteData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            result.skippedRecords++;
          }
        }
      }
      
      // Process assessments
      if (Array.isArray(data.assessments)) {
        for (const assessmentData of data.assessments) {
          try {
            // Convert date strings back to Date objects
            const assessment: RiskAssessment = {
              ...assessmentData,
              assessmentDate: new Date(assessmentData.assessmentDate)
            };
            
            // TODO: Check for duplicates and handle according to options
            // TODO: Save to storage service or database
            
            result.assessmentsImported++;
          } catch (error) {
            result.errors.push(`Failed to import assessment ${assessmentData.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            result.skippedRecords++;
          }
        }
      }
      
      result.success = result.errors.length === 0;
      
    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  /**
   * Import data from uploaded file
   * @param file File to import
   * @param options Import options
   * @returns Promise resolving to import result
   */
  static async importFromFile(
    file: File,
    options: {
      skipDuplicates?: boolean;
      updateExisting?: boolean;
      validateOnly?: boolean;
    } = {}
  ): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          const result = await this.importData(data, options);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            sitesImported: 0,
            assessmentsImported: 0,
            errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Invalid JSON format'}`],
            warnings: [],
            skippedRecords: 0,
            duplicatesFound: 0
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          sitesImported: 0,
          assessmentsImported: 0,
          errors: ['Failed to read file'],
          warnings: [],
          skippedRecords: 0,
          duplicatesFound: 0
        });
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Generate sample export data for testing and demonstration
   * @returns Sample export data structure
   */
  static generateSampleExportData(): ExportData {
    const sampleSite: HeritageSite = {
      id: 'sample-site-001',
      name: 'Sample Heritage Site',
      location: {
        latitude: 32.0833,
        longitude: 36.3167,
        address: 'Sample Address, Sample City',
        country: 'Sample Country'
      },
      description: 'This is a sample heritage site for demonstration purposes.',
      significance: 'Sample significance description for testing import/export functionality.',
      currentStatus: 'active',
      lastAssessment: new Date('2024-01-15'),
      riskProfile: {
        overallRisk: 'medium-high',
        lastUpdated: new Date('2024-01-15'),
        activeThreats: ['weathering', 'tourism-pressure']
      },
      images: ['sample-image-1.jpg', 'sample-image-2.jpg'],
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-01-15')
    };
    
    const sampleAssessment: RiskAssessment = {
      id: 'sample-assessment-001',
      siteId: 'sample-site-001',
      threatType: 'weathering',
      probability: 3,
      lossOfValue: 4,
      fractionAffected: 2,
      magnitude: 9,
      priority: 'high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-15'),
      assessor: 'Sample Assessor',
      notes: 'Sample assessment notes for demonstration purposes.'
    };
    
    return this.exportData([sampleSite], [sampleAssessment], 'Sample Data Generator');
  }
  
  /**
   * Download sample export file for testing
   */
  static downloadSampleData(): void {
    const sampleData = this.generateSampleExportData();
    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'heritage-sample-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}