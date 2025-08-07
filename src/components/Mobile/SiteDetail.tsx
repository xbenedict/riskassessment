import React, { useState } from 'react';
import type { HeritageSite } from '../../types';
import { mockSites } from '../../utils/mockData';
import styles from './SiteDetail.module.css';

interface SiteDetailProps {
  siteId: string;
  onBack: () => void;
}

export const SiteDetail: React.FC<SiteDetailProps> = ({ siteId, onBack }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const site = mockSites.find(s => s.id === siteId);

  if (!site) {
    return (
      <div className={styles.siteDetail}>
        <div className={styles.detailHeader}>
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        </div>
        <div className={styles.errorMessage}>Site not found</div>
      </div>
    );
  }

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

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case 'earthquake': return '🌍';
      case 'flooding': return '🌊';
      case 'weathering': return '🌧️';
      case 'vegetation': return '🌿';
      case 'urban-development': return '🏗️';
      case 'tourism-pressure': return '👥';
      case 'looting': return '⚠️';
      case 'conflict': return '⚔️';
      case 'climate-change': return '🌡️';
      default: return '❓';
    }
  };

  return (
    <div className={styles.siteDetail}>
      <div className={styles.detailHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Sites
        </button>
      </div>

      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          <img 
            src={site.images[activeImageIndex] || '/api/placeholder/400/300'} 
            alt={site.name}
          />
          <div 
            className={styles.riskBadge}
            style={{ backgroundColor: getRiskColor(site.riskProfile.overallRisk) }}
          >
            {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
          </div>
        </div>
        
        {site.images.length > 1 && (
          <div className={styles.imageThumbnails}>
            {site.images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image || '/api/placeholder/80/60'} alt={`${site.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.siteContent}>
        <div className={styles.siteHeader}>
          <h1>{site.name}</h1>
          <p className={styles.location}>📍 {site.location.address}</p>
        </div>

        <div className={styles.infoSection}>
          <h3>Description</h3>
          <p>{site.description}</p>
        </div>

        <div className={styles.infoSection}>
          <h3>Historical Significance</h3>
          <p>{site.significance}</p>
        </div>

        <div className={styles.riskSection}>
          <h3>Risk Assessment</h3>
          <div className={styles.riskOverview}>
            <div className={styles.riskLevel}>
              <span className={styles.riskLabel}>Overall Risk Level:</span>
              <span 
                className={styles.riskValue}
                style={{ color: getRiskColor(site.riskProfile.overallRisk) }}
              >
                {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div className={styles.lastAssessment}>
              Last updated: {new Date(site.riskProfile.lastUpdated).toLocaleDateString()}
            </div>
          </div>

          <div className={styles.activeThreats}>
            <h4>Active Threats ({site.riskProfile.activeThreats.length})</h4>
            <div className={styles.threatsGrid}>
              {site.riskProfile.activeThreats.map((threat, index) => (
                <div key={index} className={styles.threatItem}>
                  <span className={styles.threatIcon}>{getThreatIcon(threat)}</span>
                  <span className={styles.threatName}>
                    {threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Site Status</h3>
          <div className={styles.statusInfo}>
            <span className={`${styles.statusBadge} ${styles[`status${site.currentStatus.replace('-', '').replace(/\b\w/g, l => l.toUpperCase())}`]}`}>
              {site.currentStatus.replace('-', ' ').toUpperCase()}
            </span>
            <span className={styles.assessmentDate}>
              Last assessment: {new Date(site.lastAssessment).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${styles.primary}`}>
            📊 View Full Assessment
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`}>
            📍 View on Map
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`}>
            📋 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};