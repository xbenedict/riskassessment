import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'avatar' | 'button' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'wave',
  className = ''
}) => {
  const skeletonClasses = [
    styles.skeleton,
    styles[`skeleton--${variant}`],
    styles[`skeleton--${animation}`],
    className
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.skeletonGroup} role="status" aria-label="Loading content">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={{
              ...style,
              width: index === lines - 1 ? '60%' : style.width || '100%',
              animationDelay: `${index * 100}ms` // Stagger animation
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={style}
      role="status"
      aria-label="Loading content"
    />
  );
};

export default Skeleton;