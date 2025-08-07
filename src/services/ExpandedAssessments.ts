// Complete expanded assessments - 10 per site
// This contains the full getPredefinedAssessments method replacement

export const getExpandedPredefinedAssessments = () => {
  return {
    // Petra Archaeological Site - 10 assessments
    '1': [
      {
        threatType: 'weathering',
        probability: 4,
        lossOfValue: 5,
        fractionAffected: 3,
        magnitude: 12,
        priority: 'very-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-01-15'),
        assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
        notes: 'URGENT: Accelerated weathering observed on Treasury facade due to sandstone deterioration. Chemical analysis shows increased sulfate attack. Immediate conservation treatment required.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 5,
        lossOfValue: 3,
        fractionAffected: 4,
        magnitude: 12,
        priority: 'very-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-01-10'),
        assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
        notes: 'URGENT: Visitor numbers exceeding 4,000 daily during peak season. Physical wear patterns on Treasury steps and Siq pathway showing accelerated deterioration. Visitor management system needed immediately.'
      },
      {
        threatType: 'flooding',
        probability: 3,
        lossOfValue: 4,
        fractionAffected: 2,
        magnitude: 9,
        priority: 'high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2023-12-20'),
        assessor: 'Dr. Maria Rodriguez, Conservation Expert',
        notes: 'HIGH PRIORITY: Flash flood events in 2023 caused water damage to lower tomb structures. Drainage systems require upgrade to handle extreme weather events. Climate change increasing flood frequency.'
      },
      {
        threatType: 'weathering',
        probability: 4,
        lossOfValue: 4,
        fractionAffected: 2,
        magnitude: 10,
        priority: 'very-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-11-28'),
        assessor: 'Dr. James Thompson, Risk Assessment Specialist',
        notes: 'URGENT: Monastery facade showing severe salt crystallization damage. Sandstone blocks cracking due to thermal expansion cycles. Emergency stabilization required.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 4,
        lossOfValue: 2,
        fractionAffected: 3,
        magnitude: 9,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-11-15'),
        assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
        notes: 'HIGH PRIORITY: Royal Tombs area experiencing overcrowding during peak hours. Visitor trampling causing erosion of carved steps and thresholds. Timed entry system recommended.'
      },
      {
        threatType: 'weathering',
        probability: 3,
        lossOfValue: 3,
        fractionAffected: 3,
        magnitude: 9,
        priority: 'high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2023-10-30'),
        assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
        notes: 'HIGH PRIORITY: High Place of Sacrifice altar showing wind erosion damage. Exposed hilltop location accelerating deterioration of carved surfaces. Protective shelter consideration needed.'
      },
      {
        threatType: 'flooding',
        probability: 2,
        lossOfValue: 3,
        fractionAffected: 2,
        magnitude: 7,
        priority: 'high',
        uncertaintyLevel: 'high',
        assessmentDate: new Date('2023-10-15'),
        assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
        notes: 'HIGH PRIORITY: Siq entrance vulnerable to flash flooding. Recent storms revealed inadequate drainage capacity. Water flow patterns threatening carved reliefs.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 3,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 7,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-09-20'),
        assessor: 'Dr. Amara Okafor, Site Management Specialist',
        notes: 'HIGH PRIORITY: Great Temple complex showing visitor impact on mosaic floors. Foot traffic patterns creating uneven wear. Protective walkways needed.'
      },
      {
        threatType: 'weathering',
        probability: 2,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 6,
        priority: 'medium-high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2023-09-05'),
        assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
        notes: 'Colonnaded Street columns showing minor surface weathering. Regular monitoring indicates stable condition but preventive conservation recommended.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 2,
        lossOfValue: 2,
        fractionAffected: 1,
        magnitude: 5,
        priority: 'medium-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-08-25'),
        assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
        notes: 'Petra by Night events showing minimal impact on Treasury area. Current lighting system and visitor management protocols effective.'
      }
    ],

    // Jerash Archaeological Site - 10 assessments
    '2': [
      {
        threatType: 'weathering',
        probability: 3,
        lossOfValue: 4,
        fractionAffected: 3,
        magnitude: 10,
        priority: 'very-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-02-01'),
        assessor: 'Dr. James Thompson, Risk Assessment Specialist',
        notes: 'URGENT: Roman columns showing structural stress fractures. Limestone deterioration accelerated by acid rain and temperature fluctuations. Regular monitoring reveals progressive material degradation.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 4,
        lossOfValue: 2,
        fractionAffected: 3,
        magnitude: 9,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-01-25'),
        assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
        notes: 'HIGH PRIORITY: Tourist impact on Oval Plaza and Cardo Maximus showing wear patterns. Need for protective pathways and visitor education programs. Action needed within 6 months.'
      },
      {
        threatType: 'urban-development',
        probability: 2,
        lossOfValue: 3,
        fractionAffected: 2,
        magnitude: 7,
        priority: 'high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2024-01-20'),
        assessor: 'Prof. Giovanni Rossi, ICOMOS Representative',
        notes: 'HIGH PRIORITY: Nearby construction activities creating vibration concerns for ancient structures. Buffer zone establishment needed to protect archaeological integrity.'
      },
      {
        threatType: 'weathering',
        probability: 3,
        lossOfValue: 3,
        fractionAffected: 2,
        magnitude: 8,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-01-12'),
        assessor: 'Dr. Maria Rodriguez, Conservation Expert',
        notes: 'HIGH PRIORITY: South Theater stone seating showing weathering damage. Limestone blocks affected by freeze-thaw cycles. Conservation treatment needed within 6 months.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 3,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 7,
        priority: 'high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2024-01-08'),
        assessor: 'Dr. Chen Wei, Cultural Heritage Analyst',
        notes: 'HIGH PRIORITY: North Theater experiencing high visitor volume during cultural events. Stage area showing wear from performances. Usage guidelines needed.'
      },
      {
        threatType: 'weathering',
        probability: 2,
        lossOfValue: 3,
        fractionAffected: 2,
        magnitude: 7,
        priority: 'high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2023-12-30'),
        assessor: 'Dr. Amara Okafor, Site Management Specialist',
        notes: 'HIGH PRIORITY: Temple of Artemis columns showing surface deterioration. Corinthian capitals affected by wind erosion. Regular maintenance required.'
      },
      {
        threatType: 'urban-development',
        probability: 2,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 6,
        priority: 'medium-high',
        uncertaintyLevel: 'medium',
        assessmentDate: new Date('2023-12-15'),
        assessor: 'Dr. Sarah Mitchell, UNESCO Heritage Specialist',
        notes: 'Modern Jerash city expansion affecting site periphery. Traffic vibrations from nearby roads require monitoring. Buffer zone maintenance important.'
      },
      {
        threatType: 'tourism-pressure',
        probability: 2,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 6,
        priority: 'medium-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-12-01'),
        assessor: 'Prof. Ahmed Hassan, Archaeological Institute',
        notes: 'Jerash Festival activities showing manageable impact on archaeological structures. Current event management protocols effective but require continued monitoring.'
      },
      {
        threatType: 'weathering',
        probability: 2,
        lossOfValue: 2,
        fractionAffected: 2,
        magnitude: 6,
        priority: 'medium-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-11-20'),
        assessor: 'Dr. James Thompson, Risk Assessment Specialist',
        notes: 'Nymphaeum fountain structure showing minor weathering. Water damage from ancient plumbing systems under control. Preventive maintenance adequate.'
      },
      {
        threatType: 'urban-development',
        probability: 1,
        lossOfValue: 2,
        fractionAffected: 1,
        magnitude: 4,
        priority: 'medium-high',
        uncertaintyLevel: 'low',
        assessmentDate: new Date('2023-11-05'),
        assessor: 'Dr. Fatima Al-Zahra, Heritage Preservation Officer',
        notes: 'Archaeological museum construction completed with minimal site impact. Proper archaeological protocols followed during development.'
      }
    ],

    // Continue with all other sites...
    // I'll add the remaining sites in separate parts due to length constraints
  };
};