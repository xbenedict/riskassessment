import React, { forwardRef } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  
  const containerClasses = [
    styles.inputContainer,
    fullWidth && styles['inputContainer--fullWidth'],
    className
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    styles.input,
    styles[`input--${variant}`],
    hasError && styles['input--error'],
    leftIcon && styles['input--hasLeftIcon'],
    rightIcon && styles['input--hasRightIcon']
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <Icon 
            name={leftIcon} 
            size="md" 
            className={styles.inputIcon} 
          />
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <Icon 
            name={rightIcon} 
            size="md" 
            className={styles.inputIcon} 
          />
        )}
      </div>
      
      {(error || helperText) && (
        <div className={styles.inputHelp}>
          {error && (
            <span className={styles.inputError}>
              <Icon name="alert-circle" size="sm" />
              {error}
            </span>
          )}
          {!error && helperText && (
            <span className={styles.inputHelperText}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;