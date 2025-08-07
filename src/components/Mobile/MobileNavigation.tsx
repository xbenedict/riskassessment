import React from 'react';
import styles from './MobileNavigation.module.css';

type ActiveView = 'sites' | 'dashboard' | 'reports' | 'analytics' | 'data-management';

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
    { id: 'sites' as const, icon: '🏛️', label: 'Sites' },
    { id: 'dashboard' as const, icon: '📊', label: 'Dashboard' },
    { id: 'analytics' as const, icon: '📈', label: 'Analytics' },
    { id: 'reports' as const, icon: '📋', label: 'Reports' },
    { id: 'data-management' as const, icon: '💾', label: 'Data' },
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
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};