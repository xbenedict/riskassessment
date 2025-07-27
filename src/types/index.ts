// Core data model interfaces for Heritage Guardian application
// These types define the structure for heritage site risk assessment data

/**
 * Threat types that can affect heritage sites
 * TODO: When integrating with real APIs, these values should match
 * the threat classification system used by your data sources
 */
export const ThreatType = {
  EARTHQUAKE: 'earthquake',
  FLOODING: 'flooding',
  WEATHERING: 'weathering',
  VEGETATION: 'vegetation',
  URBAN_DEVELOPMENT: 'urban-development',
  TOURISM_PRESSURE: 'tourism-pressure',
  LOOTING: 'looting',
  CONFLICT: 'conflict',
  CLIMATE_CHANGE: 'climate-change'
} as const;

export type ThreatType = typeof ThreatType[keyof typeof ThreatType];

/**
 * Current operational status of a heritage site
 * TODO: Extend with additional statuses as needed for your organization
 */
export type SiteStatus = 'active' | 'at-risk' | 'critical' | 'stable';

/**
 * Risk priority levels based on ABC scale methodology
 * These correspond to the calculated magnitude ranges:
 * - extremely-high: 13-15
 * - very-high: 10-12
 * - high: 7-9
 * - medium-high: 4-6
 * - low: 3
 */
export type RiskPriority = 'extremely-high' | 'very-high' | 'high' | 'medium-high' | 'low';

/**
 * Uncertainty levels for risk assessments
 * Used to apply uncertainty matrix adjustments to priority recommendations
 */
export type UncertaintyLevel = 'low' | 'medium' | 'high';

/**
 * Geographic location information for heritage sites
 * TODO: When integrating with real APIs, consider adding:
 * - elevation: number (for flood risk calculations)
 * - region: string (for regional threat analysis)
 * - coordinateSystem: string (for different mapping systems)
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  country: string;
}

/**
 * Current risk profile summary for a heritage site
 * TODO: When integrating with real-time data sources:
 * - Add confidence: number (0-1) for overall risk confidence
 * - Add dataSource: string to track where risk data originated
 * - Add nextAssessmentDue: Date for scheduling
 */
export interface RiskProfile {
  overallRisk: RiskPriority;
  lastUpdated: Date;
  activeThreats: ThreatType[];
}

/**
 * Complete heritage site information
 * TODO: For real API integration, consider adding:
 * - externalId: string (for mapping to external databases)
 * - unescoId?: string (for UNESCO World Heritage sites)
 * - managingOrganization: string
 * - publicAccess: boolean
 * - visitorsPerYear?: number
 * - conservationBudget?: number
 * - lastInspectionDate: Date
 */
export interface HeritageSite {
  id: string;
  name: string;
  location: Location;
  description: string;
  significance: string;
  currentStatus: SiteStatus;
  lastAssessment: Date;
  riskProfile: RiskProfile;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Individual risk assessment following ABC scale methodology
 * A = Probability (1-5), B = Loss of Value (1-5), C = Fraction Affected (1-5)
 * Magnitude = A + B + C (range: 3-15)
 * 
 * TODO: For real API integration, consider adding:
 * - evidenceLinks: string[] (URLs to supporting documentation)
 * - reviewStatus: 'draft' | 'reviewed' | 'approved'
 * - reviewedBy?: string
 * - mitigationMeasures: string[]
 * - costEstimate?: number
 * - timeframe: string (immediate, short-term, long-term)
 * - dataQuality: 'high' | 'medium' | 'low'
 */
export interface RiskAssessment {
  id: string;
  siteId: string;
  threatType: ThreatType;
  probability: number; // A component (1-5)
  lossOfValue: number; // B component (1-5)
  fractionAffected: number; // C component (1-5)
  magnitude: number; // A + B + C
  priority: RiskPriority;
  uncertaintyLevel: UncertaintyLevel;
  assessmentDate: Date;
  assessor: string;
  notes: string;
}

// Additional utility types for the application

/**
 * Chart data structure for visualization components
 * Compatible with Chart.js data format
 * TODO: For real-time data integration:
 * - Add metadata: { lastUpdated: Date, dataSource: string }
 * - Add refreshInterval: number (for auto-refresh charts)
 * - Consider adding chartType: string for dynamic chart selection
 */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

/**
 * Map marker data for geographic visualizations
 * Compatible with Leaflet marker format
 * TODO: For enhanced mapping features:
 * - Add popup: string (HTML content for marker popups)
 * - Add icon: string (custom icon based on threat type)
 * - Add cluster: boolean (for marker clustering)
 * - Add lastUpdated: Date (for data freshness indicators)
 */
export interface MapMarker {
  id: string;
  position: [number, number];
  riskLevel: RiskPriority;
  siteName: string;
}

/**
 * API response wrapper for external data integration
 * TODO: Use this structure when integrating with Firecrawl MCP or other APIs
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
  source?: string;
}

/**
 * Search and filter parameters for data queries
 * TODO: Extend for advanced search capabilities with external APIs
 */
export interface SearchFilters {
  country?: string;
  threatTypes?: ThreatType[];
  riskPriority?: RiskPriority[];
  status?: SiteStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

/**
 * Data validation result structure
 * Used for validating imported data and API responses
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}