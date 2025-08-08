import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'white';
  className?: string;
  'aria-label'?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner--${size}`],
    styles[`spinner--${color}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={spinnerClasses}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={styles.spinnerCircle}></div>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default Spinner;