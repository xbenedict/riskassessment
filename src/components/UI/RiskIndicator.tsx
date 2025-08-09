import React from 'react';
import { Icon } from './Icon';
import type { RiskPriority } from '../../types';
import styles from './RiskIndicator.module.css';

interface RiskIndicatorProps {
  priority: RiskPriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  variant?: 'badge' | 'dot' | 'full';
  className?: string;
}

/**
 * Semantic Risk Indicator Component
 * Displays risk priority with appropriate colors, icons, and accessibility features
 */
export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  priority,
  size = 'md',
  showIcon = true,
  showLabel = true,
  variant = 'full',
  className = ''
}) => {
  const getRiskIcon = (priority: RiskPriority) => {
    switch (priority) {
      case 'extremely-high':
        return 'alert-triangle';
      case 'very-high':
        return 'alert-circle';
      case 'high':
        return 'alert-circle';
      case 'medium-high':
        return 'info';
      case 'low':
        return 'check-circle';
      default:
        return 'help-circle';
    }
  };

  const getRiskLabel = (priority: RiskPriority) => {
    switch (priority) {
      case 'extremely-high':
        return 'Extremely High';
      case 'very-high':
        return 'Very High';
      case 'high':
        return 'High';
      case 'medium-high':
        return 'Medium High';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  const getAriaLabel = (priority: RiskPriority) => {
    return `Risk level: ${getRiskLabel(priority)}`;
  };

  const baseClasses = [
    styles.riskIndicator,
    styles[`risk-${priority}`],
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    className
  ].filter(Boolean).join(' ');

  if (variant === 'dot') {
    return (
      <span
        className={baseClasses}
        aria-label={getAriaLabel(priority)}
        role="status"
      />
    );
  }

  return (
    <span
      className={baseClasses}
      aria-label={getAriaLabel(priority)}
      role="status"
    >
      {showIcon && (
        <Icon 
          name={getRiskIcon(priority)} 
          size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} 
          className={styles.riskIcon}
        />
      )}
      {showLabel && (
        <span className={styles.riskLabel}>
          {getRiskLabel(priority)}
        </span>
      )}
    </span>
  );
};

export default RiskIndicator;