/**
 * Theme System Type Definitions
 * Comprehensive type system for extravagant theme presets with customization
 */

export type ThemeCategory = 'basic' | 'gradient' | 'extravagant';

export type BorderStyle = 'solid' | 'scalloped' | 'geometric' | 'neon-glow' | 'dashed' | 'dotted';

export type FontFamily = 'sans' | 'serif' | 'mono' | 'montserrat' | 'geist-mono' | 'poppins' | 'playfair';

export type PatternType = 'none' | 'dots' | 'grid' | 'circuit' | 'waves' | 'geometric';

/**
 * Color configuration for theme elements
 */
export interface ThemeColors {
  // Card container colors
  cardBackground: string;
  cardBorder: string;

  // Cell/square colors
  cellBackground: string;
  cellBorder: string;
  cellText: string;
  cellHoverBackground: string;
  cellHoverBorder?: string;

  // Marked/completed cell colors
  markedBackground: string;
  markedBorder: string;
  markedText: string;

  // Free space colors
  freeBackground: string;
  freeBorder: string;
  freeText: string;

  // Header colors (for themes with headers like vintage, modern)
  headerBackground?: string;
  headerText?: string;
  headerBorder?: string;

  // Glow and accent colors
  glowColor?: string;
  accentColor?: string;

  // Gradient colors (for animated gradients)
  gradientStart?: string;
  gradientEnd?: string;
  gradientMid?: string;
}

/**
 * Visual effects configuration
 */
export interface ThemeEffects {
  // Border styling
  borderStyle: BorderStyle;
  borderWidth?: number;

  // Glassmorphism effect
  glassmorphism?: {
    enabled: boolean;
    blur: number; // px
    opacity: number; // 0-1
    borderOpacity: number; // 0-1
  };

  // Neon glow effect
  neonGlow?: {
    enabled: boolean;
    color: string;
    intensity: number; // 1-10
    animated: boolean;
    pulseSpeed?: number; // seconds
  };

  // Shadow configuration
  shadows?: {
    card?: string; // CSS box-shadow value
    cell?: string;
    cellHover?: string;
  };

  // Gradient animation
  gradientAnimation?: {
    enabled: boolean;
    duration: number; // seconds
    direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  };

  // Overlay pattern
  overlayPattern?: {
    type: PatternType;
    opacity: number; // 0-1
    color?: string;
  };

  // Border radius
  borderRadius?: {
    card: number; // px
    cell: number; // px
  };

  // Decorative elements (SVG decorations)
  decorativeElements?: {
    enabled: boolean;
    elements: Array<{
      type: 'chrome-tube' | 'holographic-bubble' | 'glow-orb';
      position: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };
      size: number; // px
      rotation?: number; // degrees
      opacity?: number; // 0-1
      colors?: string[]; // Custom colors for gradients
    }>;
  };
}

/**
 * Typography configuration
 */
export interface ThemeTypography {
  fontFamily: FontFamily;

  // Cell text styling
  cellFontSize: number; // rem
  cellFontWeight: number; // 100-900
  cellTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  cellLetterSpacing?: number; // em
  cellLineHeight?: number;

  // Free space text styling
  freeFontSize?: number; // rem
  freeFontWeight?: number;
  freeTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Header text styling (for themes with headers)
  headerFontSize?: number; // rem
  headerFontWeight?: number;
  headerLetterSpacing?: number; // em
}

/**
 * Layout and spacing configuration
 */
export interface ThemeLayout {
  // Card padding
  cardPadding: number; // rem

  // Gap between cells
  cellGap: number; // rem

  // Show decorative header (vintage, modern, whimsical styles)
  showHeader: boolean;
  headerType?: 'vintage' | 'modern' | 'whimsical' | 'illustrated' | 'none';

  // Cell aspect ratio
  cellAspectRatio?: string; // e.g., '1/1', '4/3'

  // Decorative elements
  showCornerDecorations?: boolean;
  showBorderDecorations?: boolean;
}

/**
 * Complete theme preset definition
 */
export interface ThemePreset {
  // Metadata
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;

  // Theme configuration
  colors: ThemeColors;
  effects: ThemeEffects;
  typography: ThemeTypography;
  layout: ThemeLayout;

  // Customization
  customizable: string[]; // Dot-notation paths of customizable properties

  // Preview
  previewImage?: string; // Optional preview image URL
  tags?: string[]; // Searchable tags
}

/**
 * User customization overrides
 */
export interface ThemeCustomization {
  presetId: string;
  overrides: DeepPartial<Omit<ThemePreset, 'id' | 'category' | 'customizable'>>;
  customName?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Theme registry interface
 */
export interface IThemeRegistry {
  getTheme(id: string): ThemePreset | undefined;
  getAllThemes(): ThemePreset[];
  getThemesByCategory(category: ThemeCategory): ThemePreset[];
  registerTheme(theme: ThemePreset): void;
  applyCustomization(themeId: string, customization: ThemeCustomization): ThemePreset;
}

/**
 * CSS variable mapping for theme renderer
 */
export interface ThemeCSSVariables {
  '--bingo-card-bg': string;
  '--bingo-card-border': string;
  '--bingo-card-padding': string;
  '--bingo-card-radius': string;
  '--bingo-card-shadow': string;

  '--bingo-cell-bg': string;
  '--bingo-cell-border': string;
  '--bingo-cell-color': string;
  '--bingo-cell-radius': string;
  '--bingo-cell-gap': string;
  '--bingo-cell-shadow': string;

  '--bingo-cell-hover-bg': string;
  '--bingo-cell-hover-border': string;
  '--bingo-cell-hover-shadow': string;

  '--bingo-marked-bg': string;
  '--bingo-marked-border': string;
  '--bingo-marked-color': string;

  '--bingo-free-bg': string;
  '--bingo-free-border': string;
  '--bingo-free-color': string;

  '--bingo-header-bg': string;
  '--bingo-header-color': string;
  '--bingo-header-border': string;

  '--bingo-font-family': string;
  '--bingo-font-size': string;
  '--bingo-font-weight': string;
  '--bingo-letter-spacing': string;
  '--bingo-text-transform': string;

  '--bingo-glow-color': string;
  '--bingo-glow-intensity': string;
  '--bingo-blur': string;
  '--bingo-glass-opacity': string;

  '--bingo-gradient-start': string;
  '--bingo-gradient-end': string;
  '--bingo-gradient-mid': string;
  '--bingo-gradient-duration': string;

  '--bingo-pattern-opacity': string;
  '--bingo-pattern-color': string;
}
