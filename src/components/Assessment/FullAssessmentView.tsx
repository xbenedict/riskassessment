import React, { useState, useEffect } from 'react';
import type { HeritageSite, RiskAssessment } from '../../types';
import { MockDataService } from '../../services/MockDataService';
import { RiskCalculator } from '../../utils/RiskCalculator';
import { Icon, type IconName } from '../UI';
import styles from './FullAssessmentView.module.css';

interface FullAssessmentViewProps {
  site: HeritageSite;
  onClose: () => void;
}

export const FullAssessmentView: React.FC<FullAssessmentViewProps> = ({
  site,
  onClose
}) => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'history'>('overview');

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const data = await MockDataService.getRiskAssessments(site.id);
        setAssessments(data);
      } catch (err) {
        setError('Failed to load risk assessments');
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [site.id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extremely-high': return '#dc3545';
      case 'very-high': return '#ff6b35';
      case 'high': return '#ffc107';
      case 'medium-high': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getThreatIcon = (threat: string): IconName => {
    switch (threat) {
      case 'earthquake': return 'globe';
      case 'flooding': return 'waves';
      case 'weathering': return 'cloud-rain';
      case 'vegetation': return 'leaf';
      case 'urban-development': return 'building';
      case 'tourism-pressure': return 'users';
      case 'looting': return 'alert-triangle';
      case 'conflict': return 'swords';
      case 'climate-change': return 'thermometer';
      default: return 'help-circle';
    }
  };

  const getUncertaintyColor = (level: string) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const calculateSummaryStats = () => {
    if (assessments.length === 0) return null;

    const totalThreats = assessments.length;
    const averageMagnitude = assessments.reduce((sum, a) => sum + a.magnitude, 0) / totalThreats;
    const highPriorityCount = assessments.filter(a => 
      a.priority === 'extremely-high' || a.priority === 'very-high'
    ).length;
    
    const threatDistribution = assessments.reduce((dist, assessment) => {
      dist[assessment.threatType] = (dist[assessment.threatType] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    const mostCommonThreat = Object.entries(threatDistribution)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalThreats,
      averageMagnitude: Math.round(averageMagnitude * 100) / 100,
      highPriorityCount,
      mostCommonThreat: mostCommonThreat ? mostCommonThreat[0] : null
    };
  };

  const stats = calculateSummaryStats();

  if (loading) {
    return (
      <div className={styles.assessmentView}>
        <div className={styles.loading}>Loading assessment data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.assessmentView}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.assessmentView}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={onClose} className={styles.backButton}>
            ← Back to Site
          </button>
          <div className={styles.siteInfo}>
            <h1>Full Risk Assessment</h1>
            <h2>{site.name}</h2>
            <p>{site.location.address}</p>
          </div>
        </div>
        
        <div className={styles.overallRisk}>
          <span className={styles.riskLabel}>Overall Risk Level</span>
          <span 
            className={styles.riskBadge}
            style={{ backgroundColor: getRiskColor(site.riskProfile.overallRisk) }}
          >
            {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'assessments' ? styles.active : ''}`}
          onClick={() => setActiveTab('assessments')}
        >
          Risk Assessments ({assessments.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Assessment History
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            {stats && (
              <div className={styles.summaryStats}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.totalThreats}</div>
                  <div className={styles.statLabel}>Total Threats</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.averageMagnitude}</div>
                  <div className={styles.statLabel}>Average Magnitude</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats.highPriorityCount}</div>
                  <div className={styles.statLabel}>High Priority</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {stats.mostCommonThreat ? getThreatIcon(stats.mostCommonThreat) : '—'}
                  </div>
                  <div className={styles.statLabel}>Most Common</div>
                </div>
              </div>
            )}

            <div className={styles.siteDescription}>
              <h3>Site Description</h3>
              <p>{site.description}</p>
              
              <h3>Historical Significance</h3>
              <p>{site.significance}</p>
              
              <div className={styles.statusInfo}>
                <h3>Current Status</h3>
                <div className={styles.statusDetails}>
                  <span className={`${styles.statusBadge} ${styles[site.currentStatus]}`}>
                    {site.currentStatus.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={styles.assessmentDate}>
                    Last assessment: {new Date(site.lastAssessment).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.activeThreats}>
              <h3>Active Threats</h3>
              <div className={styles.threatsGrid}>
                {site.riskProfile.activeThreats.map((threat, index) => (
                  <div key={index} className={styles.threatCard}>
                    <span className={styles.threatIcon}>
                      <Icon name={getThreatIcon(threat)} size="md" />
                    </span>
                    <span className={styles.threatName}>
                      {threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className={styles.assessments}>
            <div className={styles.assessmentsHeader}>
              <h3>Detailed Risk Assessments</h3>
              <p>Following ABC Scale methodology (A=Probability, B=Loss of Value, C=Fraction Affected)</p>
            </div>
            
            <div className={styles.assessmentsList}>
              {assessments.map((assessment) => (
                <div key={assessment.id} className={styles.assessmentCard}>
                  <div className={styles.assessmentHeader}>
                    <div className={styles.threatInfo}>
                      <span className={styles.threatIcon}>
                        {getThreatIcon(assessment.threatType)}
                      </span>
                      <div>
                        <h4>{assessment.threatType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <span className={styles.assessmentDate}>
                          {new Date(assessment.assessmentDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.priorityBadge}>
                      <span 
                        className={styles.priority}
                        style={{ backgroundColor: getRiskColor(assessment.priority) }}
                      >
                        {assessment.priority.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.assessmentDetails}>
                    <div className={styles.abcScores}>
                      <div className={styles.score}>
                        <span className={styles.scoreLabel}>A (Probability)</span>
                        <span className={styles.scoreValue}>{assessment.probability}/5</span>
                      </div>
                      <div className={styles.score}>
                        <span className={styles.scoreLabel}>B (Loss of Value)</span>
                        <span className={styles.scoreValue}>{assessment.lossOfValue}/5</span>
                      </div>
                      <div className={styles.score}>
                        <span className={styles.scoreLabel}>C (Fraction Affected)</span>
                        <span className={styles.scoreValue}>{assessment.fractionAffected}/5</span>
                      </div>
                      <div className={styles.score}>
                        <span className={styles.scoreLabel}>Magnitude (A+B+C)</span>
                        <span className={styles.scoreValue}>{assessment.magnitude}/15</span>
                      </div>
                    </div>

                    <div className={styles.uncertaintyLevel}>
                      <span className={styles.uncertaintyLabel}>Uncertainty Level:</span>
                      <span 
                        className={styles.uncertaintyValue}
                        style={{ color: getUncertaintyColor(assessment.uncertaintyLevel) }}
                      >
                        {assessment.uncertaintyLevel.toUpperCase()}
                      </span>
                    </div>

                    {assessment.notes && (
                      <div className={styles.assessmentNotes}>
                        <h5>Notes:</h5>
                        <p>{assessment.notes}</p>
                      </div>
                    )}

                    <div className={styles.assessorInfo}>
                      <span>Assessed by: {assessment.assessor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.history}>
            <h3>Assessment History</h3>
            <div className={styles.timeline}>
              {assessments
                .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())
                .map((assessment, index) => (
                  <div key={assessment.id} className={styles.timelineItem}>
                    <div className={styles.timelineDate}>
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span className={styles.threatIcon}>
                          {getThreatIcon(assessment.threatType)}
                        </span>
                        <span className={styles.threatName}>
                          {assessment.threatType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span 
                          className={styles.priorityBadge}
                          style={{ backgroundColor: getRiskColor(assessment.priority) }}
                        >
                          {assessment.priority.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.timelineDetails}>
                        <span>Magnitude: {assessment.magnitude}/15</span>
                        <span>Assessor: {assessment.assessor}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};