// Temporal Analysis Demo Component
// Demonstrates the temporal analysis functionality for heritage risk assessment

import React from 'react';
import { TemporalAnalysis } from './TemporalAnalysis';
import styles from './TemporalAnalysisDemo.module.css';

/**
 * Demo component showcasing temporal analysis features
 * This component demonstrates:
 * - Time-series charts showing risk evolution over time
 * - Comparative analysis between different heritage sites  
 * - Trend indicators and forecasting visualizations
 */
export const TemporalAnalysisDemo: React.FC = () => {
  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1 className={styles.title}>Heritage Risk Temporal Analysis Demo</h1>
        <p className={styles.description}>
          This demo showcases the temporal analysis capabilities for heritage site risk assessment.
          The system provides comprehensive time-series analysis, comparative trends between sites,
          and forecasting visualizations to support decision-making for heritage conservation.
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>📈 Time-Series Analysis</h3>
          <p>Track risk evolution over time with interactive charts showing magnitude trends and forecasting.</p>
        </div>
        <div className={styles.feature}>
          <h3>🔄 Comparative Analysis</h3>
          <p>Compare risk trends across multiple heritage sites with correlation analysis.</p>
        </div>
        <div className={styles.feature}>
          <h3>⚠️ Threat Evolution</h3>
          <p>Analyze specific threat types over time with critical period identification.</p>
        </div>
      </div>

      <div className={styles.analysisContainer}>
        <TemporalAnalysis />
      </div>

      <div className={styles.footer}>
        <h3>Implementation Notes</h3>
        <ul>
          <li>Uses Chart.js for interactive time-series visualizations</li>
          <li>Implements ABC scale methodology for risk magnitude calculation</li>
          <li>Provides linear regression trend analysis with forecasting</li>
          <li>Includes correlation analysis for comparative site assessment</li>
          <li>Supports mobile-responsive design for field use</li>
        </ul>
      </div>
    </div>
  );
};