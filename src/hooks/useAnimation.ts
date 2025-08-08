import { useEffect, useRef, useState } from 'react';

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterations?: number | 'infinite';
}

export interface UseAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isAnimating: boolean;
  play: () => void;
  pause: () => void;
  cancel: () => void;
  finish: () => void;
}

/**
 * Custom hook for managing CSS animations with enhanced control
 */
export function useAnimation(
  animationName: string,
  options: AnimationOptions = {}
): UseAnimationReturn {
  const ref = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<Animation | null>(null);

  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    fillMode = 'both',
    iterations = 1
  } = options;

  const play = () => {
    if (!ref.current) return;

    // Cancel any existing animation
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    // Create new animation
    const keyframes = getKeyframesForAnimation(animationName);
    if (!keyframes) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    const animation = ref.current.animate(keyframes, {
      duration,
      delay,
      easing,
      fill: fillMode,
      iterations
    });

    animationRef.current = animation;
    setIsAnimating(true);

    animation.addEventListener('finish', () => {
      setIsAnimating(false);
    });

    animation.addEventListener('cancel', () => {
      setIsAnimating(false);
    });
  };

  const pause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const cancel = () => {
    if (animationRef.current) {
      animationRef.current.cancel();
      setIsAnimating(false);
    }
  };

  const finish = () => {
    if (animationRef.current) {
      animationRef.current.finish();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  return {
    ref,
    isAnimating,
    play,
    pause,
    cancel,
    finish
  };
}

/**
 * Hook for entrance animations that trigger on mount
 */
export function useEntranceAnimation(
  animationName: string,
  options: AnimationOptions & { autoPlay?: boolean } = {}
): UseAnimationReturn {
  const { autoPlay = true, ...animationOptions } = options;
  const animation = useAnimation(animationName, animationOptions);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        animation.play();
      }, 50); // Small delay to ensure element is rendered

      return () => clearTimeout(timer);
    }
  }, [autoPlay, animation]);

  return animation;
}

/**
 * Hook for hover animations
 */
export function useHoverAnimation(
  enterAnimation: string,
  exitAnimation?: string,
  options: AnimationOptions = {}
): {
  ref: React.RefObject<HTMLElement>;
  isHovered: boolean;
} {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const enterAnim = useAnimation(enterAnimation, options);
  const exitAnim = useAnimation(exitAnimation || enterAnimation, options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      exitAnim.cancel();
      enterAnim.play();
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      enterAnim.cancel();
      if (exitAnimation) {
        exitAnim.play();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enterAnim, exitAnim, exitAnimation]);

  // Merge refs
  useEffect(() => {
    if (ref.current) {
      (enterAnim.ref as any).current = ref.current;
      (exitAnim.ref as any).current = ref.current;
    }
  }, [enterAnim.ref, exitAnim.ref]);

  return {
    ref,
    isHovered
  };
}

/**
 * Hook for staggered animations on lists
 */
export function useStaggeredAnimation(
  animationName: string,
  options: AnimationOptions & { staggerDelay?: number } = {}
): {
  refs: React.RefObject<HTMLElement>[];
  playAll: () => void;
  addRef: () => React.RefObject<HTMLElement>;
} {
  const [refs, setRefs] = useState<React.RefObject<HTMLElement>[]>([]);
  const { staggerDelay = 100, ...animationOptions } = options;

  const addRef = () => {
    const newRef = { current: null } as React.RefObject<HTMLElement>;
    setRefs(prev => [...prev, newRef]);
    return newRef;
  };

  const playAll = () => {
    refs.forEach((ref, index) => {
      if (ref.current) {
        const keyframes = getKeyframesForAnimation(animationName);
        if (keyframes) {
          setTimeout(() => {
            ref.current?.animate(keyframes, {
              duration: animationOptions.duration || 300,
              delay: animationOptions.delay || 0,
              easing: animationOptions.easing || 'ease',
              fill: animationOptions.fillMode || 'both',
              iterations: animationOptions.iterations || 1
            });
          }, index * staggerDelay);
        }
      }
    });
  };

  return {
    refs,
    playAll,
    addRef
  };
}

/**
 * Get keyframes for predefined animations
 */
function getKeyframesForAnimation(animationName: string): Keyframe[] | null {
  const animations: Record<string, Keyframe[]> = {
    fadeIn: [
      { opacity: 0 },
      { opacity: 1 }
    ],
    fadeOut: [
      { opacity: 1 },
      { opacity: 0 }
    ],
    slideInUp: [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    slideInDown: [
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    slideInLeft: [
      { opacity: 0, transform: 'translateX(-20px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ],
    slideInRight: [
      { opacity: 0, transform: 'translateX(20px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ],
    scaleIn: [
      { opacity: 0, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    scaleOut: [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.9)' }
    ],
    bounceIn: [
      { opacity: 0, transform: 'scale(0.3)' },
      { opacity: 1, transform: 'scale(1.05)' },
      { opacity: 1, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    shake: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ],
    pulse: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' }
    ],
    float: [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-6px)' },
      { transform: 'translateY(0px)' }
    ],
    glow: [
      { boxShadow: '0 0 5px rgba(54, 99, 124, 0.2)' },
      { boxShadow: '0 0 20px rgba(54, 99, 124, 0.4)' },
      { boxShadow: '0 0 5px rgba(54, 99, 124, 0.2)' }
    ]
  };

  return animations[animationName] || null;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}