import React, { useState, useEffect } from 'react';
import type { HeritageSite } from '../../types';
import { mockSites } from '../../utils/mockData';
import { Icon, type IconName } from '../UI';
import styles from './SiteMapView.module.css';

interface SiteMapViewProps {
  site: HeritageSite;
  onClose: () => void;
}

export const SiteMapView: React.FC<SiteMapViewProps> = ({ site, onClose }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(site);
  const [allSites] = useState<HeritageSite[]>(mockSites);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const nearbySites = allSites
    .filter(s => s.id !== selectedSite.id)
    .map(s => ({
      ...s,
      distance: calculateDistance(
        selectedSite.location.latitude,
        selectedSite.location.longitude,
        s.location.latitude,
        s.location.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  return (
    <div className={styles.mapView}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.backButton}>
          ← Back to Site
        </button>
        <div className={styles.headerInfo}>
          <h1>Site Location</h1>
          <h2>{selectedSite.name}</h2>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.mapArea}>
          {!mapLoaded ? (
            <div className={styles.mapLoading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading interactive map...</p>
            </div>
          ) : (
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapOverlay}>
                <div className={styles.centerMarker}>
                  <div 
                    className={styles.siteMarker}
                    style={{ backgroundColor: getRiskColor(selectedSite.riskProfile.overallRisk) }}
                  >
                    <Icon name="map-pin" size="sm" />
                  </div>
                  <div className={styles.markerLabel}>
                    {selectedSite.name}
                  </div>
                </div>
                
                {/* Simulate nearby sites on map */}
                {nearbySites.slice(0, 3).map((site, index) => (
                  <div 
                    key={site.id}
                    className={styles.nearbyMarker}
                    style={{
                      top: `${30 + index * 15}%`,
                      left: `${20 + index * 20}%`
                    }}
                    onClick={() => setSelectedSite(site)}
                  >
                    <div 
                      className={styles.siteMarker}
                      style={{ backgroundColor: getRiskColor(site.riskProfile.overallRisk) }}
                    >
                      <Icon name="map-pin" size="sm" />
                    </div>
                    <div className={styles.markerLabel}>
                      {site.name}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.mapInfo}>
                <p>Interactive map showing {selectedSite.name} and nearby heritage sites</p>
                <div className={styles.coordinates}>
                  <span><Icon name="map-pin" size="sm" /> {selectedSite.location.latitude.toFixed(4)}, {selectedSite.location.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.siteDetails}>
            <div className={styles.siteImage}>
              <img 
                src={selectedSite.images[0] || '/api/placeholder/300/200'} 
                alt={selectedSite.name}
              />
              <div 
                className={styles.riskBadge}
                style={{ backgroundColor: getRiskColor(selectedSite.riskProfile.overallRisk) }}
              >
                {selectedSite.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            <div className={styles.siteInfo}>
              <h3>{selectedSite.name}</h3>
              <p className={styles.address}>{selectedSite.location.address}</p>
              <p className={styles.description}>{selectedSite.description}</p>

              <div className={styles.locationDetails}>
                <div className={styles.locationItem}>
                  <span className={styles.label}>Coordinates:</span>
                  <span className={styles.value}>
                    {selectedSite.location.latitude.toFixed(4)}, {selectedSite.location.longitude.toFixed(4)}
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.label}>Country:</span>
                  <span className={styles.value}>{selectedSite.location.country}</span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.label}>Status:</span>
                  <span className={`${styles.value} ${styles.status}`}>
                    {selectedSite.currentStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className={styles.threats}>
                <h4>Active Threats</h4>
                <div className={styles.threatsList}>
                  {selectedSite.riskProfile.activeThreats.map((threat, index) => (
                    <div key={index} className={styles.threatItem}>
                      <span className={styles.threatIcon}>
                        <Icon name={getThreatIcon(threat)} size="sm" />
                      </span>
                      <span className={styles.threatName}>
                        {threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.nearbySites}>
            <h4>Nearby Heritage Sites</h4>
            <div className={styles.nearbyList}>
              {nearbySites.map((site) => (
                <div 
                  key={site.id} 
                  className={styles.nearbyItem}
                  onClick={() => setSelectedSite(site)}
                >
                  <div className={styles.nearbyInfo}>
                    <div className={styles.nearbyName}>{site.name}</div>
                    <div className={styles.nearbyDistance}>
                      {site.distance.toFixed(1)} km away
                    </div>
                  </div>
                  <div 
                    className={styles.nearbyRisk}
                    style={{ backgroundColor: getRiskColor(site.riskProfile.overallRisk) }}
                  >
                    {site.riskProfile.overallRisk.charAt(0).toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapControls}>
            <h4>Map Controls</h4>
            <div className={styles.controlButtons}>
              <button className={styles.controlBtn}><Icon name="search" size="sm" /> Zoom In</button>
              <button className={styles.controlBtn}><Icon name="search" size="sm" /> Zoom Out</button>
              <button className={styles.controlBtn}><Icon name="globe" size="sm" /> Satellite View</button>
              <button className={styles.controlBtn}><Icon name="map-pin" size="sm" /> Center on Site</button>
            </div>
          </div>

          <div className={styles.legend}>
            <h4>Risk Level Legend</h4>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#dc3545' }}></div>
                <span>Extremely High</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#ff6b35' }}></div>
                <span>Very High</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#ffc107' }}></div>
                <span>High</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#fd7e14' }}></div>
                <span>Medium</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#28a745' }}></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};