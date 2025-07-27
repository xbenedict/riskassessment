// Mock Data Service for Heritage Guardian
// TODO: Replace with real Firecrawl MCP integration for live data scraping

import type { 
  HeritageSite, 
  RiskAssessment, 
  ThreatType, 
  RiskPriority, 
  UncertaintyLevel 
} from '../types';

/**
 * Mock Data Service providing realistic heritage site data
 * This service simulates data that would be retrieved from external APIs
 * 
 * TODO: Replace with real Firecrawl MCP integration:
 * 1. Use Firecrawl to scrape UNESCO World Heritage site data
 * 2. Integrate with ICOMOS threat monitoring databases
 * 3. Connect to national heritage databases (Jordan Department of Antiquities)
 * 4. Add real-time threat data from news sources and monitoring systems
 */
export class MockDataService {
  
  /**
   * Mock heritage sites data focusing on Jordanian heritage sites
   * TODO: Replace with Firecrawl MCP calls to:
   * - UNESCO World Heritage Centre database
   * - Jordan Department of Antiquities
   * - ICOMOS Heritage at Risk reports
   */
  private static mockHeritageSites: HeritageSite[] = [
    {
      id: 'site-001',
      name: 'Al-Hallabat Complex',
      location: {
        latitude: 32.0833,
        longitude: 36.3167,
        address: 'Al-Hallabat, Zarqa Governorate',
        country: 'Jordan'
      },
      description: 'A complex of Umayyad desert castles including Qasr al-Hallabat, a Roman fort converted into an Umayyad palace, and associated structures including a mosque, bathhouse, and agricultural installations.',
      significance: 'Outstanding example of early Islamic architecture and Umayyad desert castle complex, representing the transition from Byzantine to Islamic architectural traditions.',
      currentStatus: 'at-risk',
      lastAssessment: new Date('2024-01-15'),
      riskProfile: {
        overallRisk: 'high',
        lastUpdated: new Date('2024-01-15'),
        activeThreats: ['weathering', 'urban-development', 'tourism-pressure']
      },
      images: [
        '/images/hallabat-main.jpg',
        '/images/hallabat-mosque.jpg',
        '/images/hallabat-bathhouse.jpg'
      ],
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'site-002',
      name: 'Petra Archaeological Park',
      location: {
        latitude: 30.3285,
        longitude: 35.4444,
        address: 'Wadi Musa, Ma\'an Governorate',
        country: 'Jordan'
      },
      description: 'Famous archaeological site in Jordan\'s southwestern desert, featuring rock-cut architecture and water conduit system. Capital of the ancient Nabataean Kingdom.',
      significance: 'UNESCO World Heritage Site since 1985. One of the New Seven Wonders of the World. Outstanding universal value for its unique rock-cut architecture and ancient water management systems.',
      currentStatus: 'active',
      lastAssessment: new Date('2024-02-01'),
      riskProfile: {
        overallRisk: 'medium-high',
        lastUpdated: new Date('2024-02-01'),
        activeThreats: ['tourism-pressure', 'weathering', 'flooding']
      },
      images: [
        '/images/petra-treasury.jpg',
        '/images/petra-monastery.jpg',
        '/images/petra-siq.jpg'
      ],
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 'site-003',
      name: 'Umm ar-Rasas (Kastrom Mefa\'a)',
      location: {
        latitude: 31.5000,
        longitude: 35.9167,
        address: 'Umm ar-Rasas, Amman Governorate',
        country: 'Jordan'
      },
      description: 'Archaeological site containing remains from the Roman, Byzantine and Early Muslim periods. Features the largest mosaic floor in Jordan and important early Islamic inscriptions.',
      significance: 'UNESCO World Heritage Site since 2004. Contains the most complete mosaic floor from the Byzantine period in Jordan, with important historical and artistic value.',
      currentStatus: 'stable',
      lastAssessment: new Date('2023-12-10'),
      riskProfile: {
        overallRisk: 'low',
        lastUpdated: new Date('2023-12-10'),
        activeThreats: ['weathering']
      },
      images: [
        '/images/umm-ar-rasas-mosaics.jpg',
        '/images/umm-ar-rasas-church.jpg'
      ],
      createdAt: new Date('2023-07-01'),
      updatedAt: new Date('2023-12-10')
    },
    {
      id: 'site-004',
      name: 'Quseir Amra',
      location: {
        latitude: 31.8017,
        longitude: 36.5867,
        address: 'Al-Azraq, Zarqa Governorate',
        country: 'Jordan'
      },
      description: 'Desert castle built in the early 8th century, famous for its frescoes and architectural significance as an example of early Islamic art and architecture.',
      significance: 'UNESCO World Heritage Site since 1985. Exceptional testimony to Umayyad civilization with unique frescoes depicting hunting scenes, zodiac signs, and royal imagery.',
      currentStatus: 'critical',
      lastAssessment: new Date('2024-01-20'),
      riskProfile: {
        overallRisk: 'extremely-high',
        lastUpdated: new Date('2024-01-20'),
        activeThreats: ['weathering', 'climate-change', 'vegetation']
      },
      images: [
        '/images/quseir-amra-exterior.jpg',
        '/images/quseir-amra-frescoes.jpg',
        '/images/quseir-amra-dome.jpg'
      ],
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'site-005',
      name: 'Wadi Rum Protected Area',
      location: {
        latitude: 29.5833,
        longitude: 35.4167,
        address: 'Wadi Rum, Aqaba Governorate',
        country: 'Jordan'
      },
      description: 'Desert landscape with sandstone and granite rock formations, natural arches, and archaeological sites including petroglyphs and inscriptions spanning 12,000 years.',
      significance: 'UNESCO World Heritage Site since 2011. Mixed natural and cultural site with outstanding universal value for its desert landscape and archaeological evidence of human activity.',
      currentStatus: 'active',
      lastAssessment: new Date('2023-11-15'),
      riskProfile: {
        overallRisk: 'medium-high',
        lastUpdated: new Date('2023-11-15'),
        activeThreats: ['tourism-pressure', 'climate-change']
      },
      images: [
        '/images/wadi-rum-landscape.jpg',
        '/images/wadi-rum-petroglyphs.jpg',
        '/images/wadi-rum-arch.jpg'
      ],
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-11-15')
    }
  ];

