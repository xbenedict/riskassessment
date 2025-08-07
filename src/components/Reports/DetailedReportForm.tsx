import React, { useState } from 'react';
import type { HeritageSite, ThreatType } from '../../types';
import { ThreatType as ThreatTypes } from '../../types';
import styles from './DetailedReportForm.module.css';

interface DetailedReport {
  id: string;
  siteId: string;
  title: string;
  researcherName: string;
  researcherAffiliation: string;
  reportDate: Date;
  executiveSummary: string;
  detailedFindings: string;
  threatsIdentified: ThreatType[];
  recommendations: string;
  methodology: string;
  references: string;
  images: File[];
  attachments: File[];
}

interface DetailedReportFormProps {
  site: HeritageSite;
  onSubmit: (report: DetailedReport) => void;
  onCancel: () => void;
}

export const DetailedReportForm: React.FC<DetailedReportFormProps> = ({
  site,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<DetailedReport>>({
    siteId: site.id,
    title: `Detailed Assessment Report - ${site.name}`,
    researcherName: '',
    researcherAffiliation: '',
    reportDate: new Date(),
    executiveSummary: '',
    detailedFindings: '',
    threatsIdentified: [],
    recommendations: '',
    methodology: '',
    references: '',
    images: [],
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const threatOptions = Object.values(ThreatTypes);

  const handleInputChange = (field: keyof DetailedReport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleThreatToggle = (threat: ThreatType) => {
    const currentThreats = formData.threatsIdentified || [];
    const updatedThreats = currentThreats.includes(threat)
      ? currentThreats.filter(t => t !== threat)
      : [...currentThreats, threat];
    
    handleInputChange('threatsIdentified', updatedThreats);
  };

  const handleFileChange = (field: 'images' | 'attachments', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      handleInputChange(field, fileArray);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.researcherName?.trim()) {
      newErrors.researcherName = 'Researcher name is required';
    }

    if (!formData.researcherAffiliation?.trim()) {
      newErrors.researcherAffiliation = 'Affiliation is required';
    }

    if (!formData.executiveSummary?.trim()) {
      newErrors.executiveSummary = 'Executive summary is required';
    }

    if (!formData.detailedFindings?.trim()) {
      newErrors.detailedFindings = 'Detailed findings are required';
    }

    if (!formData.recommendations?.trim()) {
      newErrors.recommendations = 'Recommendations are required';
    }

    if (!formData.methodology?.trim()) {
      newErrors.methodology = 'Methodology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const report: DetailedReport = {
        id: `detailed-report-${site.id}-${Date.now()}`,
        siteId: site.id,
        title: formData.title || `Detailed Assessment Report - ${site.name}`,
        researcherName: formData.researcherName!,
        researcherAffiliation: formData.researcherAffiliation!,
        reportDate: formData.reportDate || new Date(),
        executiveSummary: formData.executiveSummary!,
        detailedFindings: formData.detailedFindings!,
        threatsIdentified: formData.threatsIdentified || [],
        recommendations: formData.recommendations!,
        methodology: formData.methodology!,
        references: formData.references || '',
        images: formData.images || [],
        attachments: formData.attachments || []
      };

      onSubmit(report);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThreatLabel = (threat: ThreatType): string => {
    return threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={styles.reportForm}>
      <div className={styles.formHeader}>
        <h2>Add Detailed Research Report</h2>
        <p>Site: {site.name}</p>
        <button 
          type="button" 
          onClick={onCancel}
          className={styles.closeButton}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Report Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Report Title</label>
            <input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="researcherName">Researcher Name *</label>
              <input
                id="researcherName"
                type="text"
                value={formData.researcherName || ''}
                onChange={(e) => handleInputChange('researcherName', e.target.value)}
                className={`${styles.input} ${errors.researcherName ? styles.error : ''}`}
                required
              />
              {errors.researcherName && (
                <span className={styles.errorText}>{errors.researcherName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="researcherAffiliation">Affiliation *</label>
              <input
                id="researcherAffiliation"
                type="text"
                value={formData.researcherAffiliation || ''}
                onChange={(e) => handleInputChange('researcherAffiliation', e.target.value)}
                className={`${styles.input} ${errors.researcherAffiliation ? styles.error : ''}`}
                placeholder="University, Institution, or Organization"
                required
              />
              {errors.researcherAffiliation && (
                <span className={styles.errorText}>{errors.researcherAffiliation}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reportDate">Report Date</label>
            <input
              id="reportDate"
              type="date"
              value={formData.reportDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleInputChange('reportDate', new Date(e.target.value))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Executive Summary *</h3>
          <div className={styles.formGroup}>
            <textarea
              value={formData.executiveSummary || ''}
              onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
              className={`${styles.textarea} ${errors.executiveSummary ? styles.error : ''}`}
              rows={4}
              placeholder="Brief overview of key findings and recommendations..."
              required
            />
            {errors.executiveSummary && (
              <span className={styles.errorText}>{errors.executiveSummary}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Detailed Findings *</h3>
          <div className={styles.formGroup}>
            <textarea
              value={formData.detailedFindings || ''}
              onChange={(e) => handleInputChange('detailedFindings', e.target.value)}
              className={`${styles.textarea} ${styles.large} ${errors.detailedFindings ? styles.error : ''}`}
              rows={8}
              placeholder="Comprehensive description of research findings, observations, and analysis..."
              required
            />
            {errors.detailedFindings && (
              <span className={styles.errorText}>{errors.detailedFindings}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Threats Identified</h3>
          <div className={styles.threatsGrid}>
            {threatOptions.map(threat => (
              <label key={threat} className={styles.threatCheckbox}>
                <input
                  type="checkbox"
                  checked={formData.threatsIdentified?.includes(threat) || false}
                  onChange={() => handleThreatToggle(threat)}
                />
                <span>{getThreatLabel(threat)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Recommendations *</h3>
          <div className={styles.formGroup}>
            <textarea
              value={formData.recommendations || ''}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              className={`${styles.textarea} ${errors.recommendations ? styles.error : ''}`}
              rows={6}
              placeholder="Specific recommendations for conservation, management, and risk mitigation..."
              required
            />
            {errors.recommendations && (
              <span className={styles.errorText}>{errors.recommendations}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Methodology *</h3>
          <div className={styles.formGroup}>
            <textarea
              value={formData.methodology || ''}
              onChange={(e) => handleInputChange('methodology', e.target.value)}
              className={`${styles.textarea} ${errors.methodology ? styles.error : ''}`}
              rows={4}
              placeholder="Research methods, tools, and approaches used in this assessment..."
              required
            />
            {errors.methodology && (
              <span className={styles.errorText}>{errors.methodology}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>References</h3>
          <div className={styles.formGroup}>
            <textarea
              value={formData.references || ''}
              onChange={(e) => handleInputChange('references', e.target.value)}
              className={styles.textarea}
              rows={4}
              placeholder="Academic references, sources, and bibliography..."
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Attachments</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="images">Images</label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange('images', e.target.files)}
              className={styles.fileInput}
            />
            {formData.images && formData.images.length > 0 && (
              <div className={styles.fileList}>
                {formData.images.map((file, index) => (
                  <span key={index} className={styles.fileName}>
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attachments">Documents</label>
            <input
              id="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileChange('attachments', e.target.files)}
              className={styles.fileInput}
            />
            {formData.attachments && formData.attachments.length > 0 && (
              <div className={styles.fileList}>
                {formData.attachments.map((file, index) => (
                  <span key={index} className={styles.fileName}>
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};