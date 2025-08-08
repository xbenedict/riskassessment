# Design Document

## Overview

This design document outlines a comprehensive UI redesign for the Heritage Guardian risk assessment application. The redesign transforms the current interface into a professional, sleek, modern, mobile-first design system that maintains all existing functionality while dramatically improving the user experience through enhanced visual design, subtle animations, and a cohesive design language.

The redesign focuses on creating a professional appearance suitable for heritage site risk assessment work, with a mobile-first approach that ensures optimal usability across all device sizes. The design system will eliminate emoji usage in favor of professional icons, implement subtle animations for enhanced user feedback, and establish a cohesive color system based on the existing three main theme colors.

## Architecture

### Design System Structure

The redesign will implement a comprehensive design system with the following architectural components:

1. **Color System**: A semantic color palette built around the three main theme colors
2. **Typography System**: A modern, readable font hierarchy optimized for all screen sizes
3. **Component Library**: Reusable UI components with consistent styling and behavior
4. **Icon System**: A cohesive icon library replacing all emoji usage
5. **Animation System**: Subtle, purposeful animations for enhanced user feedback
6. **Layout System**: Responsive grid and spacing system for consistent layouts

### Mobile-First Architecture

The design follows a mobile-first approach with progressive enhancement:

- **Base Layer**: Mobile design (320px+)
- **Tablet Layer**: Enhanced layouts for tablet devices (768px+)
- **Desktop Layer**: Full-featured layouts for desktop screens (1024px+)

### Component Hierarchy

```
App Shell
├── Navigation System
│   ├── Mobile Navigation (Bottom Tab Bar)
│   ├── Desktop Navigation (Sidebar/Top Bar)
│   └── Breadcrumb Navigation
├── Content Areas
│   ├── Site Gallery
│   ├── Site Detail Views
│   ├── Dashboard Components
│   ├── Report Generation
│   └── Analytics Views
└── Shared Components
    ├── Buttons & Controls
    ├── Forms & Inputs
    ├── Cards & Containers
    ├── Modals & Overlays
    └── Loading States
```

## Components and Interfaces

### Color System

**Primary Color Palette**
- Primary: `#111f30` (Dark Navy) - Main branding, headers, primary actions
- Secondary: `#D1D0CF` (Light Gray) - Backgrounds, secondary elements
- Tertiary: `#36637C` (Blue-Gray) - Interactive elements, links, accents

**Semantic Color Extensions**
- Primary Light: `#1a2d42` - Hover states, lighter primary elements
- Primary Dark: `#0a1520` - Active states, darker primary elements
- Secondary Light: `#e8e7e6` - Light backgrounds, subtle borders
- Secondary Dark: `#b8b7b6` - Medium contrast elements
- Tertiary Light: `#4a7a95` - Hover states for tertiary elements
- Tertiary Dark: `#2a4f63` - Active states for tertiary elements

**Status Colors** (Preserved from existing system)
- Risk High: `#dc3545` - High risk indicators
- Risk Medium: `#ffc107` - Medium risk indicators  
- Risk Low: `#28a745` - Low risk indicators
- Risk Critical: `#ff6b35` - Critical risk indicators

**Background Colors**
- Background Primary: `#ffffff` - Main content backgrounds
- Background Secondary: `#f8f9fa` - App background, card backgrounds
- Background Tertiary: `#f1f3f4` - Subtle section backgrounds

### Typography System

**Font Stack**: `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

**Type Scale**
- Display Large: 3.5rem (56px) - Hero headings
- Display Medium: 2.75rem (44px) - Page titles
- Display Small: 2.25rem (36px) - Section headers
- Heading Large: 2rem (32px) - Card titles
- Heading Medium: 1.5rem (24px) - Subsection headers
- Heading Small: 1.25rem (20px) - Component headers
- Body Large: 1.125rem (18px) - Important body text
- Body Medium: 1rem (16px) - Standard body text
- Body Small: 0.875rem (14px) - Secondary text
- Caption: 0.75rem (12px) - Labels, captions

**Font Weights**
- Light: 300 - Subtle text elements
- Regular: 400 - Standard body text
- Medium: 500 - Emphasized text
- Semibold: 600 - Headings, important labels
- Bold: 700 - Strong emphasis, primary headings

### Icon System

**Icon Library**: Lucide React (consistent, professional icon set)
**Icon Sizes**: 16px, 20px, 24px, 32px, 48px
**Icon Style**: Outline style with 2px stroke width for consistency

**Navigation Icons**
- Sites: `MapPin` - Represents location-based site management
- Dashboard: `BarChart3` - Analytics and overview data
- Reports: `FileText` - Document generation
- Analytics: `TrendingUp` - Data trends and insights
- Data Management: `Database` - Data organization

**Status Icons**
- High Risk: `AlertTriangle` with red color
- Medium Risk: `AlertCircle` with yellow color
- Low Risk: `CheckCircle` with green color
- Critical Risk: `XCircle` with orange color

**Action Icons**
- Add: `Plus`
- Edit: `Edit3`
- Delete: `Trash2`
- Save: `Save`
- Export: `Download`
- Search: `Search`
- Filter: `Filter`
- Settings: `Settings`

### Component Design Specifications

#### Buttons

**Primary Button**
- Background: `var(--color-tertiary)`
- Text: `var(--color-bg-primary)`
- Border Radius: `12px`
- Padding: `12px 24px`
- Font Weight: 500
- Min Height: `44px` (touch target)
- Hover: Background darkens to `var(--color-tertiary-dark)`
- Active: Scale transform `scale(0.98)`
- Focus: 2px outline in tertiary color

**Secondary Button**
- Background: `transparent`
- Text: `var(--color-tertiary)`
- Border: `1px solid var(--color-tertiary)`
- Same dimensions as primary
- Hover: Background `var(--color-tertiary)` with white text

**Ghost Button**
- Background: `transparent`
- Text: `var(--color-tertiary)`
- No border
- Hover: Background `var(--color-secondary-light)`

#### Cards

**Standard Card**
- Background: `var(--color-bg-primary)`
- Border Radius: `16px`
- Box Shadow: `0 2px 8px rgba(17, 31, 48, 0.08)`
- Padding: `24px`
- Border: `1px solid var(--color-border-light)`

**Interactive Card**
- Hover: Box shadow increases to `0 4px 16px rgba(17, 31, 48, 0.12)`
- Hover: Slight scale transform `scale(1.02)`
- Cursor: `pointer`

#### Form Elements

**Input Fields**
- Background: `var(--color-bg-primary)`
- Border: `1px solid var(--color-border-medium)`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font Size: `16px` (prevents zoom on iOS)
- Focus: Border color changes to `var(--color-tertiary)`
- Focus: Box shadow `0 0 0 3px rgba(54, 99, 124, 0.1)`

**Labels**
- Font Weight: 500
- Color: `var(--color-text-primary)`
- Margin Bottom: `8px`

### Animation System

**Timing Functions**
- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)` - 250ms
- Decelerate: `cubic-bezier(0.0, 0.0, 0.2, 1)` - 200ms
- Accelerate: `cubic-bezier(0.4, 0.0, 1, 1)` - 150ms

