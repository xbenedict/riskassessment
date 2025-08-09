import React from 'react';
import { Icon, type IconName } from './Icon';
import { Spinner } from './Spinner';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--full-width'],
    loading && styles['button--loading'],
    className
  ].filter(Boolean).join(' ');

  const iconSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md';

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner 
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
          color="secondary"
          className={styles.button__spinner}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <Icon name={icon} size={iconSize} className={styles.button__icon} />
      )}
      
      <span className={styles.button__text}>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={iconSize} className={styles.button__icon} />
      )}
    </button>
  );
};

export default Button;