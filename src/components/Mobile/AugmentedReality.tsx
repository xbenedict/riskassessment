import React from 'react';

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
    <div style={{ padding: '1rem' }}>
      <h2>Augmented Reality Preview</h2>
      <p>View a restoration concept in AR. Petra support is enabled as a demo.</p>
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
  );
};

export default AugmentedReality;

