import React from 'react';
import { Spinner } from './Spinner';
import styles from './Loading.module.css';

export interface LoadingProps {
  variant?: 'fullscreen' | 'container' | 'inline';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  overlay?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'container',
  size = 'medium',
  message,
  overlay = false,
  className = ''
}) => {
  const loadingClasses = [
    styles.loading,
    styles[`loading--${variant}`],
    overlay && styles['loading--overlay'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={loadingClasses}>
      <div className={styles.loadingContent}>
        <Spinner size={size} color="tertiary" />
        {message && (
          <p className={styles.loadingMessage}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;