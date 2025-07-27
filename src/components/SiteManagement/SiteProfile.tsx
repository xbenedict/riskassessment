import React, { useState, useEffect } from 'react';
import { MockDataService } from '../../services/MockDataService';
import { RiskCalculator } from '../../utils/RiskCalculator';
import type { HeritageSite, RiskAssessment } from '../../types';
import styles from './SiteProfile.module.css';

interface SiteProfileProps {
  siteId: string;
  onClose?: () => void;
}

export const SiteProfile: React.FC<SiteProfileProps> = ({ siteId, onClose }) => {
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [siteData, assessments] = await Promise.all([
          MockDataService.getHeritageSite(siteId),
          MockDataService.getRiskAssessments(siteId)
        ]);

        if (!siteData) {
          setError('Heritage site not found');
          return;
        }

        setSite(siteData);
        setRiskAssessments(assessments.sort((a, b) => 
          b.assessmentDate.getTime() - a.assessmentDate.getTime()
        ));
      } catch (err) {
        setError('Failed to load site data');
        console.error('Error loading site data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSiteData();
  }, [siteId]);

  const getRiskLevelColor = (priority: string): string => {
    const colors = {
      'extremely-high': '#dc3545',
      'very-high': '#fd7e14',
      'high': '#ffc107',
      'medium-high': '#20c997',
      'low': '#28a745'
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRecommendedActions = (assessments: RiskAssessment[]): string[] => {
    const actions: string[] = [];
    
    assessments.forEach(assessment => {
      if (assessment.priority === 'extremely-high') {
        actions.push(`Immediate intervention required for ${assessment.threatType} threat`);
      } else if (assessment.priority === 'very-high') {
        actions.push(`Urgent action needed for ${assessment.threatType} threat`);
      } else if (assessment.priority === 'high') {
        actions.push(`Plan intervention for ${assessment.threatType} threat`);
      }
    });

    if (actions.length === 0) {
      actions.push('Continue routine monitoring and maintenance');
    }

    return actions.slice(0, 5); // Limit to top 5 actions
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading site profile...</div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'Site not found'}
          {onClose && (
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  const recommendedActions = getRecommendedActions(riskAssessments);

  return (
    <div className={styles.container}>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
      )}
      
      {/* Site Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.siteName}>{site.name}</h1>
          <div className={styles.statusBadge} style={{ 
            backgroundColor: getRiskLevelColor(site.riskProfile.overallRisk) 
          }}>
            {site.currentStatus.toUpperCase()}
          </div>
        </div>
        <div className={styles.location}>
          📍 {site.location.address}, {site.location.country}
        </div>
        <div className={styles.coordinates}>
          {site.location.latitude.toFixed(4)}°N, {site.location.longitude.toFixed(4)}°E
        </div>
      </header>

      {/* Photo Gallery */}
      {site.images.length > 0 && (
        <section className={styles.photoGallery}>
          <h2>Site Documentation</h2>
          <div className={styles.mainImage}>
            <img 
              src={site.images[selectedImageIndex]} 
              alt={`${site.name} - Image ${selectedImageIndex + 1}`}
              className={styles.galleryImage}
            />
          </div>
          {site.images.length > 1 && (
            <div className={styles.thumbnails}>
              {site.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`${styles.thumbnail} ${
                    index === selectedImageIndex ? styles.thumbnailActive : ''
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className={styles.content}>
        {/* Site Information */}
        <section className={styles.siteInfo}>
          <h2>Site Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>Description</h3>
              <p>{site.description}</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Cultural Significance</h3>
              <p>{site.significance}</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Last Assessment</h3>
              <p>{formatDate(site.lastAssessment)}</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Site Created</h3>
              <p>{formatDate(site.createdAt)}</p>
            </div>
          </div>
        </section>

        {/* Current Threat Status */}
        <section className={styles.threatStatus}>
          <h2>Current Threat Status</h2>
          <div className={styles.overallRisk}>
            <div className={styles.riskIndicator}>
              <div 
                className={styles.riskLevel}
                style={{ backgroundColor: getRiskLevelColor(site.riskProfile.overallRisk) }}
              >
                {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
              </div>
              <div className={styles.riskDescription}>
                {RiskCalculator.getPriorityDescription(site.riskProfile.overallRisk)}
              </div>
            </div>
          </div>
          
          <div className={styles.activeThreats}>
            <h3>Active Threats</h3>
            <div className={styles.threatList}>
              {site.riskProfile.activeThreats.map((threat, index) => (
                <span key={index} className={styles.threatTag}>
                  {threat.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Actions */}
        <section className={styles.recommendedActions}>
          <h2>Recommended Actions</h2>
          <ul className={styles.actionsList}>
            {recommendedActions.map((action, index) => (
              <li key={index} className={styles.actionItem}>
                {action}
              </li>
            ))}
          </ul>
        </section>

        {/* Risk Assessment History */}
        <section className={styles.riskHistory}>
          <h2>Risk Assessment History</h2>
          {riskAssessments.length === 0 ? (
            <p className={styles.noData}>No risk assessments available for this site.</p>
          ) : (
            <div className={styles.timeline}>
              {riskAssessments.map((assessment, index) => (
                <div key={assessment.id} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <div 
                      className={styles.timelineDot}
                      style={{ backgroundColor: getRiskLevelColor(assessment.priority) }}
                    />
                    {index < riskAssessments.length - 1 && (
                      <div className={styles.timelineLine} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.assessmentHeader}>
                      <h3 className={styles.threatType}>
                        {assessment.threatType.replace('-', ' ')} Threat
                      </h3>
                      <div className={styles.assessmentMeta}>
                        <span className={styles.assessmentDate}>
                          {formatDate(assessment.assessmentDate)}
                        </span>
                        <span className={styles.assessor}>by {assessment.assessor}</span>
                      </div>
                    </div>
                    
                    <div className={styles.riskDetails}>
                      <div className={styles.abcComponents}>
                        <div className={styles.component}>
                          <span className={styles.componentLabel}>Probability (A)</span>
                          <span className={styles.componentValue}>{assessment.probability}</span>
                        </div>
                        <div className={styles.component}>
                          <span className={styles.componentLabel}>Loss of Value (B)</span>
                          <span className={styles.componentValue}>{assessment.lossOfValue}</span>
                        </div>
                        <div className={styles.component}>
                          <span className={styles.componentLabel}>Fraction Affected (C)</span>
                          <span className={styles.componentValue}>{assessment.fractionAffected}</span>
                        </div>
                        <div className={styles.magnitude}>
                          <span className={styles.componentLabel}>Magnitude</span>
                          <span className={styles.magnitudeValue}>{assessment.magnitude}</span>
                        </div>
                      </div>
                      
                      <div className={styles.priorityBadge}>
                        <span 
                          className={styles.priority}
                          style={{ backgroundColor: getRiskLevelColor(assessment.priority) }}
                        >
                          {assessment.priority.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={styles.uncertainty}>
                          Uncertainty: {assessment.uncertaintyLevel}
                        </span>
                      </div>
                    </div>
                    
                    {assessment.notes && (
                      <div className={styles.assessmentNotes}>
                        <h4>Assessment Notes</h4>
                        <p>{assessment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};