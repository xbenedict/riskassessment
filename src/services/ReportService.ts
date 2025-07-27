// Report Service for generating standardized heritage risk assessment reports
// Following international heritage guidelines and best practices

import type { 
  HeritageSite, 
  RiskAssessment, 
  RiskPriority,
  ThreatType 
} from '../types';
import { RiskCalculator } from '../utils/RiskCalculator';

/**
 * Report data structure for standardized risk assessment reports
 */
export interface RiskAssessmentReport {
  id: string;
  site: HeritageSite;
  assessments: RiskAssessment[];
  summary: ReportSummary;
  recommendations: string[];
  generatedAt: Date;
  generatedBy: string;
  reportType: 'site-specific' | 'comparative' | 'executive-summary';
}

/**
 * Summary statistics for risk assessment reports
 */
export interface ReportSummary {
  totalThreats: number;
  highestRisk: RiskPriority;
  averageMagnitude: number;
  threatDistribution: Record<ThreatType, number>;
  priorityDistribution: Record<RiskPriority, number>;
  lastAssessmentDate: Date;
  urgentActions: number;
}

/**
 * Comparative analysis data for multi-site reports
 */
export interface ComparativeAnalysis {
  sites: HeritageSite[];
  riskComparison: {
    siteId: string;
    siteName: string;
    overallRisk: RiskPriority;
    totalAssessments: number;
    averageMagnitude: number;
    urgentThreats: number;
  }[];
  regionalTrends: {
    country: string;
    averageRisk: number;
    commonThreats: ThreatType[];
  }[];
}

/**
 * Report Service for generating standardized heritage risk assessment reports
 * Following ICCROM, UNESCO, and ICOMOS guidelines for heritage risk management
 * 
 * TODO: For production deployment:
 * - Add PDF generation using libraries like jsPDF or Puppeteer
 * - Integrate with Excel export using libraries like xlsx
 * - Add report templates for different stakeholder audiences
 * - Include multilingual support for international use
 * - Add digital signatures for official reports
 */
export class ReportService {
  
  /**
   * Generate a comprehensive site-specific risk assessment report
   * Following international heritage guidelines (ICCROM, UNESCO)
   * @param site Heritage site data
   * @param assessments Risk assessments for the site
   * @param generatedBy Report author/organization
   * @returns Standardized risk assessment report
   */
  static generateSiteReport(
    site: HeritageSite, 
    assessments: RiskAssessment[], 
    generatedBy: string = 'Heritage Guardian System'
  ): RiskAssessmentReport {
    const summary = this.calculateReportSummary(assessments);
    const recommendations = this.generateRecommendations(site, assessments);
    
    return {
      id: `report-${site.id}-${Date.now()}`,
      site,
      assessments: assessments.sort((a, b) => 
        RiskCalculator.getPriorityWeight(b.priority) - RiskCalculator.getPriorityWeight(a.priority)
      ),
      summary,
      recommendations,
      generatedAt: new Date(),
      generatedBy,
      reportType: 'site-specific'
    };
  }
  
  /**
   * Generate comparative analysis report for multiple sites
   * Useful for regional planning and resource allocation
   * @param sites Array of heritage sites to compare
   * @param allAssessments All risk assessments for the sites
   * @param generatedBy Report author/organization
   * @returns Comparative analysis report
   */
  static generateComparativeReport(
    sites: HeritageSite[], 
    allAssessments: RiskAssessment[], 
    generatedBy: string = 'Heritage Guardian System'
  ): ComparativeAnalysis {
    const riskComparison = sites.map(site => {
      const siteAssessments = allAssessments.filter(a => a.siteId === site.id);
      const averageMagnitude = siteAssessments.length > 0 
        ? siteAssessments.reduce((sum, a) => sum + a.magnitude, 0) / siteAssessments.length 
        : 0;
      const urgentThreats = siteAssessments.filter(a => 
        a.priority === 'extremely-high' || a.priority === 'very-high'
      ).length;
      
      return {
        siteId: site.id,
        siteName: site.name,
        overallRisk: site.riskProfile.overallRisk,
        totalAssessments: siteAssessments.length,
        averageMagnitude: Math.round(averageMagnitude * 100) / 100,
        urgentThreats
      };
    });
    
    // Calculate regional trends by country
    const countryGroups = sites.reduce((groups, site) => {
      const country = site.location.country;
      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(site);
      return groups;
    }, {} as Record<string, HeritageSite[]>);
    
    const regionalTrends = Object.entries(countryGroups).map(([country, countrySites]) => {
      const countryAssessments = allAssessments.filter(a => 
        countrySites.some(site => site.id === a.siteId)
      );
      
      const averageRisk = countryAssessments.length > 0
        ? countryAssessments.reduce((sum, a) => sum + a.magnitude, 0) / countryAssessments.length
        : 0;
      
      // Find most common threats in this country
      const threatCounts = countryAssessments.reduce((counts, assessment) => {
        counts[assessment.threatType] = (counts[assessment.threatType] || 0) + 1;
        return counts;
      }, {} as Record<ThreatType, number>);
      
      const commonThreats = Object.entries(threatCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([threat]) => threat as ThreatType);
      
      return {
        country,
        averageRisk: Math.round(averageRisk * 100) / 100,
        commonThreats
      };
    });
    
    return {
      sites,
      riskComparison: riskComparison.sort((a, b) => b.averageMagnitude - a.averageMagnitude),
      regionalTrends
    };
  }
  
