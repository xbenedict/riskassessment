# Heritage Guardian - Design Document

## Overview

Heritage Guardian is a React-based web application that provides comprehensive risk assessment and management tools for cultural heritage sites. The application implements the ABC scale methodology (Probability + Loss of Value + Fraction Affected = Magnitude of Risk) as described in ICCROM guidelines, with integrated data enrichment capabilities and interactive visualizations.

The application will serve as a centralized platform for heritage professionals to assess threats, visualize risk data, and make informed conservation decisions using both quantitative and qualitative risk assessment approaches.

## Architecture

### High-Level Architecture (Frontend-Only)

```
┌─────────────────────────────────────────────────────────┐
│                React Frontend Application                │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Risk Forms  │  │ Charts/Maps │  │   Dashboard     │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Mock Data Services                     │  │
│  │  • Simulated Heritage Sites (Al-Hallabat, etc.)    │  │
│  │  • Mock Risk Assessments                           │  │
│  │  • Fake External Data Integration                  │  │
│  │  • Comments for Real API Integration               │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                             │
│                           ▼                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Browser Local Storage                  │  │
│  │  • Persisted Mock Data                             │  │
│  │  • User Preferences                                │  │
│  │  • Assessment History                              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React 18 with TypeScript, Vite for build tooling
- **State Management**: React Context API with useReducer for complex state
- **Charts**: Chart.js with react-chartjs-2 for interactive visualizations
- **Maps**: Leaflet with react-leaflet for geographic visualizations
- **UI Components**: Custom components with CSS modules
- **Data Integration**: Mock data services with inline comments for future Firecrawl MCP integration
- **Storage**: Browser localStorage for persisting mock data and user preferences

## Components and Interfaces

### Core Components

#### 1. Risk Assessment Engine (`/src/components/RiskAssessment/`)

**RiskAssessmentForm.tsx**
- Input forms for ABC scale components (Probability, Loss of Value, Fraction Affected)
- Real-time calculation of risk magnitude
- Uncertainty level selection
- Validation and error handling

**RiskCalculator.ts**
- Core logic for ABC scale calculations
- Risk categorization (extremely high to low)
- Uncertainty matrix application
- Priority ranking algorithms

#### 2. Data Visualization (`/src/components/Visualization/`)

**RiskChart.tsx**
- Interactive bar charts for risk magnitude comparison
- Pie charts for risk category distribution
- Time-series charts for risk evolution
- Responsive design for mobile viewing

**SiteMap.tsx**
- Interactive map showing heritage site locations
- Risk level color coding
- Threat zone overlays
- Click-to-detail functionality

**Dashboard.tsx**
- Overview of all managed sites
- Key performance indicators
- Recent risk assessments
- Alert notifications

#### 3. Site Management (`/src/components/SiteManagement/`)

**SiteProfile.tsx**
- Comprehensive site information display
- Risk history timeline
- Current threat status
- Recommended actions panel

**SiteForm.tsx**
- Add/edit heritage site details
- Location picker with map integration
- Initial risk factor setup
- Photo upload capability

#### 4. Mock Data Services (`/src/services/`)

**MockDataService.ts**
- Mock heritage site data (Al-Hallabat Complex, Petra, etc.)
- Simulated risk assessments with realistic values
- Fake external data integration with inline comments
- // TODO: Replace with real Firecrawl MCP integration

**StorageService.ts**
- Local storage management for mock data persistence
- Data export/import functionality
- // TODO: Add real API synchronization when backend is available

### Data Models

#### Site Model
```typescript
interface HeritageSite {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    country: string;
  };
  description: string;
  significance: string;
  currentStatus: 'active' | 'at-risk' | 'critical' | 'stable';
  lastAssessment: Date;
  riskProfile: RiskProfile;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Risk Assessment Model
```typescript
interface RiskAssessment {
  id: string;
  siteId: string;
  threatType: ThreatType;
  probability: number; // A component (1-5)
  lossOfValue: number; // B component (1-5)
  fractionAffected: number; // C component (1-5)
  magnitude: number; // A + B + C
  priority: 'extremely-high' | 'very-high' | 'high' | 'medium-high' | 'low';
  uncertaintyLevel: 'low' | 'medium' | 'high';
  assessmentDate: Date;
  assessor: string;
  notes: string;
}
```

#### Threat Types
```typescript
enum ThreatType {
  EARTHQUAKE = 'earthquake',
  FLOODING = 'flooding',
  WEATHERING = 'weathering',
  VEGETATION = 'vegetation',
  URBAN_DEVELOPMENT = 'urban-development',
  TOURISM_PRESSURE = 'tourism-pressure',
  LOOTING = 'looting',
  CONFLICT = 'conflict',
  CLIMATE_CHANGE = 'climate-change'
}
```

## Error Handling

### Client-Side Error Handling
- Form validation with real-time feedback
- Network error recovery with retry mechanisms
- Graceful degradation when external services are unavailable
- User-friendly error messages with actionable guidance

### Data Integration Error Handling
- Fallback to cached data when web scraping fails
- Timeout handling for slow external API responses
- Data validation to ensure integrity
- Error logging for debugging and monitoring

### Offline Capability
- Local storage for critical application data
- Queue system for pending operations when offline
- Automatic synchronization when connectivity returns
- Visual indicators for offline status

## Testing Strategy

### Unit Testing
- **Risk Calculation Logic**: Test ABC scale calculations, priority categorization, uncertainty matrix application
- **Data Models**: Validate data structure integrity and transformation functions
- **Utility Functions**: Test helper functions for data processing and validation

### Integration Testing
- **Firecrawl MCP Integration**: Test web scraping functionality and data enrichment
- **Chart Rendering**: Verify chart components render correctly with various data sets
- **Local Storage**: Test data persistence and retrieval mechanisms

### End-to-End Testing
- **Risk Assessment Workflow**: Complete user journey from site creation to risk assessment
- **Data Visualization**: Test interactive charts and map functionality
- **Mobile Responsiveness**: Verify application works on various screen sizes

### Performance Testing
- **Large Dataset Handling**: Test application performance with multiple sites and assessments
- **Chart Rendering Performance**: Ensure smooth interactions with complex visualizations
- **Memory Usage**: Monitor for memory leaks in long-running sessions

## Security Considerations

### Data Protection
- Input sanitization to prevent XSS attacks
- Secure handling of uploaded images and files
- Data encryption for sensitive heritage site information

### Access Control
- User authentication for site management features
- Role-based permissions for different user types
- Audit logging for risk assessment changes

### External API Security
- Secure API key management for external services
- Rate limiting to prevent abuse
- Data validation for all external data sources

## Performance Optimization

### Frontend Optimization
- Code splitting for faster initial load times
- Lazy loading of chart components
- Image optimization for heritage site photos
- Caching strategies for frequently accessed data

### Data Management
- Efficient data structures for risk calculations
- Pagination for large datasets
- Background data synchronization
- Optimized chart rendering with data sampling for large datasets

## Deployment and Scalability

### Development Environment
- Vite development server with hot module replacement
- Local storage for development data
- Mock services for external API testing

### Production Considerations
- Static site deployment (Netlify, Vercel)
- CDN integration for global performance
- Progressive Web App (PWA) capabilities for mobile users
- Analytics integration for usage monitoring