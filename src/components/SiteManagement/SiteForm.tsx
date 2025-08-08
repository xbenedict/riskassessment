import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { MockDataService } from '../../services/MockDataService';
import type { HeritageSite, SiteStatus, ThreatType } from '../../types';
import { Icon } from '../UI';
import styles from './SiteForm.module.css';

interface SiteFormProps {
  siteId?: string; // If provided, edit mode; if not, create mode
  onSave: (site: HeritageSite) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  significance: string;
  currentStatus: SiteStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    country: string;
  };
  images: string[];
  initialThreats: ThreatType[];
}

interface FormErrors {
  name?: string;
  description?: string;
  significance?: string;
  address?: string;
  country?: string;
  location?: string;
}

// Component for handling map clicks to set location
const LocationPicker: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: [number, number] | null;
}> = ({ onLocationSelect, selectedPosition }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return selectedPosition ? (
    <Marker position={selectedPosition} />
  ) : null;
};

export const SiteForm: React.FC<SiteFormProps> = ({ siteId, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    significance: '',
    currentStatus: 'active',
    location: {
      latitude: 31.9539, // Default to Jordan center
      longitude: 35.9106,
      address: '',
      country: 'Jordan'
    },
    images: [],
    initialThreats: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available threat types for initial setup
  const availableThreats: { value: ThreatType; label: string }[] = [
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'weathering', label: 'Weathering' },
    { value: 'vegetation', label: 'Vegetation' },
    { value: 'urban-development', label: 'Urban Development' },
    { value: 'tourism-pressure', label: 'Tourism Pressure' },
    { value: 'looting', label: 'Looting' },
    { value: 'conflict', label: 'Conflict' },
    { value: 'climate-change', label: 'Climate Change' }
  ];

  // Load existing site data if in edit mode
  useEffect(() => {
    const loadSiteData = async () => {
      if (siteId) {
        setLoading(true);
        setIsEditMode(true);
        try {
          const site = await MockDataService.getHeritageSite(siteId);
          if (site) {
            setFormData({
              name: site.name,
              description: site.description,
              significance: site.significance,
              currentStatus: site.currentStatus,
              location: site.location,
              images: site.images,
              initialThreats: site.riskProfile.activeThreats
            });
            setSelectedPosition([site.location.latitude, site.location.longitude]);
            setImagePreview(site.images);
          }
        } catch (error) {
          console.error('Error loading site data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Set default position for new sites
        setSelectedPosition([formData.location.latitude, formData.location.longitude]);
      }
    };

    loadSiteData();
  }, [siteId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Site name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.significance.trim()) {
      newErrors.significance = 'Cultural significance is required';
    }

    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.location.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!selectedPosition) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleLocationChange = (field: 'address' | 'country', value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: lat,
        longitude: lng
      }
    }));

    // Clear location error
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: undefined
      }));
    }
  };

  const handleThreatToggle = (threat: ThreatType) => {
    setFormData(prev => ({
      ...prev,
      initialThreats: prev.initialThreats.includes(threat)
        ? prev.initialThreats.filter(t => t !== threat)
        : [...prev.initialThreats, threat]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      const newPreviews: string[] = [];

      Array.from(files).forEach(file => {
        // In a real application, you would upload to a server and get back URLs
        // For now, we'll create object URLs for preview and mock URLs for storage
        const objectUrl = URL.createObjectURL(file);
        const mockUrl = `/images/${file.name}`;
        
        newPreviews.push(objectUrl);
        newImages.push(mockUrl);
      });

      setImagePreview(prev => [...prev, ...newPreviews]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const siteData: HeritageSite = {
        id: siteId || `site-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        significance: formData.significance,
        currentStatus: formData.currentStatus,
        location: formData.location,
        images: formData.images,
        lastAssessment: now,
        riskProfile: {
          overallRisk: 'medium-high', // Default risk level for new sites
          lastUpdated: now,
          activeThreats: formData.initialThreats
        },
        createdAt: isEditMode ? new Date() : now, // Keep original creation date in edit mode
        updatedAt: now
      };

      // TODO: In real implementation, save to backend via API
      // await SiteService.saveSite(siteData);
      
      onSave(siteData);
    } catch (error) {
      console.error('Error saving site:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading site data...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isEditMode ? 'Edit Heritage Site' : 'Add New Heritage Site'}</h1>
        <button onClick={onCancel} className={styles.closeButton}>
          <Icon name="x" size="md" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <section className={styles.section}>
          <h2>Basic Information</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Site Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Enter the heritage site name"
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Describe the heritage site, its features, and historical context"
              rows={4}
            />
            {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="significance" className={styles.label}>
              Cultural Significance *
            </label>
            <textarea
              id="significance"
              value={formData.significance}
              onChange={(e) => handleInputChange('significance', e.target.value)}
              className={`${styles.textarea} ${errors.significance ? styles.inputError : ''}`}
              placeholder="Explain the cultural, historical, or archaeological significance of the site"
              rows={3}
            />
            {errors.significance && <span className={styles.errorMessage}>{errors.significance}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Current Status
            </label>
            <select
              id="status"
              value={formData.currentStatus}
              onChange={(e) => handleInputChange('currentStatus', e.target.value as SiteStatus)}
              className={styles.select}
            >
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
              <option value="critical">Critical</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </section>

        {/* Location Information */}
        <section className={styles.section}>
          <h2>Location Information</h2>
          
          <div className={styles.locationGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address *
              </label>
              <input
                id="address"
                type="text"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder="Enter the site address"
              />
              {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>
                Country *
              </label>
              <input
                id="country"
                type="text"
                value={formData.location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                placeholder="Enter the country"
              />
              {errors.country && <span className={styles.errorMessage}>{errors.country}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Location on Map * {selectedPosition && (
                <span className={styles.coordinates}>
                  ({selectedPosition[0].toFixed(4)}°N, {selectedPosition[1].toFixed(4)}°E)
                </span>
              )}
            </label>
            <div className={styles.mapContainer}>
              <MapContainer
                center={selectedPosition || [31.9539, 35.9106]}
                zoom={8}
                className={styles.map}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker
                  onLocationSelect={handleMapLocationSelect}
                  selectedPosition={selectedPosition}
                />
              </MapContainer>
            </div>
            <p className={styles.mapHelp}>Click on the map to select the site location</p>
            {errors.location && <span className={styles.errorMessage}>{errors.location}</span>}
          </div>
        </section>

        {/* Photo Upload */}
        <section className={styles.section}>
          <h2>Site Documentation</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Site Photos
            </label>
            <div className={styles.imageUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
              >
                <Icon name="camera" size="sm" /> Add Photos
              </button>
            </div>
            
            {imagePreview.length > 0 && (
              <div className={styles.imagePreview}>
                {imagePreview.map((image, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img src={image} alt={`Preview ${index + 1}`} className={styles.previewImage} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImageButton}
                    >
                      <Icon name="x" size="sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Initial Risk Factors */}
        <section className={styles.section}>
          <h2>Initial Risk Factors</h2>
          <p className={styles.sectionDescription}>
            Select potential threats that may affect this heritage site. This will help set up initial risk assessments.
          </p>
          
          <div className={styles.threatGrid}>
            {availableThreats.map(threat => (
              <label key={threat.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.initialThreats.includes(threat.value)}
                  onChange={() => handleThreatToggle(threat.value)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{threat.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Form Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Site' : 'Create Site')}
          </button>
        </div>
      </form>
    </div>
  );
};