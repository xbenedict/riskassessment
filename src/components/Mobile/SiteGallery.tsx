import React, { useEffect, useMemo, useState } from 'react';
import type { HeritageSite } from '../../types';
import { DataManager } from '../../services/DataManager';
import { Icon, Card } from '../UI';
import { SiteForm } from '../SiteManagement/SiteForm';
import styles from './SiteGallery.module.css';
import backgroundImage from '../../assets/images/background.jpeg';

interface SiteGalleryProps {
  onSiteSelect: (siteId: string) => void;
}

export const SiteGallery: React.FC<SiteGalleryProps> = ({ onSiteSelect }) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add Site modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await DataManager.getHeritageSites();
        setSites(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load sites');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalSites = useMemo(() => sites.length, [sites]);

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

  const handleSiteSubmit = async (site: HeritageSite) => {
    try {
      await DataManager.addHeritageSite(site);
      const updated = await DataManager.getHeritageSites();
      setSites(updated);
      setShowAddModal(false);
    } catch (e) {
      console.error('Failed to save site:', e);
      // Error handling is managed by the SiteForm component
    }
  };

  const handleAddModalCancel = () => {
    setShowAddModal(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scroll
    };
  }, [showAddModal]);

  const handleModalOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowAddModal(false);
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
    <div 
      className={styles.siteGallery}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <div className={styles.brandSection}>
            <div className={styles.titleSection}>
              <h1 className={styles.appTitle}>Heritage Sites</h1>
              <p className={styles.appSubtitle}>Risk Assessment Platform</p>
            </div>
          </div>
          <div className={styles.headerMeta}>
            <div className={styles.statsQuick}>
              <span className={styles.statValue}>{totalSites}</span>
              <span className={styles.statLabel}>Sites</span>
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setShowAddModal(true)}
              aria-label="Add a site"
            >
              +
            </button>
          </div>
        </div>
        <div className={styles.headerDescription}>
          <p>Tap a site to view details and risk assessment</p>
        </div>
      </header>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
          <div className={styles.modalContainer}>
            <SiteForm
              onSave={handleSiteSubmit}
              onCancel={handleAddModalCancel}
            />
          </div>
        </div>
      )}
      
      {loading && (
        <div className={styles.sitesGrid}>
          <Card padding="large" className={styles.siteCard}>Loading sites…</Card>
        </div>
      )}

      {error && !loading && (
        <div className={styles.sitesGrid}>
          <Card padding="large" className={styles.siteCard}>
            <div style={{ color: '#dc3545' }}>{error}</div>
          </Card>
        </div>
      )}

      {!loading && !error && (
      <div className={styles.sitesGrid}>
        {sites.map((site) => (
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
      )}
    </div>
  );
};