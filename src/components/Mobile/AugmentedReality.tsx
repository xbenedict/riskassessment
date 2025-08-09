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
  // Placeholder model assets; replace with Petra restoration assets when available
  // Using public domain example astronaut as a working demo
  const glbSrc = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  const usdzSrc = 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz';

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Augmented Reality Preview</h2>
      <p>View a restoration concept in AR. Petra support is enabled as a demo.</p>
      {/* Wrapper card ensures consistent app styling if Card exists; fallback to div if missing */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-lg, 0 10px 20px rgba(0,0,0,0.1))' }}>
        <model-viewer
          src={glbSrc}
          ios-src={usdzSrc}
          alt="Petra restoration concept"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity={1}
          environment-image="neutral"
          xr-environment
          style={{ width: '100%', height: '70vh', background: '#eee' }}
        >
          <button slot="ar-button" style={{
            backgroundColor: '#fff', borderRadius: 18, border: '1px solid #DADCE0',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 16,
            padding: '0 16px 0 40px', lineHeight: '36px', height: 36, color: '#4285f4',
            backgroundImage: 'url(https://modelviewer.dev/assets/ic_view_in_ar_new_googblue_48dp.png)',
            backgroundRepeat: 'no-repeat', backgroundSize: '20px 20px', backgroundPosition: '12px 50%'
          }}>
            View in your space
          </button>
        </model-viewer>
      </div>
      <small style={{ display: 'block', marginTop: 8, color: 'var(--color-text-muted, #666)' }}>
        Tip: AR requires HTTPS and a supported device. On iOS, Quick Look will open using USDZ.
      </small>
    </div>
  );
};

export default AugmentedReality;