  /**
   * Mock risk assessments using ABC scale methodology
   * A = Probability (1-5), B = Loss of Value (1-5), C = Fraction Affected (1-5)
   * Magnitude = A + B + C, Priority based on magnitude ranges
   * 
   * TODO: Replace with real-time risk data from:
   * - Weather monitoring APIs
   * - Seismic activity databases
   * - Tourism statistics
   * - Urban development planning data
   * - Conservation monitoring reports
   */
  private static mockRiskAssessments: RiskAssessment[] = [
    // Al-Hallabat Complex assessments
    {
      id: 'risk-001',
      siteId: 'site-001',
      threatType: 'weathering',
      probability: 4, // High probability due to desert climate
      lossOfValue: 3, // Moderate loss - structural damage but repairable
      fractionAffected: 2, // Small fraction of total complex
      magnitude: 9, // 4 + 3 + 2 = 9 (High priority)
      priority: 'high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Sarah Al-Rashid',
      notes: 'Ongoing erosion of limestone blocks due to wind and temperature fluctuations. Regular monitoring and conservation treatments needed.'
    },
    {
      id: 'risk-002',
      siteId: 'site-001',
      threatType: 'urban-development',
      probability: 3, // Moderate probability
      lossOfValue: 4, // High loss - could affect site integrity
      fractionAffected: 3, // Moderate fraction - surrounding area
      magnitude: 10, // 3 + 4 + 3 = 10 (Very high priority)
      priority: 'very-high',
      uncertaintyLevel: 'medium',
      assessmentDate: new Date('2024-01-10'),
      assessor: 'Prof. Ahmad Hijazi',
      notes: 'Proposed highway construction 500m from site boundary. Environmental impact assessment required.'
    },
    {
      id: 'risk-003',
      siteId: 'site-001',
      threatType: 'tourism-pressure',
      probability: 2, // Low probability - limited current tourism
      lossOfValue: 2, // Low loss - manageable with proper planning
      fractionAffected: 2, // Small fraction affected
      magnitude: 6, // 2 + 2 + 2 = 6 (Medium-high priority)
      priority: 'medium-high',
      uncertaintyLevel: 'high',
      assessmentDate: new Date('2024-01-12'),
      assessor: 'Dr. Sarah Al-Rashid',
      notes: 'Increasing visitor numbers. Need visitor management plan and infrastructure improvements.'
    },
    
    // Petra assessments
    {
      id: 'risk-004',
      siteId: 'site-002',
      threatType: 'tourism-pressure',
      probability: 5, // Very high - major tourist destination
      lossOfValue: 3, // Moderate loss
      fractionAffected: 4, // Large fraction affected
      magnitude: 12, // 5 + 3 + 4 = 12 (Very high priority)
      priority: 'very-high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-02-01'),
      assessor: 'Dr. Fadi Balaawi',
      notes: 'Over 1 million visitors annually causing significant wear to rock-cut facades and pathways. Urgent visitor management measures needed.'
    },
    {
      id: 'risk-005',
      siteId: 'site-002',
      threatType: 'weathering',
      probability: 4, // High probability
      lossOfValue: 4, // High loss potential
      fractionAffected: 3, // Moderate fraction
      magnitude: 11, // 4 + 4 + 3 = 11 (Very high priority)
      priority: 'very-high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-28'),
      assessor: 'Dr. Fadi Balaawi',
      notes: 'Salt crystallization and thermal expansion causing facade deterioration. Accelerated by climate change effects.'
    },
    {
      id: 'risk-006',
      siteId: 'site-002',
      threatType: 'flooding',
      probability: 2, // Low probability but increasing
      lossOfValue: 5, // Catastrophic loss potential
      fractionAffected: 2, // Small fraction but critical areas
      magnitude: 9, // 2 + 5 + 2 = 9 (High priority)
      priority: 'high',
      uncertaintyLevel: 'high',
      assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Layla Qasemi',
      notes: 'Flash flood risk increasing due to climate change. Critical infrastructure and Treasury facade at risk.'
    },

    // Quseir Amra assessments (critical site)
    {
      id: 'risk-007',
      siteId: 'site-004',
      threatType: 'weathering',
      probability: 5, // Very high - exposed desert location
      lossOfValue: 5, // Catastrophic - unique frescoes
      fractionAffected: 4, // Large fraction of building
      magnitude: 14, // 5 + 5 + 4 = 14 (Extremely high priority)
      priority: 'extremely-high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2024-01-20'),
      assessor: 'Prof. Elena Rossi',
      notes: 'Rapid deterioration of unique Umayyad frescoes due to salt damage and temperature fluctuations. Emergency conservation required.'
    },
    {
      id: 'risk-008',
      siteId: 'site-004',
      threatType: 'climate-change',
      probability: 4, // High probability
      lossOfValue: 5, // Catastrophic loss
      fractionAffected: 5, // Entire structure affected
      magnitude: 14, // 4 + 5 + 5 = 14 (Extremely high priority)
      priority: 'extremely-high',
      uncertaintyLevel: 'medium',
      assessmentDate: new Date('2024-01-18'),
      assessor: 'Dr. Michael Thompson',
      notes: 'Increasing temperature extremes and changing precipitation patterns accelerating structural damage and fresco deterioration.'
    },

    // Umm ar-Rasas assessment (stable site)
    {
      id: 'risk-009',
      siteId: 'site-003',
      threatType: 'weathering',
      probability: 2, // Low probability - well protected
      lossOfValue: 2, // Low loss - mosaics under shelter
      fractionAffected: 1, // Very small fraction
      magnitude: 5, // 2 + 2 + 1 = 5 (Medium-high priority)
      priority: 'medium-high',
      uncertaintyLevel: 'low',
      assessmentDate: new Date('2023-12-10'),
      assessor: 'Dr. Nadia Khoury',
      notes: 'Protective shelters effective. Minor maintenance needed for mosaic edges. Overall condition stable.'
    },

    // Wadi Rum assessments
    {
      id: 'risk-010',
      siteId: 'site-005',
      threatType: 'tourism-pressure',
      probability: 4, // High - popular destination
      lossOfValue: 3, // Moderate loss
      fractionAffected: 2, // Small fraction - specific sites
      magnitude: 9, // 4 + 3 + 2 = 9 (High priority)
      priority: 'high',
      uncertaintyLevel: 'medium',
      assessmentDate: new Date('2023-11-15'),
      assessor: 'Dr. Omar Zawaideh',
      notes: 'Increasing camping and climbing activities affecting petroglyphs and natural formations. Need sustainable tourism guidelines.'
    },
    {
      id: 'risk-011',
      siteId: 'site-005',
      threatType: 'climate-change',
      probability: 3, // Moderate probability
      lossOfValue: 2, // Low loss - natural resilience
      fractionAffected: 3, // Moderate fraction
      magnitude: 8, // 3 + 2 + 3 = 8 (High priority)
      priority: 'high',
      uncertaintyLevel: 'high',
      assessmentDate: new Date('2023-11-12'),
      assessor: 'Dr. Omar Zawaideh',
      notes: 'Changing precipitation patterns may affect desert ecosystem and archaeological preservation conditions.'
    }
  ];

  /**
   * Retrieve all heritage sites
   * TODO: Replace with Firecrawl MCP call to scrape live heritage site databases
   * Example: await firecrawl.scrape('https://whc.unesco.org/en/list/')
   */
  static async getHeritageSites(): Promise<HeritageSite[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Replace with real Firecrawl MCP integration:
    // const sites = await firecrawl.scrape({
    //   url: 'https://whc.unesco.org/en/list/',
    //   formats: ['markdown'],
    //   extract: {
    //     schema: HeritageSiteSchema,
    //     systemPrompt: 'Extract heritage site information including name, location, description, and current status'
    //   }
    // });
    
    return [...this.mockHeritageSites];
  }

  /**
   * Retrieve risk assessments for a specific site
   * TODO: Replace with real-time risk data integration from multiple sources
   */
  static async getRiskAssessments(siteId: string): Promise<RiskAssessment[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // TODO: Replace with real data sources:
    // - Weather APIs for climate-related risks
    // - Seismic monitoring for earthquake risks
    // - Tourism statistics for visitor pressure
    // - Urban planning databases for development threats
    
    return this.mockRiskAssessments.filter(assessment => assessment.siteId === siteId);
  }

  /**
   * Retrieve a specific heritage site by ID
   * TODO: Integrate with external heritage databases
   */
  static async getHeritageSite(siteId: string): Promise<HeritageSite | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const site = this.mockHeritageSites.find(site => site.id === siteId);
    return site || null;
  }

  /**
   * Search heritage sites by various criteria
   * TODO: Implement with full-text search using external APIs
   */
  static async searchHeritageSites(query: string): Promise<HeritageSite[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowercaseQuery = query.toLowerCase();
    return this.mockHeritageSites.filter(site => 
      site.name.toLowerCase().includes(lowercaseQuery) ||
      site.description.toLowerCase().includes(lowercaseQuery) ||
      site.location.country.toLowerCase().includes(lowercaseQuery) ||
      site.location.address.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get sites by risk priority level
   * TODO: Integrate with real-time risk monitoring systems
   */
  static async getSitesByRiskLevel(riskLevel: RiskPriority): Promise<HeritageSite[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockHeritageSites.filter(site => site.riskProfile.overallRisk === riskLevel);
  }

  /**
   * Get recent risk assessments across all sites
   * TODO: Connect to real assessment databases and monitoring systems
   */
  static async getRecentAssessments(limit: number = 10): Promise<RiskAssessment[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return [...this.mockRiskAssessments]
      .sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())
      .slice(0, limit);
  }
}