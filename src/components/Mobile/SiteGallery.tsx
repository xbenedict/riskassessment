import React from 'react';
import type { HeritageSite } from '../../types';
import { mockSites } from '../../utils/mockData';
import { Icon } from '../UI';
import styles from './SiteGallery.module.css';

interface SiteGalleryProps {
  onSiteSelect: (siteId: string) => void;
}

export const SiteGallery: React.FC<SiteGalleryProps> = ({ onSiteSelect }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extremely-high':
        return '#dc3545';
      case 'very-high':
        return '#ff6b35';
      case 'high':
        return '#ffc107';
      case 'medium-high':
        return '#fd7e14';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'extremely-high':
        return 'Critical';
      case 'very-high':
        return 'Very High';
      case 'high':
        return 'High';
      case 'medium-high':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={styles.siteGallery}>
      <header className={styles.galleryHeader}>
        <h1>Heritage Sites</h1>
        <p>Tap a site to view details and risk assessment</p>
      </header>
      
      <div className={styles.sitesGrid}>
        {mockSites.map((site) => (
          <div
            key={site.id}
            className={styles.siteCard}
            onClick={() => onSiteSelect(site.id)}
          >
            <div className={styles.siteImage}>
              <img 
                src={site.images[0] || '/api/placeholder/300/200'} 
                alt={site.name}
                loading="lazy"
              />
              <div 
                className={styles.riskBadge}
                style={{ backgroundColor: getRiskColor(site.riskProfile.overallRisk) }}
              >
                {getRiskLabel(site.riskProfile.overallRisk)}
              </div>
            </div>
            
            <div className={styles.siteInfo}>
              <h3>{site.name}</h3>
              <p className={styles.siteLocation}>
                <Icon name="map-pin" size="sm" />
                {site.location.address}
              </p>
              <p className={styles.siteDescription}>{site.description}</p>
              
              <div className={styles.siteMeta}>
                <span className={styles.threatCount}>
                  {site.riskProfile.activeThreats.length} active threats
                </span>
                <span className={styles.lastUpdated}>
                  Updated {new Date(site.riskProfile.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};