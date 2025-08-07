import React, { useState } from 'react';
import type { HeritageSite, ThreatType, UncertaintyLevel, RiskAssessment } from '../../types';
import { ThreatType as ThreatTypes } from '../../types';
import { RiskCalculator } from '../../utils/RiskCalculator';
import styles from './RiskAssessmentForm.module.css';

interface RiskAssessmentFormProps {
  site: HeritageSite;
  onSubmit: (assessment: Omit<RiskAssessment, 'id'>) => void;
  onCancel: () => void;
  existingAssessment?: RiskAssessment; // For editing existing assessments
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  site,
  onSubmit,
  onCancel,
  existingAssessment
}) => {
  const [formData, setFormData] = useState({
    threatType: existingAssessment?.threatType || '' as ThreatType,
    probability: existingAssessment?.probability || 1,
    lossOfValue: existingAssessment?.lossOfValue || 1,
    fractionAffected: existingAssessment?.fractionAffected || 1,
    uncertaintyLevel: existingAssessment?.uncertaintyLevel || 'medium' as UncertaintyLevel,
    assessor: existingAssessment?.assessor || '',
    notes: existingAssessment?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const threatOptions = Object.values(ThreatTypes);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.threatType) {
      newErrors.threatType = 'Please select a threat type';
    }

    if (!formData.assessor.trim()) {
      newErrors.assessor = 'Assessor name is required';
    }

    if (formData.probability < 1 || formData.probability > 5) {
      newErrors.probability = 'Probability must be between 1 and 5';
    }

    if (formData.lossOfValue < 1 || formData.lossOfValue > 5) {
      newErrors.lossOfValue = 'Loss of Value must be between 1 and 5';
    }

    if (formData.fractionAffected < 1 || formData.fractionAffected > 5) {
      newErrors.fractionAffected = 'Fraction Affected must be between 1 and 5';
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
      const magnitude = formData.probability + formData.lossOfValue + formData.fractionAffected;
      const basePriority = RiskCalculator.calculatePriority(magnitude);
      const priority = RiskCalculator.applyUncertaintyAdjustment(basePriority, formData.uncertaintyLevel);

      const assessment: Omit<RiskAssessment, 'id'> = {
        siteId: site.id,
        threatType: formData.threatType,
        probability: formData.probability,
        lossOfValue: formData.lossOfValue,
        fractionAffected: formData.fractionAffected,
        magnitude,
        priority,
        uncertaintyLevel: formData.uncertaintyLevel,
        assessmentDate: new Date(),
        assessor: formData.assessor,
        notes: formData.notes
      };

      onSubmit(assessment);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThreatLabel = (threat: ThreatType): string => {
    return threat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getScaleDescription = (scale: string, value: number): string => {
    const descriptions = {
      probability: {
        1: 'Very unlikely to occur',
        2: 'Unlikely to occur',
        3: 'Possible to occur',
        4: 'Likely to occur',
        5: 'Very likely to occur'
      },
      lossOfValue: {
        1: 'Negligible loss',
        2: 'Minor loss',
        3: 'Moderate loss',
        4: 'Major loss',
        5: 'Severe loss'
      },
      fractionAffected: {
        1: 'Very small area affected',
        2: 'Small area affected',
        3: 'Moderate area affected',
        4: 'Large area affected',
        5: 'Very large area affected'
      }
    };
    return descriptions[scale as keyof typeof descriptions]?.[value as keyof typeof descriptions.probability] || '';
  };

  const currentMagnitude = formData.probability + formData.lossOfValue + formData.fractionAffected;
  const basePriority = RiskCalculator.calculatePriority(currentMagnitude);
  const currentPriority = RiskCalculator.applyUncertaintyAdjustment(basePriority, formData.uncertaintyLevel);

  return (
    <div className={styles.assessmentForm}>
      <div className={styles.header}>
        <h2>{existingAssessment ? 'Edit' : 'Add'} Risk Assessment</h2>
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
          <h3>Threat Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="threatType">Threat Type *</label>
            <select
              id="threatType"
              value={formData.threatType}
              onChange={(e) => handleInputChange('threatType', e.target.value as ThreatType)}
              className={`${styles.select} ${errors.threatType ? styles.error : ''}`}
              required
            >
              <option value="">Select a threat type</option>
              {threatOptions.map(threat => (
                <option key={threat} value={threat}>
                  {getThreatLabel(threat)}
                </option>
              ))}
            </select>
            {errors.threatType && (
              <span className={styles.errorText}>{errors.threatType}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="assessor">Assessor Name *</label>
            <input
              id="assessor"
              type="text"
              value={formData.assessor}
              onChange={(e) => handleInputChange('assessor', e.target.value)}
              className={`${styles.input} ${errors.assessor ? styles.error : ''}`}
              placeholder="Your name or organization"
              required
            />
            {errors.assessor && (
              <span className={styles.errorText}>{errors.assessor}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>ABC Scale Assessment</h3>
          <p className={styles.scaleInfo}>
            Rate each component from 1 (lowest) to 5 (highest) based on the ABC methodology
          </p>

          <div className={styles.scaleGroup}>
            <div className={styles.scaleItem}>
              <label htmlFor="probability">A - Probability: {formData.probability}</label>
              <input
                id="probability"
                type="range"
                min="1"
                max="5"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.scaleDescription}>
                {getScaleDescription('probability', formData.probability)}
              </div>
              {errors.probability && (
                <span className={styles.errorText}>{errors.probability}</span>
              )}
            </div>

            <div className={styles.scaleItem}>
              <label htmlFor="lossOfValue">B - Loss of Value: {formData.lossOfValue}</label>
              <input
                id="lossOfValue"
                type="range"
                min="1"
                max="5"
                value={formData.lossOfValue}
                onChange={(e) => handleInputChange('lossOfValue', parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.scaleDescription}>
                {getScaleDescription('lossOfValue', formData.lossOfValue)}
              </div>
              {errors.lossOfValue && (
                <span className={styles.errorText}>{errors.lossOfValue}</span>
              )}
            </div>

            <div className={styles.scaleItem}>
              <label htmlFor="fractionAffected">C - Fraction Affected: {formData.fractionAffected}</label>
              <input
                id="fractionAffected"
                type="range"
                min="1"
                max="5"
                value={formData.fractionAffected}
                onChange={(e) => handleInputChange('fractionAffected', parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.scaleDescription}>
                {getScaleDescription('fractionAffected', formData.fractionAffected)}
              </div>
              {errors.fractionAffected && (
                <span className={styles.errorText}>{errors.fractionAffected}</span>
              )}
            </div>
          </div>

          <div className={styles.calculatedValues}>
            <div className={styles.magnitude}>
              <span className={styles.label}>Calculated Magnitude:</span>
              <span className={styles.value}>{currentMagnitude}</span>
            </div>
            <div className={styles.priority}>
              <span className={styles.label}>Risk Priority:</span>
              <span className={`${styles.value} ${styles[`priority-${currentPriority}`]}`}>
                {currentPriority.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Additional Information</h3>

          <div className={styles.formGroup}>
            <label htmlFor="uncertaintyLevel">Uncertainty Level</label>
            <select
              id="uncertaintyLevel"
              value={formData.uncertaintyLevel}
              onChange={(e) => handleInputChange('uncertaintyLevel', e.target.value as UncertaintyLevel)}
              className={styles.select}
            >
              <option value="low">Low - High confidence in assessment</option>
              <option value="medium">Medium - Moderate confidence</option>
              <option value="high">High - Low confidence, needs more data</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Assessment Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className={styles.textarea}
              rows={4}
              placeholder="Additional observations, evidence, or context for this assessment..."
            />
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
            {isSubmitting ? 'Saving...' : existingAssessment ? 'Update Assessment' : 'Add Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
};