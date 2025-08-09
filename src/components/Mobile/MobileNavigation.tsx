import React from 'react';
import styles from './MobileNavigation.module.css';
import { Icon, type IconName } from '../UI';

type ActiveView = 'sites' | 'dashboard' | 'reports' | 'analytics' | 'data-management' | 'ar';

interface MobileNavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  showNavigation: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeView, 
  onViewChange, 
  showNavigation 
}) => {
  if (!showNavigation) {
    return null;
  }

  const navItems = [
    { id: 'sites' as const, icon: 'map-pin' as IconName, label: 'Sites' },
    { id: 'dashboard' as const, icon: 'bar-chart-3' as IconName, label: 'Dashboard' },
    { id: 'analytics' as const, icon: 'trending-up' as IconName, label: 'Analytics' },
    { id: 'reports' as const, icon: 'file-text' as IconName, label: 'Reports' },
    { id: 'data-management' as const, icon: 'database' as IconName, label: 'Data' },
    { id: 'ar' as const, icon: 'camera' as IconName, label: 'Augmented Reality' },
  ];

  return (
    <nav className={styles.mobileNavigation}>
      <div className={styles.navContainer}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className={styles.navIcon}>
              <Icon name={item.icon} size="md" />
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};