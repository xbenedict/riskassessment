import React from 'react';
import styles from './Progress.module.css';

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'medium',
  indeterminate = false,
  showLabel = false,
  label,
  className = ''
}) => {
  const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
  
  const progressClasses = [
    styles.progress,
    styles[`progress--${variant}`],
    styles[`progress--${size}`],
    indeterminate && styles['progress--indeterminate'],
    className
  ].filter(Boolean).join(' ');

  const displayLabel = label || (showLabel ? `${Math.round(percentage)}%` : '');

  return (
    <div className={styles.progressContainer}>
      {displayLabel && (
        <div className={styles.progressLabel}>
          {displayLabel}
        </div>
      )}
      
      <div 
        className={progressClasses}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div 
          className={styles.progressFill}
          style={indeterminate ? {} : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;