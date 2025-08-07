// Comprehensive assessments - 10 per site for all heritage sites
// This will be used to replace the getPredefinedAssessments method

import type { RiskAssessment, ThreatType } from '../types';

export const comprehensiveAssessments: Record<string, Omit<RiskAssessment, 'id' | 'siteId'>[]> = {
  // Petra Archaeological Site - 10 assessments
  '1': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 4, lossOfValue: 5, fractionAffected: 3, magnitude: 12, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'URGENT: Accelerated weathering observed on Treasury facade due to sandstone deterioration. Chemical analysis shows increased sulfate attack. Immediate conservation treatment required.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 5, lossOfValue: 3, fractionAffected: 4, magnitude: 12, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'URGENT: Visitor numbers exceeding 4,000 daily during peak season. Physical wear patterns on Treasury steps and Siq pathway showing accelerated deterioration.'
    },
    {
      threatType: 'flooding' as ThreatType,
      probability: 3, lossOfValue: 4, fractionAffected: 2, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-20'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Flash flood events in 2023 caused water damage to lower tomb structures. Drainage systems require upgrade to handle extreme weather events.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 4, lossOfValue: 4, fractionAffected: 2, magnitude: 10, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-28'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'URGENT: Monastery facade showing severe salt crystallization damage. Sandstone blocks cracking due to thermal expansion cycles. Emergency stabilization required.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 4, lossOfValue: 2, fractionAffected: 3, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-15'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'HIGH PRIORITY: Royal Tombs area experiencing overcrowding during peak hours. Visitor trampling causing erosion of carved steps and thresholds.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 3, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-10-30'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'HIGH PRIORITY: High Place of Sacrifice altar showing wind erosion damage. Exposed hilltop location accelerating deterioration of carved surfaces.'
    },
    {
      threatType: 'flooding' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2023-10-15'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: Siq entrance vulnerable to flash flooding. Recent storms revealed inadequate drainage capacity. Water flow patterns threatening carved reliefs.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-09-20'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'HIGH PRIORITY: Great Temple complex showing visitor impact on mosaic floors. Foot traffic patterns creating uneven wear. Protective walkways needed.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-09-05'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Colonnaded Street columns showing minor surface weathering. Regular monitoring indicates stable condition but preventive conservation recommended.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-08-25'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Petra by Night events showing minimal impact on Treasury area. Current lighting system and visitor management protocols effective.'
    }
  ],

  // Jerash Archaeological Site - 10 assessments
  '2': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 4, fractionAffected: 3, magnitude: 10, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-01'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'URGENT: Roman columns showing structural stress fractures. Limestone deterioration accelerated by acid rain and temperature fluctuations.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 4, lossOfValue: 2, fractionAffected: 3, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'HIGH PRIORITY: Tourist impact on Oval Plaza and Cardo Maximus showing wear patterns. Need for protective pathways and visitor education programs.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'HIGH PRIORITY: Nearby construction activities creating vibration concerns for ancient structures. Buffer zone establishment needed.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 2, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-12'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: South Theater stone seating showing weathering damage. Limestone blocks affected by freeze-thaw cycles.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-08'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: North Theater experiencing high visitor volume during cultural events. Stage area showing wear from performances.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-30'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'HIGH PRIORITY: Temple of Artemis columns showing surface deterioration. Corinthian capitals affected by wind erosion.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Modern Jerash city expansion affecting site periphery. Traffic vibrations from nearby roads require monitoring.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Jerash Festival activities showing manageable impact on archaeological structures. Current event management protocols effective.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-20'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'Nymphaeum fountain structure showing minor weathering. Water damage from ancient plumbing systems under control.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 1, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-05'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Archaeological museum construction completed with minimal site impact. Proper archaeological protocols followed during development.'
    }
  ],

  // Umm Qais (Gadara) - 10 assessments
  '3': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 4, lossOfValue: 3, fractionAffected: 3, magnitude: 10, priority: 'very-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'URGENT: Basalt stone blocks in Roman theater showing freeze-thaw damage. Hilltop exposure to weather extremes accelerating deterioration.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 2, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'HIGH PRIORITY: Wild vegetation growth between stone blocks causing structural displacement. Root systems penetrating foundation areas.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Moderate tourist impact on viewing areas. Scenic location attracts photographers causing minor wear on optimal viewing positions.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 3, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-05'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Byzantine church mosaics showing deterioration from temperature fluctuations. Hilltop microclimate causing thermal stress.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-28'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'HIGH PRIORITY: Olive trees near Roman basilica causing root damage to foundations. Ancient agricultural terraces being compromised.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 3, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'HIGH PRIORITY: Roman baths complex showing structural weathering. Volcanic stone construction generally stable but mortar joints deteriorating.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Scenic overlook area popular with tour groups. Viewing platform showing minor wear but within acceptable limits.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 2, lossOfValue: 1, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-20'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'Wild herbs and grasses growing in theater seating areas. Natural vegetation provides some protection but requires management.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-05'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Decumanus Maximus paving stones showing minimal weathering. Roman road construction proving durable. Routine monitoring adequate.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 1, magnitude: 3, priority: 'low' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-10-25'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Museum visitor center functioning well. Educational programs effectively managing visitor flow and reducing direct site impact.'
    }
  ],

  // Amman Citadel - 10 assessments
  '4': [
    {
      threatType: 'urban-development' as ThreatType,
      probability: 4, lossOfValue: 3, fractionAffected: 4, magnitude: 11, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'URGENT: Downtown Amman expansion creating air pollution and vibration impacts. Modern construction within 500m of archaeological remains.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 3, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-05'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Umayyad Palace walls showing mortar deterioration. Urban microclimate effects accelerating stone weathering.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-28'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'HIGH PRIORITY: High visitor volume to Temple of Hercules causing pathway erosion. Popular sunset viewing location needs visitor management.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 3, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-20'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: Traffic pollution from surrounding streets affecting stone surfaces. Vehicle emissions creating chemical weathering acceleration.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'HIGH PRIORITY: Byzantine church remains showing structural weathering. Ancient mortar joints requiring repointing and stabilization.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Archaeological museum area experiencing moderate visitor pressure. Current pathways adequate but require regular maintenance.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-11-25'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'New hotel construction nearby creating temporary construction impacts. Monitoring required during building phase.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-10'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Roman theater remains showing minor weathering. Limestone construction generally stable with regular maintenance protocols.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 1, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-10-30'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'Evening cultural events showing minimal impact on archaeological structures. Current event management protocols effective.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 1, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-10-15'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'Citadel access road improvements completed with minimal archaeological impact. Proper heritage protocols followed during construction.'
    }
  ],

  // Wadi Rum Protected Area - 10 assessments
  '5': [
    {
      threatType: 'climate-change' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 4, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: Changing precipitation patterns affecting rock art preservation. Increased temperature extremes causing thermal stress on petroglyphs.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Desert tourism activities near rock art sites showing minor impact. Camel and jeep tours generally well-managed but require continued monitoring.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 3, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'HIGH PRIORITY: Sandstone formations showing increased weathering from extreme temperature fluctuations. Desert climate becoming more severe.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Rock climbing activities near petroglyphs showing minimal impact. Current access restrictions and guide protocols effective.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-30'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'Wind erosion patterns changing due to climate shifts. Ancient inscriptions showing gradual surface loss from increased sandstorm frequency.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'Overnight camping activities showing controlled impact. Designated camping areas protecting sensitive archaeological zones.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 3, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Rare rainfall events creating temporary water damage to rock art. Flash flooding potential increasing with climate change.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 2, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-20'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'Film production activities showing minimal archaeological impact. Current permitting system and archaeological oversight effective.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 2, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-11-05'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'Solar radiation intensity increasing, affecting pigment preservation in rock art. UV exposure monitoring program recommended.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 1, magnitude: 3, priority: 'low' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-10-25'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Visitor center educational programs effectively managing tourist behavior. Awareness campaigns reducing direct contact with rock art.'
    }
  ],

  // Kerak Castle - 10 assessments
  '6': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 4, lossOfValue: 3, fractionAffected: 3, magnitude: 10, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-05'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'URGENT: Crusader masonry showing significant weathering damage. Hilltop exposure to wind and rain accelerating limestone deterioration.'
    },
    {
      threatType: 'earthquake' as ThreatType,
      probability: 2, lossOfValue: 5, fractionAffected: 3, magnitude: 10, priority: 'very-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-30'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'URGENT: Seismic vulnerability assessment reveals structural weaknesses in medieval construction. Jordan Valley fault system poses significant risk.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Moderate visitor impact on castle courtyards and underground galleries. Current visitor numbers manageable with existing infrastructure.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 2, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Great Hall walls showing mortar deterioration. Medieval construction techniques requiring specialized conservation approaches.'
    },
    {
      threatType: 'earthquake' as ThreatType,
      probability: 1, lossOfValue: 4, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'HIGH PRIORITY: Underground chambers showing structural stress indicators. Seismic monitoring equipment installation recommended.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: Outer defensive walls showing wind erosion damage. Hilltop location creating severe weathering conditions.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-30'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Castle tower access showing minor wear from visitor climbing. Current safety barriers adequate but require regular inspection.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Chapel ruins showing stable condition. Limestone construction proving durable with regular maintenance protocols.'
    },
    {
      threatType: 'earthquake' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Recent minor seismic activity showing no visible structural damage. Monitoring systems functioning properly.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 1, magnitude: 3, priority: 'low' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-20'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Visitor interpretation center effectively managing tourist flow. Educational programs reducing direct impact on castle structures.'
    }
  ],

  // Ajloun Castle - 10 assessments
  '7': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-30'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Islamic period stonework showing moderate weathering. Forest microclimate providing some protection but regular maintenance needed.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'HIGH PRIORITY: Forest vegetation encroachment on castle walls. Tree roots near foundations require monitoring.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'Central courtyard showing minor weathering damage. Ayyubid construction techniques proving durable in forest environment.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'Ivy growth on exterior walls creating moisture retention issues. Vegetation management balancing conservation with natural setting.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 1, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Tower structures showing good preservation. Forest canopy providing natural protection from direct weather exposure.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-30'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'Pine trees near castle providing beneficial shade but requiring root system monitoring. Balanced ecosystem management approach needed.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-15'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Entrance gateway showing stable condition. Islamic architectural elements well-preserved in forest microclimate.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 2, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-01'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'Seasonal vegetation growth manageable with current maintenance protocols. Natural forest setting enhancing site preservation.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 2, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-20'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Interior chambers showing excellent preservation. Forest environment providing optimal conservation conditions.'
    },
    {
      threatType: 'vegetation' as ThreatType,
      probability: 1, lossOfValue: 1, fractionAffected: 1, magnitude: 3, priority: 'low' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-11-05'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Visitor pathways through forest well-maintained. Natural vegetation management protocols effective in protecting archaeological integrity.'
    }
  ],

  // Madaba Archaeological Park - 10 assessments
  '8': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 4, fractionAffected: 2, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-10'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'HIGH PRIORITY: Byzantine mosaics showing deterioration from humidity fluctuations. Madaba Map requires climate-controlled environment.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 3, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-02-05'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'HIGH PRIORITY: Modern Madaba city development affecting archaeological context. Construction activities near St. George Church creating vibration concerns.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 3, lossOfValue: 2, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-01'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: High visitor volume to view Madaba Map causing wear on church floors. Protective barriers and visitor flow management needed.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 2, magnitude: 7, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-28'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Church of the Virgin Mary mosaics showing color fading. Light exposure and temperature control systems need upgrading.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Modern infrastructure development around archaeological park creating access challenges. Urban planning coordination needed.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Archaeological Park Museum experiencing high visitor numbers. Current display systems adequate but require regular maintenance.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'Apostles Church mosaics showing stable condition. Current conservation treatments proving effective for tessellated floors.'
    },
    {
      threatType: 'urban-development' as ThreatType,
      probability: 2, lossOfValue: 1, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'New visitor facilities construction showing minimal archaeological impact. Proper heritage protocols followed during development.'
    },
    {
      threatType: 'tourism-pressure' as ThreatType,
      probability: 2, lossOfValue: 1, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-05'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'School group visits showing manageable impact on mosaic viewing areas. Educational programs effectively managing young visitor behavior.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 1, magnitude: 4, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2023-12-30'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'Hippolytus Hall mosaics showing excellent preservation. Climate control systems functioning optimally for long-term conservation.'
    }
  ],

  // Qasr Amra - 10 assessments
  '10': [
    {
      threatType: 'weathering' as ThreatType,
      probability: 4, lossOfValue: 5, fractionAffected: 3, magnitude: 12, priority: 'very-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-20'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'URGENT: Umayyad frescoes showing critical deterioration. Desert climate extremes causing paint layer loss. Immediate climate control and conservation intervention required.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 4, lossOfValue: 4, fractionAffected: 4, magnitude: 12, priority: 'very-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-02-15'),
      assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
      notes: 'URGENT: Increasing temperature extremes and reduced humidity affecting rare figurative Islamic art. Climate adaptation strategies critical for long-term preservation.'
    },
    {
      threatType: 'looting' as ThreatType,
      probability: 2, lossOfValue: 5, fractionAffected: 1, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-02-10'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'HIGH PRIORITY: Remote desert location creates security vulnerabilities. Enhanced surveillance and community engagement programs needed to protect unique Islamic art.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 3, lossOfValue: 4, fractionAffected: 2, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-02-05'),
      assessor: 'Dr. Maria Rodriguez, Conservation Expert',
      notes: 'HIGH PRIORITY: Caldarium ceiling frescoes showing severe paint loss. Salt crystallization from groundwater causing structural damage to painted surfaces.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 3, lossOfValue: 3, fractionAffected: 3, magnitude: 9, priority: 'high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2024-01-30'),
      assessor: 'Dr. James Thompson, Risk Assessment Specialist',
      notes: 'HIGH PRIORITY: Extreme temperature fluctuations causing thermal stress on masonry. Desert climate becoming more severe with longer heat periods.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 3, fractionAffected: 3, magnitude: 8, priority: 'high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-25'),
      assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
      notes: 'HIGH PRIORITY: Audience hall zodiac ceiling showing pigment deterioration. UV radiation and temperature extremes accelerating color loss.'
    },
    {
      threatType: 'looting' as ThreatType,
      probability: 1, lossOfValue: 4, fractionAffected: 1, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'high' as any, assessmentDate: new Date('2024-01-20'),
      assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
      notes: 'Remote location requiring enhanced security measures. Current guard presence adequate but technology upgrades needed for comprehensive monitoring.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'medium' as any, assessmentDate: new Date('2024-01-15'),
      assessor: 'Dr. Amara Okafor, Site Management Specialist',
      notes: 'Sandstorm frequency increasing, creating abrasion damage to exterior surfaces. Protective barriers consideration needed for exposed areas.'
    },
    {
      threatType: 'weathering' as ThreatType,
      probability: 2, lossOfValue: 2, fractionAffected: 2, magnitude: 6, priority: 'medium-high' as any,
      uncertaintyLevel: 'low' as any, assessmentDate: new Date('2024-01-10'),
      assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
      notes: 'Apodyterium walls showing moderate weathering. Stone construction generally stable but mortar joints requiring attention.'
    },
    {
      threatType: 'climate-change' as ThreatType,
      probability: 1, lossOfValue: 2, fractionAffected: 2, magnitude: 5, priority: 'medium-high' as any,
      uncertaintyLevel: 'high' as any,
      assessmentDate: new Date('2024-01-05'),
      assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
      notes: 'Rare precipitation events creating temporary moisture damage. Flash flooding potential increasing with climate change patterns.'
    }
  ]
};