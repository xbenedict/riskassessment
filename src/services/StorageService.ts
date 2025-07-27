// Storage Service for local data persistence
// TODO: Replace with real database integration when backend is available

import type { HeritageSite, RiskAssessment, ValidationResult } from '../types';

/**
 * Storage Service for managing local data persistence
 * Provides localStorage wrapper with validation, error handling, and data integrity checks
 * 
 * TODO: Replace with real database integration:
 * 1. PostgreSQL/MongoDB for production data storage
 * 2. Redis for caching frequently accessed data
 * 3. Real-time synchronization with cloud databases
 * 4. Backup and recovery mechanisms
 * 5. Data encryption for sensitive heritage information
 */
export class StorageService {
  
  // Storage keys for different data types
  private static readonly STORAGE_KEYS = {
    HERITAGE_SITES: 'heritage_guardian_sites',
    RISK_ASSESSMENTS: 'heritage_guardian_assessments',
    USER_PREFERENCES: 'heritage_guardian_preferences',
    LAST_SYNC: 'heritage_guardian_last_sync',
    APP_VERSION: 'heritage_guardian_version'
  } as const;

  // Current app version for data migration
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Save data to localStorage with error handling and validation
   * TODO: Replace with database INSERT/UPDATE operations
   */
  static saveToLocalStorage<T>(key: string, data: T): boolean {
    try {
      // Validate data before saving
      const validationResult = this.validateData(key, data);
      if (!validationResult.isValid) {
        console.error('Data validation failed:', validationResult.errors);
        return false;
      }

      // Add metadata for data integrity
      const dataWithMetadata = {
        data,
        timestamp: new Date().toISOString(),
        version: this.CURRENT_VERSION,
        checksum: this.generateChecksum(data)
      };

      const serializedData = JSON.stringify(dataWithMetadata);
      
      // Check localStorage quota
      if (this.isStorageQuotaExceeded(serializedData)) {
        console.warn('localStorage quota exceeded, attempting cleanup');
        this.cleanupOldData();
        
        // Try again after cleanup
        if (this.isStorageQuotaExceeded(serializedData)) {
          throw new Error('Insufficient storage space');
        }
      }

      localStorage.setItem(key, serializedData);
      
      // Update last sync timestamp
      localStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // TODO: Implement fallback storage mechanism or queue for retry
      return false;
    }
  }

  /**
   * Load data from localStorage with validation and error recovery
   * TODO: Replace with database SELECT operations
   */
  static loadFromLocalStorage<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(key);
      if (!serializedData) {
        return null;
      }

      const parsedData = JSON.parse(serializedData);
      
      // Check data integrity
      if (!this.verifyDataIntegrity(parsedData)) {
        console.warn('Data integrity check failed, removing corrupted data');
        localStorage.removeItem(key);
        return null;
      }

      // Check version compatibility
      if (parsedData.version !== this.CURRENT_VERSION) {
        console.info('Data version mismatch, attempting migration');
        const migratedData = this.migrateData(parsedData);
        if (migratedData) {
          this.saveToLocalStorage(key, migratedData.data);
          return migratedData.data;
        } else {
          console.warn('Data migration failed, removing incompatible data');
          localStorage.removeItem(key);
          return null;
        }
      }

