# Unified Data Management System

## Problem Solved

Previously, the Heritage Risk Dashboard had **multiple sources of truth** for risk assessment data, leading to inconsistencies:

1. **Mock data** in `mockData.ts` with hardcoded risk profiles
2. **MockDataService** generating random assessments 
3. **RiskAssessmentService** storing new assessments separately in localStorage
4. **Site risk profiles** that were never updated when new assessments were added
5. **Charts and visualizations** pulling from different data sources

This meant that adding a new risk assessment wouldn't update the site's overall risk level, charts would show inconsistent data, and the dashboard wouldn't reflect the latest assessments.

## Solution: DataManager - Single Source of Truth

I've created a new `DataManager` service that serves as the **unified source of truth** for all risk assessment data. Here's how it works:

### Key Features

1. **Automatic Risk Profile Updates**: When you add, update, or delete a risk assessment, the site's risk profile is automatically recalculated
2. **Consistent Data Flow**: All components now get data from the same source
3. **Real-time Synchronization**: Charts, dashboards, and site lists all update immediately when data changes
4. **Intelligent Caching**: Performance optimization with 5-minute cache duration
5. **Backward Compatibility**: Existing services now delegate to DataManager

### How It Works

```typescript
// Before: Inconsistent data sources
const sites = await MockDataService.getHeritageSites(); // Static mock data
const assessments = await RiskAssessmentService.getAssessmentsForSite(siteId); // Separate storage

// After: Single source of truth
const sites = await DataManager.getHeritageSites(); // Always up-to-date with current assessments
const assessments = await DataManager.getAssessmentsForSite(siteId); // Same unified storage
```

### Automatic Risk Profile Calculation

When you add a new assessment:

```typescript
await DataManager.addAssessment({
  siteId: 'site-1',
  threatType: 'weathering',
  probability: 4,
  lossOfValue: 3,
  fractionAffected: 2,
  // ... other fields
});

// The system automatically:
// 1. Calculates magnitude (4+3+2 = 9)
// 2. Determines priority ('high' for magnitude 9)
// 3. Updates the site's overall risk profile
// 4. Refreshes active threats list
// 5. Updates last assessment date
// 6. Clears cache to ensure all components get fresh data
```

## Files Changed

### New Files
- `src/services/DataManager.ts` - The unified data management service
- `src/components/Demo/UnifiedDataDemo.tsx` - Interactive demo showing the system
- `src/components/Demo/UnifiedDataDemo.module.css` - Styling for the demo

### Updated Files
- `src/services/RiskAssessmentService.ts` - Now delegates to DataManager
- `src/services/MockDataService.ts` - Now delegates to DataManager
- `src/index.ts` - Exports DataManager
- `src/App.tsx` - Added demo route
- `src/components/Mobile/MobileNavigation.tsx` - Added demo navigation
- `src/components/Visualization/Dashboard.tsx` - Uses DataManager
- `src/components/Visualization/SiteMap.tsx` - Uses DataManager
- `src/components/SiteManagement/SiteList.tsx` - Uses DataManager
- `src/components/SiteManagement/SiteProfile.tsx` - Uses DataManager

## Testing the System

1. **Navigate to any heritage site** in the Sites tab
2. **View the comprehensive risk assessments** that are now automatically loaded
3. **Add a new risk assessment** through the assessment forms
4. **Watch the site's risk profile update automatically** in real-time
5. **See the new assessment appear in dashboards and charts**
6. **Notice all visualizations update consistently** across the application

## Benefits

### For Users
- **Consistent Data**: All charts, dashboards, and reports show the same up-to-date information
- **Real-time Updates**: Adding assessments immediately updates site risk levels
- **Accurate Analytics**: Trend analysis and reporting reflect actual current data

### For Developers
- **Single API**: One service to manage all risk assessment data
- **Automatic Synchronization**: No need to manually update multiple data sources
- **Performance**: Intelligent caching reduces redundant API calls
- **Maintainability**: Centralized data logic is easier to debug and extend

## Migration Path

The system is designed for **zero-disruption migration**:

1. **Existing code continues to work** - Old services delegate to DataManager
2. **Gradual migration** - Components can be updated to use DataManager directly
3. **Backward compatibility** - No breaking changes to existing APIs

## Future Enhancements

1. **Real-time WebSocket updates** for multi-user scenarios
2. **Optimistic updates** for better perceived performance
3. **Data validation** and integrity checks
4. **Audit logging** for all data changes
5. **Conflict resolution** for concurrent edits

## Usage Examples

### Adding a Risk Assessment
```typescript
const newAssessment = await DataManager.addAssessment({
  siteId: 'petra-1',
  threatType: 'weathering',
  probability: 4,
  lossOfValue: 3,
  fractionAffected: 2,
  uncertaintyLevel: 'medium',
  assessmentDate: new Date(),
  assessor: 'Dr. Sarah Mitchell',
  notes: 'Accelerated weathering observed on Treasury facade'
});

// Site risk profile is automatically updated
const updatedSite = await DataManager.getHeritageSite('petra-1');
console.log(updatedSite.riskProfile.overallRisk); // May have changed to 'high'
```

### Getting Consistent Data
```typescript
// All these calls return synchronized data
const sites = await DataManager.getHeritageSites();
const assessments = await DataManager.getAllAssessments();
const stats = await DataManager.getDashboardStats();

// Data is guaranteed to be consistent across all calls
```

### Searching Across All Data
```typescript
const { sites, assessments } = await DataManager.searchData({
  country: 'Jordan',
  threatType: 'weathering',
  riskLevel: 'high',
  searchTerm: 'petra'
});

// Returns only sites and assessments that match ALL criteria
```

This unified system ensures that your Heritage Risk Dashboard always shows accurate, up-to-date information, making it a reliable tool for heritage conservation decision-making.