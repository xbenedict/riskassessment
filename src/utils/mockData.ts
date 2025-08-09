import { ThreatType } from '../types';
import type { HeritageSite } from '../types';

// Import images
import petraImage from '../assets/images/PETRA_06+3-2.webp';
import petraImage2 from '../assets/images/petra2.jpg';
import petraImage3 from '../assets/images/petra3.jpg';
import jerashImage from '../assets/images/jerash.jpg';
import jerashImage2 from '../assets/images/jerash2.webp';
import jerashImage3 from '../assets/images/jerash3.jpg';
import ummQaisImage from '../assets/images/umm qais.jpg';
import ummQaisImage2 from '../assets/images/umqais2.jpg';
import ummQaisImage3 from '../assets/images/umqais3.jpg';
import ammanCitadelImage from '../assets/images/amman-citadel.webp';
import ammanCitadelImage2 from '../assets/images/ammancitadel2.webp';
import ammanCitadelImage3 from '../assets/images/ammancitadel3.jpg';
import wadiRumImage from '../assets/images/wadi rum.jpg';
import wadiRumImage2 from '../assets/images/wadirum2.jpg';
import wadiRumImage3 from '../assets/images/wadirum3.jpg';
import kerakCastleImage from '../assets/images/kerak castle.jpg';
import kerakCastleImage2 from '../assets/images/kerakcastle2.webp';
import kerakCastleImage3 from '../assets/images/kerakcastle3.webp';
import ajlounCastleImage from '../assets/images/ajloun castle.jpg';
import ajlounCastleImage2 from '../assets/images/ajlouncastle2.jpg';
import ajlounCastleImage3 from '../assets/images/ajlouncastle3.jpg';
import madabaImage from '../assets/images/Madaba Archaeological Park 1.jpg';
import madabaImage2 from '../assets/images/madabaarchaeologicalpark2.jpg';
import madabaImage3 from '../assets/images/madabaarchaeologicalpark3.jpg';
import qasrAmraImage from '../assets/images/Qusayr_Amra.jpg';
import qasrAmraImage2 from '../assets/images/qusayramra2.jpg';
import qasrAmraImage3 from '../assets/images/qusayramra3.jpg';

