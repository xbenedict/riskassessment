import React, { forwardRef } from 'react';
import { Icon } from './Icon';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  fullWidth = false,
  resize = 'vertical',
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  
  const containerClasses = [
    styles.textareaContainer,
    fullWidth && styles['textareaContainer--fullWidth'],
    className
  ].filter(Boolean).join(' ');
  
  const textareaClasses = [
    styles.textarea,
    styles[`textarea--${variant}`],
    styles[`textarea--resize-${resize}`],
    hasError && styles['textarea--error']
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      
      {(error || helperText) && (
        <div className={styles.textareaHelp}>
          {error && (
            <span className={styles.textareaError}>
              <Icon name="alert-circle" size="sm" />
              {error}
            </span>
          )}
          {!error && helperText && (
            <span className={styles.textareaHelperText}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;