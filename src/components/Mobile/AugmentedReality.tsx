import React from 'react';
import backgroundImage from '../../assets/images/background.jpeg';

// Minimal JSX typing for the <model-viewer> custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: number | string;
        'environment-image'?: string;
        'ar-placement'?: 'floor' | 'wall';
        'xr-environment'?: boolean;
        style?: React.CSSProperties;
      };
    }
  }
}

interface AugmentedRealityProps {
  // Site ID; for now we use '1' (Petra) by default
  defaultSiteId?: string;
}

export const AugmentedReality: React.FC<AugmentedRealityProps> = () => {
  return (
    <div style={{ 
      padding: '1rem', 
      paddingBottom: '5rem', 
      backgroundImage: `url(${backgroundImage})`,
      backgroundColor: 'var(--color-bg-tertiary)',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(21, 47, 75, 0.8) 0%, rgba(13, 34, 56, 0.7) 100%)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(54, 99, 124, 0.3)',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <header style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        borderBottom: '1px solid var(--color-border-light)',
        marginBottom: '2rem',
        padding: '1.5rem 1rem 1rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
        borderRadius: '0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                color: 'var(--color-accent)',
                margin: '0',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>Augmented Reality</h1>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                margin: '0',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>3D Site Visualization</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            background: 'rgba(var(--color-accent-rgb), 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
            minWidth: '60px'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-accent)',
              lineHeight: '1'
            }}>1</span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '500'
            }}>Model</span>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--color-border-light)'
        }}>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            margin: '0',
            opacity: '0.8'
          }}>View a restoration concept in AR. Petra support is enabled as a demo.</p>
        </div>
      </header>
      {/* Wrapper card ensures consistent app styling if Card exists; fallback to div if missing */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-lg, 0 10px 20px rgba(0,0,0,0.1))' }}>
        <iframe
          title="Al Khazneh - Petra (Sketchfab)"
          src="https://sketchfab.com/models/39ef0f6c82224860ad49039d2534046d/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_ar=1"
          allow="autoplay; fullscreen; xr-spatial-tracking; gamepad; gyroscope; accelerometer"
          allowFullScreen
          style={{ width: '100%', height: '70vh', border: 0, background: '#000' }}
        />
      </div>
      <small style={{ display: 'block', marginTop: 8, color: 'var(--color-text-muted, #666)' }}>
        Tip: For AR, device/browser support depends on Sketchfab capabilities for this model.
      </small>
      </div>
    </div>
  );
};

export default AugmentedReality;

