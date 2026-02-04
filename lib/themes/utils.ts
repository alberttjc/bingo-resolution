/**
 * Theme System Utilities
 * Helper functions for color conversion, CSS generation, and theme merging
 */

import type { ThemePreset, ThemeCustomization, ThemeCSSVariables, DeepPartial } from './types';

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert hex color to RGBA string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
}

/**
 * Get font family CSS value from font family type
 */
export function getFontFamily(family: string): string {
  const fontMap: Record<string, string> = {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    serif: 'ui-serif, Georgia, serif',
    mono: 'ui-monospace, monospace',
    montserrat: '"Montserrat", sans-serif',
    'geist-mono': '"Geist Mono", monospace',
    poppins: '"Poppins", sans-serif',
    playfair: '"Playfair Display", serif',
  };
  return fontMap[family] || fontMap.sans;
}

/**
 * Generate CSS box-shadow value for glow effect
 */
export function generateGlowShadow(color: string, intensity: number): string {
  const shadows: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const blur = intensity * i * 5;
    const spread = i === 1 ? 0 : intensity * (i - 1);
    shadows.push(`0 0 ${blur}px ${spread}px ${color}`);
  }
  return shadows.join(', ');
}

/**
 * Generate CSS gradient background
 */
export function generateGradient(
  start: string,
  end: string,
  mid?: string,
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial' = 'diagonal'
): string {
  if (direction === 'radial') {
    return mid
      ? `radial-gradient(circle, ${start}, ${mid}, ${end})`
      : `radial-gradient(circle, ${start}, ${end})`;
  }

  const directionMap = {
    horizontal: '90deg',
    vertical: '180deg',
    diagonal: '135deg',
  };

  const angle = directionMap[direction];
  return mid
    ? `linear-gradient(${angle}, ${start}, ${mid}, ${end})`
    : `linear-gradient(${angle}, ${start}, ${end})`;
}

/**
 * Convert theme preset to CSS variables
 */
export function themeToCSS(theme: ThemePreset): Partial<ThemeCSSVariables> {
  const { colors, effects, typography, layout } = theme;

  const vars: Partial<ThemeCSSVariables> = {
    // Card styles
    '--bingo-card-bg': colors.cardBackground,
    '--bingo-card-border': colors.cardBorder,
    '--bingo-card-padding': `${layout.cardPadding}rem`,
    '--bingo-card-radius': `${effects.borderRadius?.card ?? 12}px`,
    '--bingo-card-shadow': effects.shadows?.card ?? 'none',

    // Cell styles
    '--bingo-cell-bg': colors.cellBackground,
    '--bingo-cell-border': colors.cellBorder,
    '--bingo-cell-color': colors.cellText,
    '--bingo-cell-radius': `${effects.borderRadius?.cell ?? 8}px`,
    '--bingo-cell-gap': `${layout.cellGap}rem`,
    '--bingo-cell-shadow': effects.shadows?.cell ?? 'none',

    // Cell hover
    '--bingo-cell-hover-bg': colors.cellHoverBackground,
    '--bingo-cell-hover-border': colors.cellHoverBorder ?? colors.cellBorder,
    '--bingo-cell-hover-shadow': effects.shadows?.cellHover ?? effects.shadows?.cell ?? 'none',

    // Marked cells
    '--bingo-marked-bg': colors.markedBackground,
    '--bingo-marked-border': colors.markedBorder,
    '--bingo-marked-color': colors.markedText,

    // Free space
    '--bingo-free-bg': colors.freeBackground,
    '--bingo-free-border': colors.freeBorder,
    '--bingo-free-color': colors.freeText,

    // Header
    '--bingo-header-bg': colors.headerBackground ?? 'transparent',
    '--bingo-header-color': colors.headerText ?? colors.cellText,
    '--bingo-header-border': colors.headerBorder ?? colors.cellBorder,

    // Typography
    '--bingo-font-family': getFontFamily(typography.fontFamily),
    '--bingo-font-size': `${typography.cellFontSize}rem`,
    '--bingo-font-weight': typography.cellFontWeight.toString(),
    '--bingo-letter-spacing': `${typography.cellLetterSpacing ?? 0}em`,
    '--bingo-text-transform': typography.cellTextTransform ?? 'none',

    // Effects
    '--bingo-glow-color': effects.neonGlow?.color ?? colors.glowColor ?? colors.accentColor ?? 'transparent',
    '--bingo-glow-intensity': (effects.neonGlow?.intensity ?? 0).toString(),
    '--bingo-blur': `${effects.glassmorphism?.blur ?? 0}px`,
    '--bingo-glass-opacity': (effects.glassmorphism?.opacity ?? 1).toString(),

    // Gradients
    '--bingo-gradient-start': colors.gradientStart ?? colors.cardBackground,
    '--bingo-gradient-end': colors.gradientEnd ?? colors.cardBackground,
    '--bingo-gradient-mid': colors.gradientMid ?? '',
    '--bingo-gradient-duration': `${effects.gradientAnimation?.duration ?? 0}s`,

    // Pattern
    '--bingo-pattern-opacity': (effects.overlayPattern?.opacity ?? 0).toString(),
    '--bingo-pattern-color': effects.overlayPattern?.color ?? 'currentColor',
  };

  return vars;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = (source as any)[key];
      const targetValue = (output as any)[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        (output as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (output as any)[key] = sourceValue;
      }
    });
  }

  return output;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Apply customization overrides to theme preset
 */
export function applyCustomization(
  preset: ThemePreset,
  customization: ThemeCustomization
): ThemePreset {
  return deepMerge(preset, customization.overrides as any);
}

/**
 * Validate customization against allowed properties
 */
export function validateCustomization(
  preset: ThemePreset,
  customization: DeepPartial<ThemePreset>
): boolean {
  // Get all customizable paths from preset
  const allowedPaths = new Set(preset.customizable);

  // Extract paths from customization
  const customPaths = extractPaths(customization);

  // Check if all custom paths are allowed
  return customPaths.every((path) => {
    // Check exact match or parent path match
    return allowedPaths.has(path) || Array.from(allowedPaths).some((allowed) => path.startsWith(allowed));
  });
}

/**
 * Extract dot-notation paths from object
 */
function extractPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];

  Object.keys(obj).forEach((key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    if (isObject(obj[key])) {
      paths.push(...extractPaths(obj[key], path));
    }
  });

  return paths;
}

/**
 * Get value at dot-notation path
 */
export function getValueAtPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set value at dot-notation path
 */
export function setValueAtPath(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Generate CSS class name from theme ID
 */
export function getThemeClassName(themeId: string): string {
  return `theme-${themeId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

/**
 * Parse CSS color to check if it's transparent/has alpha
 */
export function hasAlpha(color: string): boolean {
  return color.includes('rgba') || color.includes('hsla') || color === 'transparent';
}

/**
 * Generate border style CSS
 */
export function getBorderStyle(
  style: string,
  width: number = 2,
  color: string = 'currentColor'
): string {
  const styleMap: Record<string, string> = {
    solid: `${width}px solid ${color}`,
    dashed: `${width}px dashed ${color}`,
    dotted: `${width}px dotted ${color}`,
    scalloped: `${width}px solid ${color}`, // Enhanced with CSS clip-path
    geometric: `${width}px solid ${color}`, // Enhanced with CSS clip-path
    'neon-glow': `${width}px solid ${color}`, // Enhanced with box-shadow
  };
  return styleMap[style] || styleMap.solid;
}
