import React, { useState } from 'react';
import { Button, Card, Input, Progress, Skeleton, Toast } from './index';
import { useAnimation, useEntranceAnimation, useHoverAnimation } from '../../hooks/useAnimation';
import styles from './AnimationDemo.module.css';

export const AnimationDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Animation hooks
  const fadeInAnimation = useEntranceAnimation('fadeIn', { duration: 500 });
  const slideInAnimation = useEntranceAnimation('slideInUp', { duration: 600, delay: 200 });
  const scaleAnimation = useAnimation('scaleIn', { duration: 300 });
  const shakeAnimation = useAnimation('shake', { duration: 500 });
  const pulseAnimation = useAnimation('pulse', { duration: 1000, iterations: 'infinite' });

  const hoverCard = useHoverAnimation('float', undefined, { duration: 2000, iterations: 'infinite' });

  const handleProgressDemo = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className={styles.demo}>
      <div className={styles.section} ref={fadeInAnimation.ref}>
        <h2>Animation System Demo</h2>
        <p>Showcase of the comprehensive animation system and micro-interactions.</p>
      </div>

      <div className={styles.section} ref={slideInAnimation.ref}>
        <h3>Button Animations</h3>
        <div className={styles.buttonGroup}>
          <Button variant="primary" onClick={() => scaleAnimation.play()}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={() => shakeAnimation.play()}>
            Secondary Button
          </Button>
          <Button variant="ghost" loading>
            Loading Button
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Card Interactions</h3>
        <div className={styles.cardGrid}>
          <Card interactive padding="medium" ref={hoverCard.ref}>
            <h4>Hover Card</h4>
            <p>This card has a floating animation on hover with enhanced micro-interactions.</p>
          </Card>
          
          <Card interactive padding="medium" ref={scaleAnimation.ref}>
            <h4>Click to Scale</h4>
            <p>Click this card to see the scale animation in action.</p>
          </Card>
          
          <Card padding="medium" ref={pulseAnimation.ref}>
            <h4>Pulsing Card</h4>
            <p>This card demonstrates the pulse animation effect.</p>
            <Button size="small" onClick={() => pulseAnimation.play()}>
              Start Pulse
            </Button>
          </Card>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Form Animations</h3>
        <div className={styles.formDemo}>
          <Input
            label="Animated Input"
            placeholder="Focus me to see animations"
            helperText="Notice the smooth focus transitions and hover effects"
          />
          <Input
            label="Error State"
            error="This field has an error"
            placeholder="Error state with shake animation"
            ref={shakeAnimation.ref}
          />
          <Button onClick={() => shakeAnimation.play()}>
            Trigger Error Animation
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Progress Animations</h3>
        <div className={styles.progressDemo}>
          <Progress value={progress} showLabel />
          <Progress indeterminate />
          <Button onClick={handleProgressDemo}>
            Animate Progress
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Loading States</h3>
        <div className={styles.loadingDemo}>
          {isLoading ? (
            <div className={styles.skeletonGroup}>
              <Skeleton variant="text" lines={3} animation="wave" />
              <Skeleton variant="rectangular" height={200} animation="pulse" />
              <div className={styles.skeletonRow}>
                <Skeleton variant="avatar" animation="wave" />
                <Skeleton variant="button" animation="pulse" />
              </div>
            </div>
          ) : (
            <div className="stagger-fade-in">
              <h4>Content Loaded!</h4>
              <p>This content appears with staggered animations when loading completes.</p>
              <Card padding="medium">
                <p>Card content with smooth entrance animation.</p>
              </Card>
            </div>
          )}
          <Button onClick={handleLoadingDemo}>
            {isLoading ? 'Loading...' : 'Demo Loading States'}
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Toast Notifications</h3>
        <div className={styles.toastDemo}>
          <Button onClick={() => setShowToast(true)}>
            Show Toast
          </Button>
          {showToast && (
            <div className={styles.toastContainer}>
              <Toast
                type="success"
                title="Animation Demo"
                message="This toast slides in with smooth animations and auto-dismisses."
                onClose={() => setShowToast(false)}
                action={{
                  label: 'Action',
                  onClick: () => console.log('Toast action clicked')
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Utility Classes</h3>
        <div className={styles.utilityDemo}>
          <div className="hover-lift">
            <Card padding="small">Hover Lift Effect</Card>
          </div>
          <div className="hover-scale">
            <Card padding="small">Hover Scale Effect</Card>
          </div>
          <div className="hover-glow">
            <Card padding="small">Hover Glow Effect</Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;