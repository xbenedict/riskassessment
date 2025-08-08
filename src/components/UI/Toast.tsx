import React, { useEffect, useState } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Toast.module.css';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons: Record<NonNullable<ToastProps['type']>, IconName> = {
  success: 'check-circle',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info'
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss timer
    let dismissTimer: NodeJS.Timeout;
    if (duration > 0) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match exit animation duration
  };

  const toastClasses = [
    styles.toast,
    styles[`toast--${type}`],
    isVisible && styles['toast--visible'],
    isExiting && styles['toast--exiting']
  ].filter(Boolean).join(' ');

  return (
    <div className={toastClasses} role="alert" aria-live="polite">
      <div className={styles.toastIcon}>
        <Icon name={toastIcons[type]} size="md" />
      </div>
      
      <div className={styles.toastContent}>
        {title && (
          <div className={styles.toastTitle}>{title}</div>
        )}
        <div className={styles.toastMessage}>{message}</div>
      </div>
      
      {action && (
        <button
          className={styles.toastAction}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
      
      <button
        className={styles.toastClose}
        onClick={handleClose}
        type="button"
        aria-label="Close notification"
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  );
};

export default Toast;