**Animation Types**

1. **Micro-interactions**
   - Button hover/active states
   - Icon hover effects
   - Form field focus states
   - Loading spinners

2. **Transitions**
   - Page/view transitions
   - Modal open/close
   - Drawer slide in/out
   - Tab switching

3. **Feedback Animations**
   - Success confirmations
   - Error states
   - Loading states
   - Progress indicators

**Implementation Approach**
- CSS transitions for simple state changes
- CSS animations for loading states
- Framer Motion for complex page transitions
- Reduced motion support via `prefers-reduced-motion`

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      high: string;
      medium: string;
      low: string;
      critical: string;
    };
  };
  typography: {
    fontFamily: string;
    scale: Record<string, string>;
    weights: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}
```

### Component Props

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'small' | 'medium' | 'large';
  icon?: React.ComponentType;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

interface CardProps {
  interactive?: boolean;
  padding?: 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}
```

## Error Handling

### Visual Error States

1. **Form Validation Errors**
   - Red border on invalid fields
   - Error message below field in red text
   - Error icon next to field label

2. **Network Errors**
   - Toast notifications for temporary errors
   - Inline error messages for persistent issues
   - Retry buttons with loading states

3. **Empty States**
   - Illustrative icons
   - Helpful messaging
   - Clear call-to-action buttons

### Loading States

1. **Skeleton Loading**
   - Card-based skeleton screens
   - Shimmer animation effect
   - Maintains layout structure

2. **Spinner Loading**
   - Centered spinners for full-page loads
   - Inline spinners for button actions
   - Progress bars for file uploads

3. **Progressive Loading**
   - Content loads in priority order
   - Critical content first
   - Non-essential content deferred

## Testing Strategy

### Visual Regression Testing

1. **Component Testing**
   - Storybook for component isolation
   - Visual diff testing with Chromatic
   - Cross-browser compatibility testing

2. **Responsive Testing**
   - Mobile device testing (320px - 768px)
   - Tablet testing (768px - 1024px)
   - Desktop testing (1024px+)

3. **Accessibility Testing**
   - Color contrast validation
   - Keyboard navigation testing
   - Screen reader compatibility
   - Focus management testing

### Performance Testing

1. **Animation Performance**
   - 60fps animation validation
   - GPU acceleration verification
   - Reduced motion preference support

2. **Asset Optimization**
   - Icon bundle size optimization
   - Font loading performance
   - Image optimization and lazy loading

### User Testing

1. **Usability Testing**
   - Task completion rates
   - User satisfaction surveys
   - Navigation efficiency metrics

2. **A/B Testing**
   - Button placement optimization
   - Color scheme preferences
   - Animation preference testing

## Implementation Approach

### Phase 1: Design System Foundation
- Establish color system and CSS custom properties
- Implement typography system
- Create base component library
- Set up icon system

### Phase 2: Core Components
- Redesign navigation components
- Update button and form components
- Implement card and layout components
- Add animation system

### Phase 3: View-Specific Updates
- Redesign site gallery interface
- Update dashboard visualizations
- Enhance report generation UI
- Improve analytics displays

### Phase 4: Polish and Optimization
- Add micro-interactions
- Optimize animations
- Conduct accessibility audit
- Performance optimization

### Technical Considerations

1. **CSS Architecture**
   - CSS custom properties for theming
   - Utility classes for spacing and layout
   - Component-scoped styles
   - Mobile-first media queries

2. **React Implementation**
   - Styled-components or CSS modules
   - Framer Motion for animations
   - React Hook Form for form handling
   - Context API for theme management

3. **Performance Optimization**
   - Code splitting by route
   - Lazy loading for non-critical components
   - Image optimization and WebP support
   - Font display optimization