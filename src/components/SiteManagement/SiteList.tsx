import React, { useState, useEffect, useMemo } from 'react';
import { DataManager } from '../../services/DataManager';
import type { HeritageSite, SiteStatus, RiskPriority } from '../../types';
import styles from './SiteList.module.css';

interface SiteListProps {
  onSiteSelect?: (siteId: string) => void;
  onSiteEdit?: (siteId: string) => void;
  onSiteAdd?: () => void;
}

interface FilterOptions {
  searchTerm: string;
  statusFilter: SiteStatus | 'all';
  riskFilter: RiskPriority | 'all';
  countryFilter: string;
}

type SortField = 'name' | 'riskLevel' | 'lastAssessment' | 'country';
type SortDirection = 'asc' | 'desc';

export const SiteList: React.FC<SiteListProps> = ({ 
  onSiteSelect, 
  onSiteEdit, 
  onSiteAdd 
}) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statusFilter: 'all',
    riskFilter: 'all',
    countryFilter: ''
  });
  
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load sites data
  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        setError(null);
        const sitesData = await DataManager.getHeritageSites();
        setSites(sitesData);
      } catch (err) {
        setError('Failed to load heritage sites');
        console.error('Error loading sites:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  // Get unique countries for filter dropdown
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(sites.map(site => site.location.country))];
    return uniqueCountries.sort();
  }, [sites]);

  // Filter and sort sites
  const filteredAndSortedSites = useMemo(() => {
    let filtered = sites.filter(site => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          site.name.toLowerCase().includes(searchLower) ||
          site.description.toLowerCase().includes(searchLower) ||
          site.location.address.toLowerCase().includes(searchLower) ||
          site.location.country.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.statusFilter !== 'all' && site.currentStatus !== filters.statusFilter) {
        return false;
      }

      // Risk level filter
      if (filters.riskFilter !== 'all' && site.riskProfile.overallRisk !== filters.riskFilter) {
        return false;
      }

      // Country filter
      if (filters.countryFilter && site.location.country !== filters.countryFilter) {
        return false;
      }

      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'riskLevel':
          // Sort by risk priority weight (higher weight = higher risk)
          const riskWeights = {
            'extremely-high': 5,
            'very-high': 4,
            'high': 3,
            'medium-high': 2,
            'low': 1
          };
          aValue = riskWeights[a.riskProfile.overallRisk];
          bValue = riskWeights[b.riskProfile.overallRisk];
          break;
        case 'lastAssessment':
          aValue = a.lastAssessment.getTime();
          bValue = b.lastAssessment.getTime();
          break;
        case 'country':
          aValue = a.location.country.toLowerCase();
          bValue = b.location.country.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sites, filters, sortField, sortDirection]);

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      riskFilter: 'all',
      countryFilter: ''
    });
  };

  const getRiskLevelColor = (priority: RiskPriority): string => {
    const colors = {
      'extremely-high': '#dc3545',
      'very-high': '#fd7e14',
      'high': '#ffc107',
      'medium-high': '#20c997',
      'low': '#28a745'
    };
    return colors[priority];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getSortIcon = (field: SortField): string => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading heritage sites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Heritage Sites</h1>
        {onSiteAdd && (
          <button onClick={onSiteAdd} className={styles.addButton}>
            + Add New Site
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search sites by name, description, or location..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="status-filter" className={styles.filterLabel}>
              Status:
            </label>
            <select
              id="status-filter"
              value={filters.statusFilter}
              onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
              <option value="critical">Critical</option>
              <option value="stable">Stable</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="risk-filter" className={styles.filterLabel}>
              Risk Level:
            </label>
            <select
              id="risk-filter"
              value={filters.riskFilter}
              onChange={(e) => handleFilterChange('riskFilter', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Risk Levels</option>
              <option value="extremely-high">Extremely High</option>
              <option value="very-high">Very High</option>
              <option value="high">High</option>
              <option value="medium-high">Medium High</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="country-filter" className={styles.filterLabel}>
              Country:
            </label>
            <select
              id="country-filter"
              value={filters.countryFilter}
              onChange={(e) => handleFilterChange('countryFilter', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <button onClick={clearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {filteredAndSortedSites.length} of {sites.length} sites
        </span>
      </div>

      {/* Sites Table */}
      <div className={styles.tableContainer}>
        <table className={styles.sitesTable}>
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className={styles.sortableHeader}
              >
                Site Name {getSortIcon('name')}
              </th>
              <th 
                onClick={() => handleSort('country')}
                className={styles.sortableHeader}
              >
                Location {getSortIcon('country')}
              </th>
              <th>Status</th>
              <th 
                onClick={() => handleSort('riskLevel')}
                className={styles.sortableHeader}
              >
                Risk Level {getSortIcon('riskLevel')}
              </th>
              <th 
                onClick={() => handleSort('lastAssessment')}
                className={styles.sortableHeader}
              >
                Last Assessment {getSortIcon('lastAssessment')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSites.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noResults}>
                  No heritage sites found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedSites.map(site => (
                <tr key={site.id} className={styles.siteRow}>
                  <td className={styles.siteNameCell}>
                    <div className={styles.siteName}>{site.name}</div>
                    <div className={styles.siteDescription}>
                      {site.description.length > 100 
                        ? `${site.description.substring(0, 100)}...`
                        : site.description
                      }
                    </div>
                  </td>
                  <td>
                    <div className={styles.location}>
                      <div>{site.location.address}</div>
                      <div className={styles.country}>{site.location.country}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[site.currentStatus]}`}>
                      {site.currentStatus.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={styles.riskBadge}
                      style={{ backgroundColor: getRiskLevelColor(site.riskProfile.overallRisk) }}
                    >
                      {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(site.lastAssessment)}
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actions}>
                      {onSiteSelect && (
                        <button
                          onClick={() => onSiteSelect(site.id)}
                          className={styles.actionButton}
                          title="View Details"
                        >
                          👁️
                        </button>
                      )}
                      {onSiteEdit && (
                        <button
                          onClick={() => onSiteEdit(site.id)}
                          className={styles.actionButton}
                          title="Edit Site"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};