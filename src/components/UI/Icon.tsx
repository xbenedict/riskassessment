import React from 'react';
import {
  // Navigation icons
  MapPin,
  BarChart3,
  TrendingUp,
  FileText,
  Database,
  
  // Status icons
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  
  // Action icons
  Plus,
  Edit3,
  Trash2,
  Save,
  Download,
  Search,
  Filter,
  Settings,
  Eye,
  Camera,
  X,
  
  // Threat icons
  Globe,
  Waves,
  CloudRain,
  Leaf,
  Building,
  Users,
  Shield,
  Swords,
  Thermometer,
  HelpCircle,
  
  // Sort icons
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  
  // Chart icons
  BarChart,
  
  type LucideIcon
} from 'lucide-react';

export type IconName = 
  // Navigation
  | 'map-pin'
  | 'bar-chart-3'
  | 'trending-up'
  | 'file-text'
  | 'database'
  
  // Status
  | 'alert-triangle'
  | 'alert-circle'
  | 'check-circle'
  | 'x-circle'
  
  // Actions
  | 'plus'
  | 'edit-3'
  | 'trash-2'
  | 'save'
  | 'download'
  | 'search'
  | 'filter'
  | 'settings'
  | 'eye'
  | 'camera'
  | 'x'
  
  // Threats
  | 'globe'
  | 'waves'
  | 'cloud-rain'
  | 'leaf'
  | 'building'
  | 'users'
  | 'shield'
  | 'swords'
  | 'thermometer'
  | 'help-circle'
  
  // Sort
  | 'arrow-up-down'
  | 'arrow-up'
  | 'arrow-down'
  
  // Chart
  | 'bar-chart';

const iconMap: Record<IconName, LucideIcon> = {
  // Navigation
  'map-pin': MapPin,
  'bar-chart-3': BarChart3,
  'trending-up': TrendingUp,
  'file-text': FileText,
  'database': Database,
  
  // Status
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  
  // Actions
  'plus': Plus,
  'edit-3': Edit3,
  'trash-2': Trash2,
  'save': Save,
  'download': Download,
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  'eye': Eye,
  'camera': Camera,
  'x': X,
  
  // Threats
  'globe': Globe,
  'waves': Waves,
  'cloud-rain': CloudRain,
  'leaf': Leaf,
  'building': Building,
  'users': Users,
  'shield': Shield,
  'swords': Swords,
  'thermometer': Thermometer,
  'help-circle': HelpCircle,
  
  // Sort
  'arrow-up-down': ArrowUpDown,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  
  // Chart
  'bar-chart': BarChart,
};

export interface IconProps {
  name: IconName;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  strokeWidth?: number;
  'aria-label'?: string;
  title?: string;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  color,
  strokeWidth = 2,
  'aria-label': ariaLabel,
  title,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  const iconSize = typeof size === 'number' ? size : sizeMap[size];
  
  return (
    <IconComponent
      size={iconSize}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
    />
  );
};

export default Icon;