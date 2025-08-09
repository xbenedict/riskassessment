import React from 'react';
import type { HeritageSite } from '../../types';
import { mockSites } from '../../utils/mockData';
import { Icon, Card } from '../UI';
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'extremely-high':
        return 'x-circle';
      case 'very-high':
        return 'alert-triangle';
      case 'high':
        return 'alert-triangle';
      case 'medium-high':
        return 'alert-circle';
      case 'low':
        return 'check-circle';
      default:
        return 'help-circle';
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
          <Card
            key={site.id}
            interactive
            padding="none"
            shadow="medium"
            className={styles.siteCard}
            onClick={() => onSiteSelect(site.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSiteSelect(site.id);
              }
            }}
            aria-label={`View details for ${site.name}`}
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
                <Icon 
                  name={getRiskIcon(site.riskProfile.overallRisk) as any}
                  size="sm" 
                  color="white"
                  className={styles.riskIcon}
                />
                <span>{getRiskLabel(site.riskProfile.overallRisk)}</span>
              </div>

            </div>
            
            <div className={styles.siteInfo}>
              <h3>{site.name}</h3>
              <p className={styles.siteLocation}>
                <Icon name="map-pin" size="sm" />
                <span>{site.location.address}</span>
              </p>
              <p className={styles.siteDescription}>{site.description}</p>
              
              <div className={styles.siteMeta}>
                <div className={styles.threatInfo}>
                  <Icon name="alert-triangle" size="sm" color="#fd7e14" />
                  <span className={styles.threatCount}>
                    {site.riskProfile.activeThreats.length} active threats
                  </span>
                </div>
                <div className={styles.updateInfo}>
                  <Icon name="bar-chart-3" size="sm" color="#6c757d" />
                  <span className={styles.lastUpdated}>
                    {new Date(site.riskProfile.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};