  /**
   * Generate executive summary report for stakeholders
   * High-level overview focusing on key decisions and priorities
   * @param sites Heritage sites to include
   * @param assessments Risk assessments
   * @param generatedBy Report author
   * @returns Executive summary report
   */
  static generateExecutiveSummary(
    sites: HeritageSite[], 
    assessments: RiskAssessment[], 
    generatedBy: string = 'Heritage Guardian System'
  ): RiskAssessmentReport {
    // Focus on highest priority sites and threats
    const criticalSites = sites.filter(site => 
      site.riskProfile.overallRisk === 'extremely-high' || 
      site.riskProfile.overallRisk === 'very-high'
    );
    
    const urgentAssessments = assessments.filter(a => 
      a.priority === 'extremely-high' || a.priority === 'very-high'
    );
    
    // Create a synthetic "overview" site for the executive summary
    const overviewSite: HeritageSite = {
      id: 'executive-overview',
      name: `Executive Summary - ${sites.length} Heritage Sites`,
      location: {
        latitude: 0,
        longitude: 0,
        address: 'Multiple Locations',
        country: sites.length > 0 ? sites[0].location.country : 'Various'
      },
      description: `Executive overview of ${sites.length} heritage sites with ${assessments.length} risk assessments`,
      significance: 'Portfolio overview for strategic decision making',
      currentStatus: criticalSites.length > 0 ? 'critical' : 'active',
      lastAssessment: new Date(),
      riskProfile: {
        overallRisk: criticalSites.length > 0 ? 'extremely-high' : 'medium-high',
        lastUpdated: new Date(),
        activeThreats: [...new Set(urgentAssessments.map(a => a.threatType))]
      },
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const summary = this.calculateReportSummary(urgentAssessments);
    const recommendations = this.generateExecutiveRecommendations(sites, assessments);
    
    return {
      id: `executive-summary-${Date.now()}`,
      site: overviewSite,
      assessments: urgentAssessments.sort((a, b) => 
        RiskCalculator.getPriorityWeight(b.priority) - RiskCalculator.getPriorityWeight(a.priority)
      ),
      summary,
      recommendations,
      generatedAt: new Date(),
      generatedBy,
      reportType: 'executive-summary'
    };
  }
  
  /**
   * Calculate summary statistics for a set of risk assessments
   * @param assessments Risk assessments to analyze
   * @returns Report summary statistics
   */
  private static calculateReportSummary(assessments: RiskAssessment[]): ReportSummary {
    if (assessments.length === 0) {
      return {
        totalThreats: 0,
        highestRisk: 'low',
        averageMagnitude: 0,
        threatDistribution: {} as Record<ThreatType, number>,
        priorityDistribution: {} as Record<RiskPriority, number>,
        lastAssessmentDate: new Date(),
        urgentActions: 0
      };
    }
    
    // Calculate threat distribution
    const threatDistribution = assessments.reduce((dist, assessment) => {
      dist[assessment.threatType] = (dist[assessment.threatType] || 0) + 1;
      return dist;
    }, {} as Record<ThreatType, number>);
    
    // Calculate priority distribution
    const priorityDistribution = assessments.reduce((dist, assessment) => {
      dist[assessment.priority] = (dist[assessment.priority] || 0) + 1;
      return dist;
    }, {} as Record<RiskPriority, number>);
    
    // Find highest risk level
    const priorities: RiskPriority[] = ['extremely-high', 'very-high', 'high', 'medium-high', 'low'];
    const highestRisk = priorities.find(priority => priorityDistribution[priority] > 0) || 'low';
    
    // Calculate average magnitude
    const averageMagnitude = assessments.reduce((sum, a) => sum + a.magnitude, 0) / assessments.length;
    
    // Find most recent assessment date
    const lastAssessmentDate = new Date(Math.max(...assessments.map(a => a.assessmentDate.getTime())));
    
    // Count urgent actions needed
    const urgentActions = assessments.filter(a => 
      a.priority === 'extremely-high' || a.priority === 'very-high'
    ).length;
    
    return {
      totalThreats: assessments.length,
      highestRisk,
      averageMagnitude: Math.round(averageMagnitude * 100) / 100,
      threatDistribution,
      priorityDistribution,
      lastAssessmentDate,
      urgentActions
    };
  }
  
  /**
   * Generate actionable recommendations based on risk assessments
   * Following heritage conservation best practices
   * @param site Heritage site
   * @param assessments Risk assessments for the site
   * @returns Array of prioritized recommendations
   */
  private static generateRecommendations(site: HeritageSite, assessments: RiskAssessment[]): string[] {
    const recommendations: string[] = [];
    
    // Sort assessments by priority for recommendation generation
    const sortedAssessments = assessments.sort((a, b) => 
      RiskCalculator.getPriorityWeight(b.priority) - RiskCalculator.getPriorityWeight(a.priority)
    );
    
    // Generate threat-specific recommendations
    sortedAssessments.forEach((assessment, index) => {
      if (index < 5) { // Limit to top 5 threats for readability
        const threatRecommendations = this.getThreatSpecificRecommendations(assessment);
        recommendations.push(...threatRecommendations);
      }
    });
    
    // Add general site management recommendations
    if (assessments.length > 3) {
      recommendations.push('Develop comprehensive risk management plan integrating all identified threats');
    }
    
    if (assessments.some(a => a.uncertaintyLevel === 'high')) {
      recommendations.push('Conduct additional research to reduce uncertainty in high-uncertainty assessments');
    }
    
    // Add monitoring recommendations
    const oldAssessments = assessments.filter(a => {
      const monthsOld = (Date.now() - a.assessmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsOld > 12;
    });
    
    if (oldAssessments.length > 0) {
      recommendations.push('Update risk assessments older than 12 months to ensure current threat evaluation');
    }
    
    return recommendations.slice(0, 10); // Limit to 10 recommendations for focus
  }
  
  /**
   * Generate threat-specific recommendations
   * @param assessment Risk assessment
   * @returns Array of specific recommendations for the threat
   */
  private static getThreatSpecificRecommendations(assessment: RiskAssessment): string[] {
    const threatRecommendations: Record<ThreatType, string[]> = {
      'earthquake': [
        'Conduct structural engineering assessment for seismic vulnerability',
        'Implement seismic retrofitting measures for critical structures',
        'Develop emergency response plan for seismic events'
      ],
      'flooding': [
        'Install flood monitoring and early warning systems',
        'Improve drainage systems and water management infrastructure',
        'Develop flood emergency response and recovery procedures'
      ],
      'weathering': [
        'Implement regular conservation treatments for exposed surfaces',
        'Install protective shelters or coverings where appropriate',
        'Monitor environmental conditions and material deterioration rates'
      ],
      'vegetation': [
        'Develop vegetation management plan balancing conservation and site protection',
        'Regular removal of invasive plant species',
        'Monitor root systems impact on structural elements'
      ],
      'urban-development': [
        'Engage with local planning authorities to establish protective buffer zones',
        'Conduct environmental impact assessments for nearby developments',
        'Advocate for heritage-sensitive development policies'
      ],
      'tourism-pressure': [
        'Implement visitor management system with capacity limits',
        'Develop sustainable tourism infrastructure and pathways',
        'Create visitor education programs about heritage conservation'
      ],
      'looting': [
        'Enhance site security measures and surveillance systems',
        'Collaborate with law enforcement and customs authorities',
        'Implement community engagement programs for site protection'
      ],
      'conflict': [
        'Develop emergency protection protocols for heritage assets',
        'Coordinate with international heritage protection organizations',
        'Document and digitally preserve heritage information'
      ],
      'climate-change': [
        'Develop climate adaptation strategies specific to heritage conservation',
        'Monitor changing environmental conditions and their impacts',
        'Implement resilient conservation techniques for changing climate'
      ]
    };
    
    const baseRecommendations = threatRecommendations[assessment.threatType] || [
      'Conduct detailed threat assessment and develop mitigation strategies'
    ];
    
    // Adjust recommendations based on priority level
    if (assessment.priority === 'extremely-high') {
      return [`URGENT: ${baseRecommendations[0]}`, ...baseRecommendations.slice(1)];
    } else if (assessment.priority === 'very-high') {
      return [`HIGH PRIORITY: ${baseRecommendations[0]}`, ...baseRecommendations.slice(1)];
    }
    
    return baseRecommendations;
  }
  
  /**
   * Generate executive-level recommendations for portfolio management
   * @param sites All heritage sites
   * @param assessments All risk assessments
   * @returns Strategic recommendations for decision makers
   */
  private static generateExecutiveRecommendations(
    sites: HeritageSite[], 
    assessments: RiskAssessment[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Identify sites requiring immediate attention
    const criticalSites = sites.filter(site => 
      site.riskProfile.overallRisk === 'extremely-high'
    );
    
    if (criticalSites.length > 0) {
      recommendations.push(
        `IMMEDIATE ACTION REQUIRED: ${criticalSites.length} sites at extremely high risk need urgent intervention`
      );
    }
    
    // Analyze resource allocation needs
    const urgentAssessments = assessments.filter(a => 
      a.priority === 'extremely-high' || a.priority === 'very-high'
    );
    
    if (urgentAssessments.length > 0) {
      recommendations.push(
        `Allocate emergency resources for ${urgentAssessments.length} urgent threat mitigation actions`
      );
    }
    
    // Identify common threats for strategic planning
    const threatCounts = assessments.reduce((counts, assessment) => {
      counts[assessment.threatType] = (counts[assessment.threatType] || 0) + 1;
      return counts;
    }, {} as Record<ThreatType, number>);
    
    const topThreats = Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([threat]) => threat);
    
    if (topThreats.length > 0) {
      recommendations.push(
        `Develop regional strategies for common threats: ${topThreats.join(', ')}`
      );
    }
    
    // Budget and planning recommendations
    const totalSites = sites.length;
    const averageThreatsPerSite = assessments.length / totalSites;
    
    if (averageThreatsPerSite > 3) {
      recommendations.push(
        'Consider increasing conservation budget allocation due to high threat density across portfolio'
      );
    }
    
    recommendations.push(
      'Establish regular monitoring and assessment schedule for all heritage sites',
      'Develop partnerships with international heritage organizations for technical support',
      'Create public awareness campaigns to build support for heritage conservation'
    );
    
    return recommendations.slice(0, 8); // Limit for executive focus
  }
  
  /**
   * Format report data for export (JSON structure)
   * TODO: Extend with PDF and Excel export functionality
   * @param report Risk assessment report
   * @returns Formatted report data ready for export
   */
  static formatReportForExport(report: RiskAssessmentReport): any {
    return {
      metadata: {
        reportId: report.id,
        reportType: report.reportType,
        generatedAt: report.generatedAt.toISOString(),
        generatedBy: report.generatedBy,
        standard: 'ICCROM Heritage Risk Assessment Guidelines'
      },
      site: {
        name: report.site.name,
        location: report.site.location,
        description: report.site.description,
        significance: report.site.significance,
        currentStatus: report.site.currentStatus
      },
      summary: {
        ...report.summary,
        lastAssessmentDate: report.summary.lastAssessmentDate.toISOString()
      },
      assessments: report.assessments.map(assessment => ({
        threatType: assessment.threatType,
        probability: assessment.probability,
        lossOfValue: assessment.lossOfValue,
        fractionAffected: assessment.fractionAffected,
        magnitude: assessment.magnitude,
        priority: assessment.priority,
        uncertaintyLevel: assessment.uncertaintyLevel,
        assessmentDate: assessment.assessmentDate.toISOString(),
        assessor: assessment.assessor,
        notes: assessment.notes
      })),
      recommendations: report.recommendations
    };
  }
}