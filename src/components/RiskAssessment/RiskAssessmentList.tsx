import React, { useState, useMemo } from 'react';
import { RiskCalculator } from '../../utils/RiskCalculator';
import type { RiskAssessment, ThreatType, RiskPriority } from '../../types';
import { ThreatType as ThreatTypeEnum } from '../../types';
import { Icon } from '../UI';
import styles from './RiskAssessmentList.module.css';

interface RiskAssessmentListProps {
  assessments: RiskAssessment[];
  onAssessmentClick?: (assessment: RiskAssessment) => void;
  onEditAssessment?: (assessment: RiskAssessment) => void;
  onDeleteAssessment?: (assessmentId: string) => void;
}

type SortOption = 'magnitude' | 'priority' | 'date' | 'threat' | 'assessor';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  threatType: ThreatType | 'all';
  priority: RiskPriority | 'all';
  searchTerm: string;
}

export const RiskAssessmentList: React.FC<RiskAssessmentListProps> = ({
  assessments,
  onAssessmentClick,
  onEditAssessment,
  onDeleteAssessment
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState<FilterState>({
    threatType: 'all',
    priority: 'all',
    searchTerm: ''
  });

  // Filter and sort assessments
  const filteredAndSortedAssessments = useMemo(() => {
    let filtered = assessments.filter(assessment => {
      // Filter by threat type
      if (filters.threatType !== 'all' && assessment.threatType !== filters.threatType) {
        return false;
      }

      // Filter by priority
      if (filters.priority !== 'all' && assessment.priority !== filters.priority) {
        return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          assessment.threatType.toLowerCase().includes(searchLower) ||
          assessment.assessor.toLowerCase().includes(searchLower) ||
          assessment.notes.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    // Sort assessments
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'magnitude':
          comparison = a.magnitude - b.magnitude;
          break;
        case 'priority':
          comparison = RiskCalculator.getPriorityWeight(a.priority) - RiskCalculator.getPriorityWeight(b.priority);
          break;
        case 'date':
          comparison = new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime();
          break;
        case 'threat':
          comparison = a.threatType.localeCompare(b.threatType);
          break;
        case 'assessor':
          comparison = a.assessor.localeCompare(b.assessor);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [assessments, filters, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getPriorityClassName = (priority: RiskPriority): string => {
    const classMap: Record<RiskPriority, string> = {
      'extremely-high': styles.priorityExtremelyHigh,
      'very-high': styles.priorityVeryHigh,
      'high': styles.priorityHigh,
      'medium-high': styles.priorityMediumHigh,
      'low': styles.priorityLow
    };
    return classMap[priority];
  };

  const getCardClassName = (priority: RiskPriority): string => {
    const baseClass = styles.assessmentCard;
    const priorityClasses: Record<RiskPriority, string> = {
      'extremely-high': styles.cardExtremelyHigh,
      'very-high': styles.cardVeryHigh,
      'high': styles.cardHigh,
      'medium-high': styles.cardMediumHigh,
      'low': styles.cardLow
    };
    return `${baseClass} ${priorityClasses[priority]}`;
  };

  const getUncertaintyClassName = (level: string): string => {
    const classMap: Record<string, string> = {
      'low': styles.uncertaintyLow,
      'medium': styles.uncertaintyMedium,
      'high': styles.uncertaintyHigh
    };
    return `${styles.uncertaintyIndicator} ${classMap[level] || styles.uncertaintyLow}`;
  };

  const formatThreatType = (threatType: ThreatType): string => {
    return threatType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const threatTypeOptions = [
    { value: 'all', label: 'All Threats' },
    ...Object.values(ThreatTypeEnum).map(value => ({
      value,
      label: formatThreatType(value)
    }))
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'extremely-high', label: 'Extremely High' },
    { value: 'very-high', label: 'Very High' },
    { value: 'high', label: 'High' },
    { value: 'medium-high', label: 'Medium High' },
    { value: 'low', label: 'Low' }
  ];

  if (assessments.length === 0) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Icon name="bar-chart" size="xl" />
          </div>
          <div className={styles.emptyStateTitle}>No Risk Assessments</div>
          <div className={styles.emptyStateMessage}>
            No risk assessments have been created yet. Start by creating your first assessment to track and prioritize threats to heritage sites.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Risk Assessments</h2>
        
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [newSortBy, newDirection] = e.target.value.split('-') as [SortOption, SortDirection];
                setSortBy(newSortBy);
                setSortDirection(newDirection);
              }}
              className={styles.select}
            >
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="magnitude-desc">Magnitude (High to Low)</option>
              <option value="magnitude-asc">Magnitude (Low to High)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="threat-asc">Threat Type (A-Z)</option>
              <option value="threat-desc">Threat Type (Z-A)</option>
              <option value="assessor-asc">Assessor (A-Z)</option>
              <option value="assessor-desc">Assessor (Z-A)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Threat Type</label>
            <select
              value={filters.threatType}
              onChange={(e) => updateFilter('threatType', e.target.value as ThreatType | 'all')}
              className={styles.select}
            >
              {threatTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value as RiskPriority | 'all')}
              className={styles.select}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search</label>
            <input
              type="text"
              placeholder="Search assessments..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.resultsCount}>
        Showing {filteredAndSortedAssessments.length} of {assessments.length} assessments
      </div>

      {filteredAndSortedAssessments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Icon name="search" size="xl" />
          </div>
          <div className={styles.emptyStateTitle}>No Matching Assessments</div>
          <div className={styles.emptyStateMessage}>
            No assessments match your current filters. Try adjusting your search criteria or clearing filters.
          </div>
        </div>
      ) : (
        <div className={styles.assessmentGrid}>
          {filteredAndSortedAssessments.map(assessment => (
            <div
              key={assessment.id}
              className={getCardClassName(assessment.priority)}
              onClick={() => onAssessmentClick?.(assessment)}
              style={{ cursor: onAssessmentClick ? 'pointer' : 'default' }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.threatType}>
                  {formatThreatType(assessment.threatType)}
                </div>
                <div className={`${styles.priorityBadge} ${getPriorityClassName(assessment.priority)}`}>
                  {assessment.priority.replace('-', ' ')}
                </div>
              </div>

              <div className={styles.magnitudeSection}>
                <div className={styles.magnitudeDisplay}>
                  {assessment.magnitude}
                </div>
                <div className={styles.componentsBreakdown}>
                  <div className={styles.component}>
                    <span className={styles.componentLabel}>A:</span>
                    <span>{assessment.probability}</span>
                  </div>
                  <div className={styles.component}>
                    <span className={styles.componentLabel}>B:</span>
                    <span>{assessment.lossOfValue}</span>
                  </div>
                  <div className={styles.component}>
                    <span className={styles.componentLabel}>C:</span>
                    <span>{assessment.fractionAffected}</span>
                  </div>
                </div>
              </div>

              <div className={styles.assessmentDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Uncertainty:</span>
                  <span className={getUncertaintyClassName(assessment.uncertaintyLevel)}>
                    {assessment.uncertaintyLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {assessment.notes && (
                <div className={styles.notes}>
                  {assessment.notes.length > 150 
                    ? `${assessment.notes.substring(0, 150)}...` 
                    : assessment.notes
                  }
                </div>
              )}

              <div className={styles.cardFooter}>
                <div className={styles.assessor}>
                  By {assessment.assessor}
                </div>
                <div className={styles.assessmentDate}>
                  {formatDate(assessment.assessmentDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};