// Mock archaeological heritage sites in Jordan with realistic data
export const mockSites: HeritageSite[] = [
  {
    id: '1',
    name: 'Petra Archaeological Site',
    location: {
      latitude: 30.3285,
      longitude: 35.4444,
      address: 'Ma\'an Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Ancient Nabataean city carved into rose-red sandstone cliffs, featuring elaborate tombs, temples, and the iconic Treasury building.',
    significance: 'UNESCO World Heritage Site since 1985. Capital of the Nabataean Kingdom from 4th century BC to 1st century AD, representing a unique blend of Eastern and Western architectural traditions.',
    currentStatus: 'at-risk',
    lastAssessment: new Date('2024-01-15'),
    riskProfile: {
      overallRisk: 'high',
      lastUpdated: new Date('2024-01-15'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.TOURISM_PRESSURE, ThreatType.FLOODING]
    },
    images: [
      petraImage,
      petraImage2,
      petraImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jerash Archaeological Site',
    location: {
      latitude: 32.2811,
      longitude: 35.8911,
      address: 'Jerash Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'One of the best-preserved Roman provincial cities in the world, featuring colonnaded streets, hilltop temples, handsome theaters, spacious public squares and plazas.',
    significance: 'Ancient city of Gerasa, part of the Decapolis. Flourished during Roman and Byzantine periods (1st-8th centuries AD). Showcases remarkable Roman urban planning and architecture.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-02-01'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-02-01'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.TOURISM_PRESSURE, ThreatType.URBAN_DEVELOPMENT]
    },
    images: [
      jerashImage,
      jerashImage2,
      jerashImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Umm Qais (Gadara)',
    location: {
      latitude: 32.6531,
      longitude: 35.6847,
      address: 'Irbid Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Ancient Greco-Roman city perched on a hilltop overlooking the Jordan Valley, Sea of Galilee, and Golan Heights. Features a well-preserved Roman theater and Byzantine church.',
    significance: 'One of the cities of the Decapolis. Known as a center of classical learning and culture. Mentioned in the New Testament as the place where Jesus performed the miracle of the Gadarene swine.',
    currentStatus: 'at-risk',
    lastAssessment: new Date('2024-01-20'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-01-20'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.VEGETATION, ThreatType.TOURISM_PRESSURE]
    },
    images: [
      ummQaisImage,
      ummQaisImage2,
      ummQaisImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4',
    name: 'Amman Citadel (Jabal al-Qal\'a)',
    location: {
      latitude: 31.9539,
      longitude: 35.9349,
      address: 'Amman, Jordan',
      country: 'Jordan'
    },
    description: 'Historic site at the center of downtown Amman featuring remains from the Roman, Byzantine, and Umayyad periods, including the Temple of Hercules and Umayyad Palace.',
    significance: 'Continuously inhabited since the Bronze Age. Capital of the Ammonites in antiquity. Contains archaeological remains spanning over 7,000 years of history.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-01-10'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-01-10'),
      activeThreats: [ThreatType.URBAN_DEVELOPMENT, ThreatType.WEATHERING, ThreatType.TOURISM_PRESSURE]
    },
    images: [
      ammanCitadelImage,
      ammanCitadelImage2,
      ammanCitadelImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '5',
    name: 'Wadi Rum Protected Area',
    location: {
      latitude: 29.5759,
      longitude: 35.4467,
      address: 'Aqaba Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Desert landscape with sandstone mountains, narrow gorges, natural arches, and ancient rock art. Contains petroglyphs, inscriptions, and archaeological remains.',
    significance: 'UNESCO World Heritage Site since 2011. Contains 25,000 rock carvings and 20,000 inscriptions tracing human activity over 12,000 years. Nabataean, Thamudic, and Arabic inscriptions.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-01-25'),
    riskProfile: {
      overallRisk: 'low',
      lastUpdated: new Date('2024-01-25'),
      activeThreats: [ThreatType.CLIMATE_CHANGE, ThreatType.TOURISM_PRESSURE]
    },
    images: [
      wadiRumImage,
      wadiRumImage2,
      wadiRumImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '6',
    name: 'Kerak Castle (Crac des Moabites)',
    location: {
      latitude: 31.1804,
      longitude: 35.7019,
      address: 'Kerak Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Large Crusader castle built in the 1140s, perched on a hilltop 900 meters above sea level. Features massive stone walls, underground galleries, and defensive towers.',
    significance: 'One of the largest and best-preserved Crusader castles in the Levant. Controlled the trade routes between Damascus and Egypt. Later expanded by Ayyubid and Mamluk rulers.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-02-05'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-02-05'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.EARTHQUAKE, ThreatType.TOURISM_PRESSURE]
    },
    images: [
      kerakCastleImage,
      kerakCastleImage2,
      kerakCastleImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '7',
    name: 'Ajloun Castle (Qal\'at ar-Rabad)',
    location: {
      latitude: 32.3328,
      longitude: 35.7517,
      address: 'Ajloun Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Islamic castle built in 1184 by Saladin\'s general to control iron mines and protect against Crusader expansion. Features innovative military architecture.',
    significance: 'Built by Izz al-Din Usama, nephew of Saladin. Represents Ayyubid military architecture and Islamic resistance to Crusader expansion. Controlled trade routes to Damascus.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-01-30'),
    riskProfile: {
      overallRisk: 'low',
      lastUpdated: new Date('2024-01-30'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.VEGETATION]
    },
    images: [
      ajlounCastleImage,
      ajlounCastleImage2,
      ajlounCastleImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: '8',
    name: 'Madaba Archaeological Park',
    location: {
      latitude: 31.7197,
      longitude: 35.7956,
      address: 'Madaba Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Archaeological site featuring the famous 6th-century Madaba Map mosaic, the oldest surviving cartographic representation of the Holy Land.',
    significance: 'Known as the "City of Mosaics." Contains the oldest known geographic floor mosaic in art history. Important center of Christianity with numerous Byzantine churches.',
    currentStatus: 'stable',
    lastAssessment: new Date('2024-02-10'),
    riskProfile: {
      overallRisk: 'medium-high',
      lastUpdated: new Date('2024-02-10'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.URBAN_DEVELOPMENT, ThreatType.TOURISM_PRESSURE]
    },
    images: [
      madabaImage,
      madabaImage2,
      madabaImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-10')
  },

  {
    id: '10',
    name: 'Qasr Amra',
    location: {
      latitude: 31.8017,
      longitude: 36.5847,
      address: 'Zarqa Governorate, Jordan',
      country: 'Jordan'
    },
    description: 'Early Islamic desert castle built in the 8th century, famous for its frescoes depicting hunting scenes, naked women, and zodiac signs.',
    significance: 'UNESCO World Heritage Site since 1985. Represents early Islamic art and Umayyad architecture. Contains rare figurative art in Islamic context, showing cultural synthesis.',
    currentStatus: 'at-risk',
    lastAssessment: new Date('2024-02-20'),
    riskProfile: {
      overallRisk: 'high',
      lastUpdated: new Date('2024-02-20'),
      activeThreats: [ThreatType.WEATHERING, ThreatType.CLIMATE_CHANGE, ThreatType.LOOTING]
    },
    images: [
      qasrAmraImage,
      qasrAmraImage2,
      qasrAmraImage3
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-02-20')
  }
];