import React, { useState } from 'react';
import type { HeritageSite, RiskAssessment } from '../../types';
import { mockSites } from '../../utils/mockData';
import { RiskAssessmentForm } from '../Assessment/RiskAssessmentForm';
import { AssessmentsList } from '../Assessment/AssessmentsList';
import { FullAssessmentView } from '../Assessment/FullAssessmentView';
import { SiteMapView } from '../Map/SiteMapView';
import { ReportGenerator } from '../Reports/ReportGenerator';
import { RiskAssessmentService } from '../../services/RiskAssessmentService';
import { Icon, type IconName } from '../UI';
import styles from './SiteDetail.module.css';

interface SiteDetailProps {
  siteId: string;
  onBack: () => void;
}

export const SiteDetail: React.FC<SiteDetailProps> = ({ siteId, onBack }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeView, setActiveView] = useState<'detail' | 'assessment' | 'map' | 'report' | 'add-assessment' | 'assessments-list'>('detail');
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
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

  const handleViewFullAssessment = () => {
    setActiveView('assessment');
  };

  const handleViewOnMap = () => {
    setActiveView('map');
  };

  const handleGenerateReport = () => {
    setActiveView('report');
  };

  const handleAddRiskAssessment = () => {
    setActiveView('add-assessment');
  };

  const handleAssessmentSubmit = async (assessment: Omit<RiskAssessment, 'id'>) => {
    try {
      await RiskAssessmentService.saveAssessment(assessment);
      setActiveView('assessments-list');
      // Could show a success message here
    } catch (error) {
      console.error('Error saving assessment:', error);
      // Could show an error message here
    }
  };

  const handleViewAssessmentsList = () => {
    setActiveView('assessments-list');
  };

  const handleViewAssessment = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    // For now, just go back to list - we could add a detailed view later
    setActiveView('assessments-list');
  };

  const handleEditAssessment = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setActiveView('add-assessment');
  };

  const handleBackToDetail = () => {
    setActiveView('detail');
    setSelectedAssessment(null);
  };

  const handleBackToAssessmentsList = () => {
    setActiveView('assessments-list');
    setSelectedAssessment(null);
  };

  // Render different views based on activeView state
  if (activeView === 'assessment') {
    return <FullAssessmentView site={site} onClose={handleBackToDetail} />;
  }

  if (activeView === 'map') {
    return <SiteMapView site={site} onClose={handleBackToDetail} />;
  }

  if (activeView === 'report') {
    return (
      <div className={styles.reportView}>
        <div className={styles.reportHeader}>
          <button onClick={handleBackToDetail} className={styles.backButton}>
            ← Back to Site
          </button>
          <h2>Generate Report for {site.name}</h2>
        </div>
        <ReportGenerator selectedSites={[site]} />
      </div>
    );
  }

  if (activeView === 'add-assessment') {
    return (
      <RiskAssessmentForm
        site={site}
        onSubmit={handleAssessmentSubmit}
        onCancel={selectedAssessment ? handleBackToAssessmentsList : handleBackToDetail}
        existingAssessment={selectedAssessment || undefined}
      />
    );
  }

  if (activeView === 'assessments-list') {
    return (
      <div className={styles.reportsListView}>
        <div className={styles.reportHeader}>
          <button onClick={handleBackToDetail} className={styles.backButton}>
            ← Back to Site
          </button>
          <h2>Risk Assessments for {site.name}</h2>
        </div>
        <AssessmentsList
          site={site}
          onViewAssessment={handleViewAssessment}
          onEditAssessment={handleEditAssessment}
        />
      </div>
    );
  }

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
          <p className={styles.location}>
            <Icon name="map-pin" size="sm" /> {site.location.address}
          </p>
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
                  <span className={styles.threatIcon}>
                    <Icon name={getThreatIcon(threat)} size="md" />
                  </span>
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
          <button 
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleViewFullAssessment}
          >
            <Icon name="bar-chart" size="sm" /> View Full Assessment
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.secondary}`}
            onClick={handleViewOnMap}
          >
            <Icon name="map-pin" size="sm" /> View on Map
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.secondary}`}
            onClick={handleGenerateReport}
          >
            <Icon name="file-text" size="sm" /> Generate Report
          </button>
        </div>

        <div className={styles.researcherSection}>
          <h3>Risk Assessment Contributions</h3>
          <p>Add new risk assessments and view existing assessments to contribute to the site's risk management.</p>
          <div className={styles.researcherActions}>
            <button 
              className={`${styles.actionBtn} ${styles.secondary}`}
              onClick={handleViewAssessmentsList}
            >
              <Icon name="file-text" size="sm" /> View Assessments
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.researcher}`}
              onClick={handleAddRiskAssessment}
            >
              <Icon name="edit-3" size="sm" /> Add Risk Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};