import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  shadow?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'medium',
  interactive = false,
  shadow = 'small',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--padding-${padding}`],
    styles[`card--shadow-${shadow}`],
    interactive && styles['card--interactive'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;