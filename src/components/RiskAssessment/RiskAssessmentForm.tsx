import React, { useState, useCallback, useMemo } from 'react';
import { RiskCalculator } from '../../utils/RiskCalculator';
import type { ThreatType, UncertaintyLevel, RiskAssessment } from '../../types';
import { ThreatType as ThreatTypeEnum } from '../../types';
import { RiskIndicator } from '../UI';
import styles from './RiskAssessmentForm.module.css';

interface RiskAssessmentFormProps {
  siteId: string;
  siteName: string;
  initialData?: Partial<RiskAssessment>;
  onSubmit: (assessment: Omit<RiskAssessment, 'id' | 'assessmentDate'>) => void;
  onCancel: () => void;
}

interface FormData {
  threatType: ThreatType;
  probability: number;
  lossOfValue: number;
  fractionAffected: number;
  uncertaintyLevel: UncertaintyLevel;
  assessor: string;
  notes: string;
}

interface FormErrors {
  threatType?: string;
  assessor?: string;
  notes?: string;
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  siteId,
  siteName,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormData>({
    threatType: initialData?.threatType || ThreatTypeEnum.WEATHERING,
    probability: initialData?.probability || 3,
    lossOfValue: initialData?.lossOfValue || 3,
    fractionAffected: initialData?.fractionAffected || 3,
    uncertaintyLevel: initialData?.uncertaintyLevel || 'low',
    assessor: initialData?.assessor || '',
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate risk in real-time
  const riskCalculation = useMemo(() => {
    try {
      return RiskCalculator.calculateRisk(
        formData.probability,
        formData.lossOfValue,
        formData.fractionAffected,
        formData.uncertaintyLevel
      );
    } catch (error) {
      return null;
    }
  }, [formData.probability, formData.lossOfValue, formData.fractionAffected, formData.uncertaintyLevel]);

  const updateFormData = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear related errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.assessor.trim()) {
      newErrors.assessor = 'Assessor name is required';
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Assessment notes are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !riskCalculation) {
      return;
    }

    const assessment: Omit<RiskAssessment, 'id' | 'assessmentDate'> = {
      siteId,
      threatType: formData.threatType,
      probability: formData.probability,
      lossOfValue: formData.lossOfValue,
      fractionAffected: formData.fractionAffected,
      magnitude: riskCalculation.magnitude,
      priority: riskCalculation.adjustedPriority,
      uncertaintyLevel: formData.uncertaintyLevel,
      assessor: formData.assessor.trim(),
      notes: formData.notes.trim()
    };

    onSubmit(assessment);
  };

  const getPriorityClassName = (priority: string): string => {
    const classMap: Record<string, string> = {
      'low': styles.priorityLow,
      'medium-high': styles.priorityMediumHigh,
      'high': styles.priorityHigh,
      'very-high': styles.priorityVeryHigh,
      'extremely-high': styles.priorityExtremelyHigh
    };
    return classMap[priority] || styles.priorityLow;
  };

