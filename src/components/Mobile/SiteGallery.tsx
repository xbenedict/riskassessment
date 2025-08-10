import React, { useEffect, useMemo, useState } from 'react';
import type { HeritageSite } from '../../types';
import { DataManager } from '../../services/DataManager';
import { Icon, Card } from '../UI';
import styles from './SiteGallery.module.css';
import backgroundImage from '../../assets/images/background.jpeg';

interface SiteGalleryProps {
  onSiteSelect: (siteId: string) => void;
}

export const SiteGallery: React.FC<SiteGalleryProps> = ({ onSiteSelect }) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add Site form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [significance, setSignificance] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!description.trim()) return 'Description is required';
    if (!significance.trim()) return 'Cultural significance is required';
    if (!address.trim()) return 'Address is required';
    if (!country.trim()) return 'Country is required';
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'Valid latitude and longitude are required';
    if (images.length === 0) return 'At least one image is required';
    return null;
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 3 - images.length);
    const readers = selected.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        })
    );
    try {
      const dataUrls = await Promise.all(readers);
      setImages((prev) => [...prev, ...dataUrls].slice(0, 3));
    } catch (e) {
      console.error(e);
      setFormError('Failed to load selected images');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSignificance('');
    setAddress('');
    setCountry('');
    setLatitude('');
    setLongitude('');
    setImages([]);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const newSiteData: Omit<HeritageSite, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        description: description.trim(),
        significance: significance.trim(),
        currentStatus: 'active',
        lastAssessment: new Date(),
        riskProfile: {
          overallRisk: 'low',
          lastUpdated: new Date(),
          activeThreats: []
        },
        images: images,
        location: {
          address: address.trim(),
          country: country.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude)
        }
      };
      await DataManager.addHeritageSite(newSiteData);
      const updated = await DataManager.getHeritageSites();
      setSites(updated);
      resetForm();
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
      setFormError('Failed to save site');
    } finally {
      setSaving(false);
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
              onClick={() => setShowAddForm((s) => !s)}
              aria-label={showAddForm ? 'Close add site form' : 'Add a site'}
            >
              <Icon name={showAddForm ? 'x' : 'plus'} size="md" />
            </button>
          </div>
        </div>
        <div className={styles.headerDescription}>
          <p>Tap a site to view details and risk assessment</p>
        </div>
      </header>

      {showAddForm && (
        <Card variant="elevated" padding="large" shadow="medium" className={styles.siteCard}>
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginTop: 0 }}>Add New Site</h2>
            {formError && (
              <div style={{ color: '#dc3545', marginBottom: '0.75rem' }}>{formError}</div>
            )}
            <div className={styles.siteInfo}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <label>
                  <span>Site Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., New Heritage Site"
                    required
                  />
                </label>
                <label>
                  <span>Description</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description"
                    required
                    rows={3}
                  />
                </label>
                <label>
                  <span>Cultural Significance</span>
                  <textarea
                    value={significance}
                    onChange={(e) => setSignificance(e.target.value)}
                    placeholder="Why is this site significant?"
                    required
                    rows={2}
                  />
                </label>
                <label>
                  <span>Address</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                  />
                </label>
                <label>
                  <span>Country</span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    required
                  />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <label>
                    <span>Latitude</span>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 31.95"
                      required
                    />
                  </label>
                  <label>
                    <span>Longitude</span>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., 35.91"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Images (up to 3)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageFiles(e.target.files)}
                    />
                  </label>
                  {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img src={img} alt={`Preview ${idx + 1}`} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                          <button
                            type="button"
                            aria-label="Remove image"
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            style={{ position: 'absolute', top: 2, right: 2, background: '#0008', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length < 3 && (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {3 - images.length} more image{3 - images.length === 1 ? '' : 's'} can be added
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => { resetForm(); setShowAddForm(false); }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Create Site'}
              </button>
            </div>
          </form>
        </Card>
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