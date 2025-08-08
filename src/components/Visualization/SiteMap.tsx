import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon as LeafletIcon, LatLngBounds } from 'leaflet';
import type { HeritageSite, RiskPriority, ThreatType } from '../../types';
import { DataManager } from '../../services/DataManager';
import { Icon } from '../UI';
import styles from './SiteMap.module.css';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface SiteMapProps {
  selectedSiteId?: string;
  onSiteSelect?: (site: HeritageSite) => void;
  showThreatZones?: boolean;
  className?: string;
}

interface ThreatZone {
  center: [number, number];
  radius: number;
  threatType: ThreatType;
  color: string;
}

/**
 * Interactive map component showing heritage site locations with risk-based color coding
 * Features:
 * - Risk level color coding for site markers
 * - Click-to-detail functionality for site information
 * - Threat zone overlays where applicable
 * - Responsive design for mobile viewing
 */
export const SiteMap: React.FC<SiteMapProps> = ({
  selectedSiteId,
  onSiteSelect,
  showThreatZones = false,
  className
}) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threatZones, setThreatZones] = useState<ThreatZone[]>([]);

  // Risk level color mapping
  const riskColors: Record<RiskPriority, string> = {
    'extremely-high': '#dc2626', // Red
    'very-high': '#ea580c',      // Orange-red
    'high': '#f59e0b',           // Orange
    'medium-high': '#eab308',    // Yellow
    'low': '#22c55e'             // Green
  };

  // Threat zone colors
  const threatColors: Record<ThreatType, string> = {
    'earthquake': '#dc2626',
    'flooding': '#3b82f6',
    'weathering': '#8b5cf6',
    'vegetation': '#22c55e',
    'urban-development': '#6b7280',
    'tourism-pressure': '#f59e0b',
    'looting': '#ef4444',
    'conflict': '#991b1b',
    'climate-change': '#059669'
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (showThreatZones && sites.length > 0) {
      generateThreatZones();
    }
  }, [showThreatZones, sites]);

  const loadSites = async () => {
    try {
      setLoading(true);
      const heritageSites = await DataManager.getHeritageSites();
      setSites(heritageSites);
    } catch (err) {
      setError('Failed to load heritage sites');
      console.error('Error loading sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateThreatZones = async () => {
    try {
      const zones: ThreatZone[] = [];
      
      for (const site of sites) {
        const assessments = await DataManager.getAssessmentsForSite(site.id);
        
        // Create threat zones for high-priority threats
        const highRiskThreats = assessments.filter(
          assessment => ['extremely-high', 'very-high', 'high'].includes(assessment.priority)
        );

        for (const assessment of highRiskThreats) {
          // Calculate radius based on threat type and magnitude
          let radius = 1000; // Base radius in meters
          
          switch (assessment.threatType) {
            case 'earthquake':
              radius = assessment.magnitude * 2000; // Larger zones for seismic threats
              break;
            case 'flooding':
              radius = assessment.magnitude * 1500;
              break;
            case 'urban-development':
              radius = assessment.magnitude * 800;
              break;
            case 'tourism-pressure':
              radius = assessment.magnitude * 500;
              break;
            default:
              radius = assessment.magnitude * 1000;
          }

          zones.push({
            center: [site.location.latitude, site.location.longitude],
            radius,
            threatType: assessment.threatType,
            color: threatColors[assessment.threatType]
          });
        }
      }
      
      setThreatZones(zones);
    } catch (err) {
      console.error('Error generating threat zones:', err);
    }
  };

  const createCustomIcon = (riskLevel: RiskPriority, isSelected: boolean = false): Icon => {
    const color = riskColors[riskLevel];
    const size = isSelected ? 35 : 25;
    
    // Create SVG icon with risk-based coloring
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="#ffffff"/>
        ${isSelected ? '<circle cx="12" cy="12" r="12" fill="none" stroke="#000000" stroke-width="2" stroke-dasharray="4,2"/>' : ''}
      </svg>
    `;

    return new LeafletIcon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  const handleSiteClick = (site: HeritageSite) => {
    if (onSiteSelect) {
      onSiteSelect(site);
    }
  };

  const formatThreatType = (threatType: ThreatType): string => {
    return threatType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatRiskLevel = (riskLevel: RiskPriority): string => {
    return riskLevel.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate map bounds to fit all sites
  const getMapBounds = (): LatLngBounds | undefined => {
    if (sites.length === 0) return undefined;
    
    const bounds = new LatLngBounds([]);
    sites.forEach(site => {
      bounds.extend([site.location.latitude, site.location.longitude]);
    });
    
    return bounds;
  };

  if (loading) {
    return (
      <div className={`${styles.mapContainer} ${className || ''}`}>
        <div className={styles.loading} data-testid="loading">
          <div className={styles.spinner}></div>
          <p>Loading heritage sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.mapContainer} ${className || ''}`}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={loadSites} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mapBounds = getMapBounds();
  const defaultCenter: [number, number] = [31.5, 35.9]; // Jordan center
  const defaultZoom = 7;

  return (
    <div className={`${styles.mapContainer} ${className || ''}`}>
      <div className={styles.mapHeader}>
        <h3>Heritage Sites Map</h3>
        <div className={styles.mapControls}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showThreatZones}
              onChange={(e) => {
                // This would be handled by parent component
                // For now, we'll just log the change
                console.log('Threat zones toggle:', e.target.checked);
              }}
            />
            Show Threat Zones
          </label>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          bounds={mapBounds}
          className={styles.leafletMap}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Threat zones */}
          {showThreatZones && threatZones.map((zone, index) => (
            <Circle
              key={`threat-zone-${index}`}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.1,
                weight: 2,
                opacity: 0.6
              }}
            >
              <Popup>
                <div className={styles.threatZonePopup}>
                  <h4>Threat Zone</h4>
                  <p><strong>Type:</strong> {formatThreatType(zone.threatType)}</p>
                  <p><strong>Radius:</strong> {(zone.radius / 1000).toFixed(1)} km</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Heritage site markers */}
          {sites.map(site => (
            <Marker
              key={site.id}
              position={[site.location.latitude, site.location.longitude]}
              icon={createCustomIcon(
                site.riskProfile.overallRisk,
                site.id === selectedSiteId
              )}
              eventHandlers={{
                click: () => handleSiteClick(site)
              }}
            >
              <Popup className={styles.sitePopup}>
                <div className={styles.popupContent}>
                  <h4>{site.name}</h4>
                  <p className={styles.location}>
                    <Icon name="map-pin" size="sm" /> {site.location.address}, {site.location.country}
                  </p>
                  
                  <div className={styles.riskInfo}>
                    <span className={styles.riskLabel}>Risk Level:</span>
                    <span 
                      className={`${styles.riskBadge} ${styles[`risk${site.riskProfile.overallRisk.replace('-', '')}`]}`}
                      style={{ backgroundColor: riskColors[site.riskProfile.overallRisk] }}
                    >
                      {formatRiskLevel(site.riskProfile.overallRisk)}
                    </span>
                  </div>

                  <div className={styles.statusInfo}>
                    <span className={styles.statusLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${styles[`status${site.currentStatus.replace('-', '')}`]}`}>
                      {site.currentStatus.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.threatsInfo}>
                    <span className={styles.threatsLabel}>Active Threats:</span>
                    <div className={styles.threatsList}>
                      {site.riskProfile.activeThreats.map(threat => (
                        <span key={threat} className={styles.threatTag}>
                          {formatThreatType(threat)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className={styles.description}>
                    {site.description.length > 150 
                      ? `${site.description.substring(0, 150)}...` 
                      : site.description
                    }
                  </p>

                  <div className={styles.popupActions}>
                    <button 
                      className={styles.viewDetailsButton}
                      onClick={() => handleSiteClick(site)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map legend */}
      <div className={styles.mapLegend}>
        <h4>Risk Levels</h4>
        <div className={styles.legendItems}>
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className={styles.legendItem}>
              <div 
                className={styles.legendColor}
                style={{ backgroundColor: color }}
              ></div>
              <span>{formatRiskLevel(level as RiskPriority)}</span>
            </div>
          ))}
        </div>
        
        {showThreatZones && (
          <>
            <h4>Threat Types</h4>
            <div className={styles.legendItems}>
              {Object.entries(threatColors).map(([threat, color]) => (
                <div key={threat} className={styles.legendItem}>
                  <div 
                    className={styles.legendColor}
                    style={{ backgroundColor: color, opacity: 0.6 }}
                  ></div>
                  <span>{formatThreatType(threat as ThreatType)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteMap;