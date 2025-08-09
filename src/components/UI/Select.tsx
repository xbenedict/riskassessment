import React, { forwardRef } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  fullWidth = false,
  options,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  
  const containerClasses = [
    styles.selectContainer,
    fullWidth && styles['selectContainer--fullWidth'],
    className
  ].filter(Boolean).join(' ');
  
  const selectClasses = [
    styles.select,
    styles[`select--${variant}`],
    hasError && styles['select--error'],
    leftIcon && styles['select--hasLeftIcon'],
    rightIcon && styles['select--hasRightIcon']
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.selectWrapper}>
        {leftIcon && (
          <Icon 
            name={leftIcon} 
            size="md" 
            className={styles.selectIcon} 
          />
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {rightIcon && (
          <Icon 
            name={rightIcon} 
            size="md" 
            className={styles.selectIcon} 
          />
        )}
      </div>
      
      {(error || helperText) && (
        <div className={styles.selectHelp}>
          {error && (
            <span className={styles.selectError}>
              <Icon name="alert-circle" size="sm" />
              {error}
            </span>
          )}
          {!error && helperText && (
            <span className={styles.selectHelperText}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;