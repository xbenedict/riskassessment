// Comprehensive Dashboard Component
// Provides overview of all managed heritage sites with KPIs, risk summaries, and alerts

import React, { useState, useEffect } from 'react';
import { RiskChart } from './RiskChart';
import { SiteMap } from './SiteMap';
import { DataManager } from '../../services/DataManager';
import { RiskCalculator } from '../../utils/RiskCalculator';
import { Card, Button, Loading, Icon } from '../UI';
import type { HeritageSite, RiskAssessment, RiskPriority } from '../../types';
import styles from './Dashboard.module.css';

interface DashboardProps {
  className?: string;
}

interface DashboardStats {
  totalSites: number;
  criticalSites: number;
  totalAssessments: number;
  averageRiskMagnitude: number;
  highPriorityRisks: number;
  recentAssessments: number;
}

interface AlertNotification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  siteId: string;
  siteName: string;
  timestamp: Date;
  priority: RiskPriority;
}

/**
 * Comprehensive Dashboard Component
 * Shows overview of all managed heritage sites with KPIs, risk summaries, and alerts
 */
export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [allAssessments, setAllAssessments] = useState<RiskAssessment[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<RiskAssessment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSites: 0,
    criticalSites: 0,
    totalAssessments: 0,
    averageRiskMagnitude: 0,
    highPriorityRisks: 0,
    recentAssessments: 0
  });
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all heritage sites
      const sitesData = await DataManager.getHeritageSites();
      setSites(sitesData);

      // Load all risk assessments
      const allAssessmentsData = await DataManager.getAllAssessments();
      setAllAssessments(allAssessmentsData);

      // Get recent assessments (last 30 days)
      const recentAssessmentsData = await DataManager.getRecentAssessments(10);
      setRecentAssessments(recentAssessmentsData);

      // Calculate dashboard statistics
      const dashboardStats = calculateStats(sitesData, allAssessmentsData, recentAssessmentsData);
      setStats(dashboardStats);

      // Generate alert notifications
      const alertNotifications = generateAlerts(sitesData, allAssessmentsData);
      setAlerts(alertNotifications);

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (
    sites: HeritageSite[], 
    assessments: RiskAssessment[], 
    recent: RiskAssessment[]
  ): DashboardStats => {
    const criticalSites = sites.filter(site => 
      ['extremely-high', 'very-high'].includes(site.riskProfile.overallRisk)
    ).length;

    const highPriorityRisks = assessments.filter(assessment => 
      ['extremely-high', 'very-high'].includes(assessment.priority)
    ).length;

    const averageRiskMagnitude = assessments.length > 0 
      ? assessments.reduce((sum, assessment) => sum + assessment.magnitude, 0) / assessments.length
      : 0;

    return {
      totalSites: sites.length,
      criticalSites,
      totalAssessments: assessments.length,
      averageRiskMagnitude: Math.round(averageRiskMagnitude * 10) / 10,
      highPriorityRisks,
      recentAssessments: recent.length
    };
  };

  const generateAlerts = (sites: HeritageSite[], assessments: RiskAssessment[]): AlertNotification[] => {
    const alerts: AlertNotification[] = [];

    // Generate alerts for high-risk sites
    sites.forEach(site => {
      const siteAssessments = assessments.filter(a => a.siteId === site.id);
      const criticalAssessments = siteAssessments.filter(a => 
        a.priority === 'extremely-high'
      );
      const highAssessments = siteAssessments.filter(a => 
        a.priority === 'very-high'
      );

      // Critical risk alerts
      if (criticalAssessments.length > 0) {
        alerts.push({
          id: `critical-${site.id}`,
          type: 'critical',
          title: 'Critical Risk Alert',
          message: `${site.name} has ${criticalAssessments.length} extremely high priority risk(s) requiring immediate attention.`,
          siteId: site.id,
          siteName: site.name,
          timestamp: new Date(),
          priority: 'extremely-high'
        });
      }

      // High risk warnings
      if (highAssessments.length > 0) {
        alerts.push({
          id: `warning-${site.id}`,
          type: 'warning',
          title: 'High Risk Warning',
          message: `${site.name} has ${highAssessments.length} very high priority risk(s) that need urgent attention.`,
          siteId: site.id,
          siteName: site.name,
          timestamp: new Date(),
          priority: 'very-high'
        });
      }

      // Assessment overdue alerts
      const daysSinceLastAssessment = Math.floor(
        (new Date().getTime() - site.lastAssessment.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastAssessment > 90) {
        alerts.push({
          id: `overdue-${site.id}`,
          type: 'info',
          title: 'Assessment Overdue',
          message: `${site.name} hasn't been assessed in ${daysSinceLastAssessment} days. Consider scheduling a new assessment.`,
          siteId: site.id,
          siteName: site.name,
          timestamp: new Date(),
          priority: 'medium-high'
        });
      }
    });

    // Sort alerts by priority and timestamp
    return alerts.sort((a, b) => {
      const priorityOrder = { 'critical': 3, 'warning': 2, 'info': 1 };
      const priorityDiff = priorityOrder[b.type] - priorityOrder[a.type];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  const handleSiteSelect = (site: HeritageSite) => {
    setSelectedSite(site);
  };

  const handleAlertDismiss = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatThreatType = (threatType: string): string => {
    return threatType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <Loading 
          variant="container" 
          size="large" 
          message="Loading dashboard data..." 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <Card className={styles.errorCard}>
          <div className={styles.errorContent}>
            <Icon name="AlertTriangle" size="lg" className={styles.errorIcon} />
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <Button 
              onClick={loadDashboardData} 
              variant="primary"
              icon="RefreshCw"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      {/* Dashboard Header */}
      <div className={styles.header}>
        <h1>Heritage Guardian Dashboard</h1>
        <p>Comprehensive overview of all managed heritage sites</p>
        <div className={styles.lastUpdated}>
          Last updated: {formatDate(new Date())}
        </div>
      </div>

      {/* Alert Notifications */}
      {showAlerts && alerts.length > 0 && (
        <div className={styles.alertsSection}>
          <div className={styles.alertsHeader}>
            <h2>Alert Notifications</h2>
            <Button 
              variant="ghost"
              size="small"
              icon="EyeOff"
              onClick={() => setShowAlerts(false)}
            >
              Hide Alerts
            </Button>
          </div>
          <div className={styles.alertsList}>
            {alerts.slice(0, 5).map(alert => (
              <Card 
                key={alert.id} 
                variant="outlined"
                className={`${styles.alert} ${styles[alert.type]}`}
              >
                <div className={styles.alertContent}>
                  <div className={styles.alertHeader}>
                    <div className={styles.alertTitleRow}>
                      <Icon 
                        name={alert.type === 'critical' ? 'AlertTriangle' : alert.type === 'warning' ? 'AlertCircle' : 'Info'} 
                        size="sm" 
                        className={styles.alertIcon}
                      />
                      <h4>{alert.title}</h4>
                    </div>
                    <Button 
                      variant="ghost"
                      size="small"
                      icon="X"
                      onClick={() => handleAlertDismiss(alert.id)}
                      className={styles.dismissButton}
                    />
                  </div>
                  <p>{alert.message}</p>
                  <div className={styles.alertMeta}>
                    <span className={styles.siteName}>{alert.siteName}</span>
                    <span className={styles.timestamp}>{formatDate(alert.timestamp)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className={styles.kpiSection}>
        <h2>Key Performance Indicators</h2>
        <div className={styles.kpiGrid}>
          <Card 
            variant="elevated" 
            interactive 
            className={styles.kpiCard}
          >
            <div className={styles.kpiIcon}>
              <Icon name="MapPin" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.totalSites}</div>
            <div className={styles.kpiLabel}>Total Heritage Sites</div>
            <div className={styles.kpiSubtext}>Under management</div>
          </Card>
          
          <Card 
            variant="elevated" 
            interactive 
            className={`${styles.kpiCard} ${stats.criticalSites > 0 ? styles.critical : ''}`}
          >
            <div className={styles.kpiIcon}>
              <Icon name="AlertTriangle" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.criticalSites}</div>
            <div className={styles.kpiLabel}>Critical Risk Sites</div>
            <div className={styles.kpiSubtext}>Requiring immediate attention</div>
          </Card>
          
          <Card 
            variant="elevated" 
            interactive 
            className={styles.kpiCard}
          >
            <div className={styles.kpiIcon}>
              <Icon name="FileText" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.totalAssessments}</div>
            <div className={styles.kpiLabel}>Total Risk Assessments</div>
            <div className={styles.kpiSubtext}>Across all sites</div>
          </Card>
          
          <Card 
            variant="elevated" 
            interactive 
            className={styles.kpiCard}
          >
            <div className={styles.kpiIcon}>
              <Icon name="BarChart3" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.averageRiskMagnitude}</div>
            <div className={styles.kpiLabel}>Average Risk Magnitude</div>
            <div className={styles.kpiSubtext}>ABC scale (3-15)</div>
          </Card>
          
          <Card 
            variant="elevated" 
            interactive 
            className={`${styles.kpiCard} ${stats.highPriorityRisks > 0 ? styles.warning : ''}`}
          >
            <div className={styles.kpiIcon}>
              <Icon name="AlertCircle" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.highPriorityRisks}</div>
            <div className={styles.kpiLabel}>High Priority Risks</div>
            <div className={styles.kpiSubtext}>Extremely high + Very high</div>
          </Card>
          
          <Card 
            variant="elevated" 
            interactive 
            className={styles.kpiCard}
          >
            <div className={styles.kpiIcon}>
              <Icon name="Clock" size="lg" />
            </div>
            <div className={styles.kpiValue}>{stats.recentAssessments}</div>
            <div className={styles.kpiLabel}>Recent Assessments</div>
            <div className={styles.kpiSubtext}>Last 30 days</div>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainContent}>
        {/* Heritage Sites Map */}
        <Card variant="elevated" className={styles.mapSection}>
          <div className={styles.mapHeader}>
            <h3>Heritage Sites Map</h3>
            <Icon name="Map" size="md" />
          </div>
          <SiteMap
            selectedSiteId={selectedSite?.id}
            onSiteSelect={handleSiteSelect}
            showThreatZones={true}
            className={styles.dashboardMap}
          />
        </Card>

        {/* Risk Summary Charts */}
        <div className={styles.chartsSection}>
          <Card variant="elevated" className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Risk Priority Distribution</h3>
              <Icon name="PieChart" size="md" />
            </div>
            <RiskChart
              assessments={allAssessments}
              chartType="category"
              title=""
              responsive={true}
              showExport={false}
            />
          </Card>
          
          <Card variant="elevated" className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h3>Threat Type Analysis</h3>
              <Icon name="BarChart3" size="md" />
            </div>
            <RiskChart
              assessments={allAssessments}
              chartType="threat-comparison"
              title=""
              responsive={true}
              showExport={false}
            />
          </Card>
        </div>
      </div>

      {/* Recent Assessments Timeline */}
      <Card variant="elevated" className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Risk Assessments</h2>
          <Icon name="Clock" size="md" />
        </div>
        {recentAssessments.length === 0 ? (
          <div className={styles.noData}>
            <Icon name="Calendar" size="lg" className={styles.noDataIcon} />
            <p>No recent risk assessments found.</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {recentAssessments.map(assessment => {
              const site = sites.find(s => s.id === assessment.siteId);
              return (
                <Card 
                  key={assessment.id} 
                  variant="outlined"
                  interactive
                  className={styles.timelineItem}
                >
                  <div className={styles.timelineItemContent}>
                    <div className={`${styles.timelineMarker} ${styles[assessment.priority.replace('-', '')]}`}>
                      <Icon 
                        name={assessment.priority === 'extremely-high' || assessment.priority === 'very-high' ? 'AlertTriangle' : 'AlertCircle'} 
                        size="sm" 
                      />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>{site?.name || 'Unknown Site'}</h4>
                        <span className={styles.timelineDate}>
                          {formatDate(assessment.assessmentDate)}
                        </span>
                      </div>
                      <div className={styles.timelineDetails}>
                        <span className={styles.threatType}>
                          {formatThreatType(assessment.threatType)}
                        </span>
                        <span className={`${styles.priorityBadge} ${styles[assessment.priority.replace('-', '')]}`}>
                          {assessment.priority.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={styles.magnitude}>
                          Magnitude: {assessment.magnitude}
                        </span>
                      </div>
                      <p className={styles.assessmentNotes}>
                        {assessment.notes.length > 100 
                          ? `${assessment.notes.substring(0, 100)}...`
                          : assessment.notes
                        }
                      </p>
                      <div className={styles.assessor}>
                        Assessed by: {assessment.assessor}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Site Summary Table */}
      <Card variant="elevated" className={styles.sitesSection}>
        <div className={styles.sectionHeader}>
          <h2>Heritage Sites Summary</h2>
          <Icon name="Building" size="md" />
        </div>
        <div className={styles.sitesGrid}>
          {sites.map(site => (
            <Card 
              key={site.id} 
              variant="outlined"
              interactive
              className={`${styles.siteCard} ${selectedSite?.id === site.id ? styles.selected : ''}`}
              onClick={() => handleSiteSelect(site)}
            >
              <div className={styles.siteCardHeader}>
                <div className={styles.siteInfo}>
                  <h4>{site.name}</h4>
                  <p className={styles.siteLocation}>
                    <Icon name="MapPin" size="sm" />
                    {site.location.address}, {site.location.country}
                  </p>
                </div>
                <div className={styles.siteStatus}>
                  <span className={`${styles.riskBadge} ${styles[site.riskProfile.overallRisk.replace('-', '')]}`}>
                    {site.riskProfile.overallRisk.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className={styles.siteCardBody}>
                <div className={styles.siteMetrics}>
                  <div className={styles.metric}>
                    <Icon name="Calendar" size="sm" />
                    <span>Last Assessment: {formatDate(site.lastAssessment)}</span>
                  </div>
                  <div className={styles.metric}>
                    <Icon name="Activity" size="sm" />
                    <span className={`${styles.statusBadge} ${styles[site.currentStatus.replace('-', '')]}`}>
                      {site.currentStatus.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className={styles.threatTags}>
                  {site.riskProfile.activeThreats.slice(0, 3).map(threat => (
                    <span key={threat} className={styles.threatTag}>
                      {formatThreatType(threat)}
                    </span>
                  ))}
                  {site.riskProfile.activeThreats.length > 3 && (
                    <span className={styles.moreThreats}>
                      +{site.riskProfile.activeThreats.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;