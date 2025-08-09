import React from 'react';

declare module 'react' {
  // Augment React's JSX to recognize the <model-viewer> custom element
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


