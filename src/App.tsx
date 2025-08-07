import React, { useState } from 'react';
import { SiteGallery } from './components/Mobile/SiteGallery';
import { SiteDetail } from './components/Mobile/SiteDetail';
import { MobileNavigation } from './components/Mobile/MobileNavigation';
import { Dashboard } from './components/Visualization';
import { ReportGenerator } from './components/Reports/ReportGenerator';
import { TrendDashboard } from './components/Analytics/TrendDashboard';
import { DataManager } from './components/DataManagement/DataManager';
import './App.css';

type ActiveView = 'sites' | 'dashboard' | 'reports' | 'analytics' | 'data-management';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('sites');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId);
  };

  const handleBackToSites = () => {
    setSelectedSiteId(null);
    setActiveView('sites');
  };

  const renderActiveView = () => {
    if (activeView === 'sites') {
      if (selectedSiteId) {
        return (
          <SiteDetail 
            siteId={selectedSiteId} 
            onBack={handleBackToSites}
          />
        );
      }
      return <SiteGallery onSiteSelect={handleSiteSelect} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportGenerator />;
      case 'analytics':
        return <TrendDashboard />;
      case 'data-management':
        return <DataManager />;
      default:
        return <SiteGallery onSiteSelect={handleSiteSelect} />;
    }
  };

  return (
    <div className="App">
      <main className="main-content">
        {renderActiveView()}
      </main>
      <MobileNavigation 
        activeView={activeView} 
        onViewChange={setActiveView}
        showNavigation={!selectedSiteId}
      />
    </div>
  );
}

export default App
