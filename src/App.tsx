import React, { useState } from 'react';
import { Dashboard } from './components/Visualization';
import { ReportGenerator } from './components/Reports/ReportGenerator';
import { TrendDashboard } from './components/Analytics/TrendDashboard';
import { DataManager } from './components/DataManagement/DataManager';
import './App.css';

type ActiveView = 'dashboard' | 'reports' | 'analytics' | 'data-management';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderActiveView = () => {
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
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <nav className="main-navigation">
        <div className="nav-brand">
          <h1>Heritage Guardian</h1>
          <span>Risk Assessment System</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-tab ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`nav-tab ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
          >
            📋 Reports
          </button>
          <button
            className={`nav-tab ${activeView === 'data-management' ? 'active' : ''}`}
            onClick={() => setActiveView('data-management')}
          >
            💾 Data Management
          </button>
        </div>
      </nav>
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App
