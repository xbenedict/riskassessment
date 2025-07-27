// Test component for Chart functionality
// This component can be used to test and demonstrate chart features

import React, { useState, useEffect } from 'react';
import { ChartDashboard } from './ChartDashboard';
import { RiskChart } from './RiskChart';
import { MockDataService } from '../../services/MockDataService';
import type { RiskAssessment } from '../../types';

/**
 * Chart Test Component
 * Demonstrates chart functionality with sample data
 */
export const ChartTest: React.FC = () => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      // Load sample assessments from Al-Hallabat Complex
      const sampleAssessments = await MockDataService.getRiskAssessments('site-001');
      setAssessments(sampleAssessments);
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChartClick = (data: any) => {
    console.log('Chart clicked:', data);
    alert(`Clicked on ${data.assessment?.threatType} with magnitude ${data.assessment?.magnitude}`);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading test data...</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Chart Component Test</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Individual Chart Components</h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3>Risk Magnitude Chart</h3>
          <RiskChart
            assessments={assessments}
            chartType="magnitude"
            title="Risk Magnitude by Threat Type"
            onChartClick={handleChartClick}
            showExport={true}
            responsive={true}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Risk Category Distribution</h3>
          <RiskChart
            assessments={assessments}
            chartType="category"
            title="Risk Priority Distribution"
            onChartClick={handleChartClick}
            showExport={true}
            responsive={true}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Threat Type Comparison</h3>
          <RiskChart
            assessments={assessments}
            chartType="threat-comparison"
            title="Threat Type Analysis"
            onChartClick={handleChartClick}
            showExport={true}
            responsive={true}
          />
        </div>
      </section>

      <section>
        <h2>Complete Chart Dashboard</h2>
        <ChartDashboard
          title="Heritage Risk Assessment Dashboard"
          showSiteSelector={true}
        />
      </section>
    </div>
  );
};

export default ChartTest;