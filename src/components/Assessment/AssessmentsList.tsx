import React, { useState, useEffect } from 'react';
import { RiskAssessmentService } from '../../services/RiskAssessmentService';
import type { RiskAssessment, HeritageSite } from '../../types';
import styles from './AssessmentsList.module.css';

interface AssessmentsListProps {
  site: HeritageSite;
  onViewAssessment?: (assessment: RiskAssessment) => void;
  onEditAssessment?: (assessment: RiskAssessment) => void;
}

export const AssessmentsList: React.FC<AssessmentsListProps> = ({
  site,
  onViewAssessment,
  onEditAssessment
}) => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadAssessments();
  }, [site.id]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const siteAssessments = await RiskAssessmentService.getAssessmentsForSite(site.id);
      setAssessments(siteAssessments);
    } catch (err) {
      setError('Failed to load assessments');
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await RiskAssessmentService.deleteAssessment(assessmentId);
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
    } catch (err) {
      setError('Failed to delete assessment');
      console.error('Error deleting assessment:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getThreatLabel = (threat: string): string => {
    return threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'extremely-high': return '#dc3545';
      case 'very-high': return '#fd7e14';
      case 'high': return '#ffc107';
      case 'medium-high': return '#20c997';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className={styles.assessmentsList}>
        <div className={styles.loading}>Loading assessments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.assessmentsList}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className={styles.assessmentsList}>
        <div className={styles.emptyState}>
          <h3>No Assessments Yet</h3>
          <p>No risk assessments have been submitted for this site.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.assessmentsList}>
      <div className={styles.header}>
        <h3>Risk Assessments ({assessments.length})</h3>
      </div>

      <div className={styles.assessments}>
        {assessments.map(assessment => (
          <div key={assessment.id} className={styles.assessmentCard}>
            <div className={styles.assessmentHeader}>
              <div className={styles.threatInfo}>
                <h4 className={styles.threatType}>
                  {getThreatLabel(assessment.threatType)}
                </h4>
                <div className={styles.assessmentDate}>
                  {formatDate(assessment.assessmentDate)}
                </div>
              </div>
              <div 
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(assessment.priority) }}
              >
                {assessment.priority.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            <div className={styles.assessmentMeta}>
              <div className={styles.assessor}>
                <strong>Assessor:</strong> {assessment.assessor}
              </div>
              <div className={styles.uncertainty}>
                <strong>Uncertainty:</strong> {assessment.uncertaintyLevel.toUpperCase()}
              </div>
            </div>

            <div className={styles.abcValues}>
              <div className={styles.abcItem}>
                <span className={styles.abcLabel}>A (Probability):</span>
                <span className={styles.abcValue}>{assessment.probability}</span>
              </div>
              <div className={styles.abcItem}>
                <span className={styles.abcLabel}>B (Loss of Value):</span>
                <span className={styles.abcValue}>{assessment.lossOfValue}</span>
              </div>
              <div className={styles.abcItem}>
                <span className={styles.abcLabel}>C (Fraction Affected):</span>
                <span className={styles.abcValue}>{assessment.fractionAffected}</span>
              </div>
              <div className={styles.magnitude}>
                <span className={styles.magnitudeLabel}>Magnitude:</span>
                <span className={styles.magnitudeValue}>{assessment.magnitude}</span>
              </div>
            </div>

            {assessment.notes && (
              <div className={styles.notes}>
                <strong>Notes:</strong>
                <p>{assessment.notes.substring(0, 150)}...</p>
              </div>
            )}

            <div className={styles.assessmentActions}>
              {onViewAssessment && (
                <button
                  onClick={() => onViewAssessment(assessment)}
                  className={styles.viewButton}
                >
                  View Details
                </button>
              )}
              {onEditAssessment && (
                <button
                  onClick={() => onEditAssessment(assessment)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDeleteAssessment(assessment.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};