      return parsedData.data;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      // TODO: Implement data recovery mechanisms
      return null;
    }
  }

  /**
   * Save heritage sites data
   * TODO: Replace with database operations for heritage sites table
   */
  static saveHeritageSites(sites: HeritageSite[]): boolean {
    return this.saveToLocalStorage(this.STORAGE_KEYS.HERITAGE_SITES, sites);
  }

  /**
   * Load heritage sites data
   * TODO: Replace with database query for heritage sites
   */
  static loadHeritageSites(): HeritageSite[] {
    const sites = this.loadFromLocalStorage<HeritageSite[]>(this.STORAGE_KEYS.HERITAGE_SITES);
    return sites || [];
  }

  /**
   * Save risk assessments data
   * TODO: Replace with database operations for risk assessments table
   */
  static saveRiskAssessments(assessments: RiskAssessment[]): boolean {
    return this.saveToLocalStorage(this.STORAGE_KEYS.RISK_ASSESSMENTS, assessments);
  }

  /**
   * Load risk assessments data
   * TODO: Replace with database query for risk assessments
   */
  static loadRiskAssessments(): RiskAssessment[] {
    const assessments = this.loadFromLocalStorage<RiskAssessment[]>(this.STORAGE_KEYS.RISK_ASSESSMENTS);
    return assessments || [];
  }

  /**
   * Save user preferences
   * TODO: Replace with user preferences table in database
   */
  static saveUserPreferences(preferences: Record<string, any>): boolean {
    return this.saveToLocalStorage(this.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Load user preferences
   * TODO: Replace with database query for user preferences
   */
  static loadUserPreferences(): Record<string, any> {
    const preferences = this.loadFromLocalStorage<Record<string, any>>(this.STORAGE_KEYS.USER_PREFERENCES);
    return preferences || {};
  }

  /**
   * Clear all stored data
   * TODO: Replace with database TRUNCATE operations (with proper authorization)
   */
  static clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.info('All local data cleared successfully');
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  }

  /**
   * Get storage usage statistics
   * TODO: Replace with database storage analytics
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let totalSize = 0;
      Object.values(this.STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });

      // Estimate available space (localStorage typically has 5-10MB limit)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
      const available = Math.max(0, estimatedLimit - totalSize);
      const percentage = (totalSize / estimatedLimit) * 100;

      return {
        used: totalSize,
        available,
        percentage: Math.min(100, percentage)
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Export all data for backup or migration
   * TODO: Replace with database export functionality
   */
  static exportAllData(): string {
    try {
      const exportData = {
        version: this.CURRENT_VERSION,
        exportDate: new Date().toISOString(),
        sites: this.loadHeritageSites(),
        assessments: this.loadRiskAssessments(),
        preferences: this.loadUserPreferences()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Data export failed');
    }
  }

  /**
   * Import data from backup
   * TODO: Replace with database import functionality with proper validation
   */
  static importAllData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      // Validate import data structure
      if (!this.validateImportData(importData)) {
        throw new Error('Invalid import data format');
      }

      // Import each data type
      const success = 
        this.saveHeritageSites(importData.sites || []) &&
        this.saveRiskAssessments(importData.assessments || []) &&
        this.saveUserPreferences(importData.preferences || {});

      if (success) {
        console.info('Data import completed successfully');
      }

      return success;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Private helper methods

  /**
   * Validate data before saving
   * TODO: Implement comprehensive data validation with database constraints
   */
  private static validateData(key: string, data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (data === null || data === undefined) {
      errors.push('Data cannot be null or undefined');
    }

    // Specific validation based on data type
    if (key === this.STORAGE_KEYS.HERITAGE_SITES) {
      if (!Array.isArray(data)) {
        errors.push('Heritage sites data must be an array');
      } else {
        data.forEach((site: any, index: number) => {
          if (!site.id || !site.name || !site.location) {
            errors.push(`Heritage site at index ${index} is missing required fields`);
          }
        });
      }
    }

    if (key === this.STORAGE_KEYS.RISK_ASSESSMENTS) {
      if (!Array.isArray(data)) {
        errors.push('Risk assessments data must be an array');
      } else {
        data.forEach((assessment: any, index: number) => {
          if (!assessment.id || !assessment.siteId || assessment.magnitude === undefined) {
            errors.push(`Risk assessment at index ${index} is missing required fields`);
          }
          if (assessment.magnitude < 3 || assessment.magnitude > 15) {
            warnings.push(`Risk assessment at index ${index} has invalid magnitude value`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate simple checksum for data integrity
   * TODO: Replace with proper cryptographic hash when using real database
   */
  private static generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Verify data integrity using checksum
   * TODO: Replace with database integrity constraints
   */
  private static verifyDataIntegrity(parsedData: any): boolean {
    if (!parsedData.data || !parsedData.checksum) {
      return false;
    }

    const expectedChecksum = this.generateChecksum(parsedData.data);
    return expectedChecksum === parsedData.checksum;
  }

  /**
   * Check if localStorage quota would be exceeded
   */
  private static isStorageQuotaExceeded(newData: string): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, newData);
      localStorage.removeItem(testKey);
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Clean up old data to free storage space
   * TODO: Implement intelligent data archiving with database
   */
  private static cleanupOldData(): void {
    try {
      // Remove old temporary data or implement LRU cache cleanup
      const storageInfo = this.getStorageInfo();
      if (storageInfo.percentage > 80) {
        console.warn('Storage usage high, consider implementing data archiving');
        // TODO: Implement data archiving strategy
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  /**
   * Migrate data between versions
   * TODO: Implement proper database migration scripts
   */
  private static migrateData(oldData: any): any {
    try {
      // Simple version migration logic
      // TODO: Implement comprehensive migration strategies for database schema changes
      if (oldData.version === '0.9.0') {
        // Example migration from version 0.9.0 to 1.0.0
        return {
          data: oldData.data,
          version: this.CURRENT_VERSION
        };
      }
      return null;
    } catch (error) {
      console.error('Data migration failed:', error);
      return null;
    }
  }

  /**
   * Validate imported data structure
   * TODO: Implement comprehensive import validation with database constraints
   */
  private static validateImportData(importData: any): boolean {
    return (
      importData &&
      typeof importData === 'object' &&
      importData.version &&
      (Array.isArray(importData.sites) || importData.sites === undefined) &&
      (Array.isArray(importData.assessments) || importData.assessments === undefined) &&
      (typeof importData.preferences === 'object' || importData.preferences === undefined)
    );
  }
}