  const threatTypeOptions = Object.entries(ThreatTypeEnum).map(([key, value]) => ({
    value,
    label: key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }));

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        Risk Assessment for {siteName}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* ABC Components Grid */}
        <div className={styles.formGrid}>
          {/* Probability (A) Component */}
          <div className={styles.componentSection}>
            <h3 className={styles.componentTitle}>
              <span className={styles.componentBadge}>A</span>
              Probability
            </h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="probability-slider" className={styles.label}>
                Likelihood of occurrence (1-5)
              </label>
              <input
                id="probability-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.probability}
                onChange={(e) => updateFormData('probability', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.valueDisplay}>
                <span>Very Unlikely</span>
                <span className={styles.currentValue}>{formData.probability}</span>
                <span>Very Likely</span>
              </div>
              <div className={styles.description}>
                {RiskCalculator.getComponentDescription('A', formData.probability)}
              </div>
            </div>
          </div>

          {/* Loss of Value (B) Component */}
          <div className={styles.componentSection}>
            <h3 className={styles.componentTitle}>
              <span className={styles.componentBadge}>B</span>
              Loss of Value
            </h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Potential heritage value loss (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.lossOfValue}
                onChange={(e) => updateFormData('lossOfValue', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.valueDisplay}>
                <span>Negligible</span>
                <span className={styles.currentValue}>{formData.lossOfValue}</span>
                <span>Complete</span>
              </div>
              <div className={styles.description}>
                {RiskCalculator.getComponentDescription('B', formData.lossOfValue)}
              </div>
            </div>
          </div>

          {/* Fraction Affected (C) Component */}
          <div className={styles.componentSection}>
            <h3 className={styles.componentTitle}>
              <span className={styles.componentBadge}>C</span>
              Fraction Affected
            </h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Portion of site affected (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.fractionAffected}
                onChange={(e) => updateFormData('fractionAffected', parseInt(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.valueDisplay}>
                <span>&lt;1%</span>
                <span className={styles.currentValue}>{formData.fractionAffected}</span>
                <span>&gt;90%</span>
              </div>
              <div className={styles.description}>
                {RiskCalculator.getComponentDescription('C', formData.fractionAffected)}
              </div>
            </div>
          </div>
        </div>

        {/* Uncertainty Level */}
        <div className={styles.uncertaintySection}>
          <h3 className={styles.uncertaintyTitle}>Uncertainty Level</h3>
          <div className={styles.inputGroup}>
            <label htmlFor="uncertainty-select" className={styles.label}>
              How confident are you in this assessment?
            </label>
            <select
              id="uncertainty-select"
              value={formData.uncertaintyLevel}
              onChange={(e) => updateFormData('uncertaintyLevel', e.target.value as UncertaintyLevel)}
              className={styles.select}
            >
              <option value="low">Low - High confidence in assessment data</option>
              <option value="medium">Medium - Some uncertainty in assessment data</option>
              <option value="high">High - Significant uncertainty in assessment data</option>
            </select>
          </div>
        </div>

        {/* Real-time Risk Calculation Results */}
        {riskCalculation && (
          <div className={styles.resultsSection}>
            <h3 className={styles.resultsTitle}>Risk Assessment Results</h3>
            <div className={styles.magnitudeDisplay}>
              {riskCalculation.magnitude}
            </div>
            <div className={styles.priorityDisplayContainer}>
              <RiskIndicator 
                priority={riskCalculation.adjustedPriority}
                size="lg"
                variant="badge"
                className={styles.priorityIndicator}
              />
            </div>
            <div className={styles.priorityDescription}>
              {riskCalculation.description}
            </div>
            {riskCalculation.basePriority !== riskCalculation.adjustedPriority && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                Base priority: {riskCalculation.basePriority} → Adjusted for uncertainty
              </div>
            )}
          </div>
        )}

        {/* Additional Assessment Details */}
        <div className={styles.inputGroup}>
          <label htmlFor="threat-type-select" className={styles.label}>Threat Type</label>
          <select
            id="threat-type-select"
            value={formData.threatType}
            onChange={(e) => updateFormData('threatType', e.target.value as ThreatType)}
            className={styles.select}
          >
            {threatTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Assessor Name *</label>
          <input
            type="text"
            value={formData.assessor}
            onChange={(e) => updateFormData('assessor', e.target.value)}
            className={styles.select}
            placeholder="Enter your name"
          />
          {errors.assessor && (
            <div className={styles.errorMessage}>{errors.assessor}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Assessment Notes *</label>
          <textarea
            value={formData.notes}
            onChange={(e) => updateFormData('notes', e.target.value)}
            className={styles.select}
            rows={4}
            placeholder="Provide detailed notes about this risk assessment, including evidence, observations, and recommendations..."
          />
          {errors.notes && (
            <div className={styles.errorMessage}>{errors.notes}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={!riskCalculation}
          >
            Save Risk Assessment
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};