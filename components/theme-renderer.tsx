/**
 * Theme Renderer Component
 * Converts ThemePreset configuration to CSS variables and applies effects
 */

'use client';

import { useMemo } from 'react';
import type { ThemePreset } from '@/lib/themes/types';
import { themeToCSS, getThemeClassName } from '@/lib/themes/utils';
import { GeometricPattern } from './effects/geometric-pattern';
import { DecorativeElements } from './effects/decorative-elements';

interface ThemeRendererProps {
  theme: ThemePreset;
  children: React.ReactNode;
  className?: string;
}

export function ThemeRenderer({ theme, children, className }: ThemeRendererProps) {
  // Convert theme to CSS variables
  const cssVariables = useMemo(() => themeToCSS(theme), [theme]);

  // Build class names for effects
  const effectClasses = useMemo(() => {
    const classes: string[] = [];

    // Glassmorphism
    if (theme.effects.glassmorphism?.enabled) {
      classes.push('bingo-glass');
    }

    // Neon glow
    if (theme.effects.neonGlow?.enabled) {
      classes.push('bingo-neon-glow');
      if (theme.effects.neonGlow.animated) {
        classes.push('bingo-neon-pulse');
      }
    }

    // Gradient animation
    if (theme.effects.gradientAnimation?.enabled) {
      classes.push('bingo-gradient-animated');
    }

    // Border styles
    if (theme.effects.borderStyle === 'scalloped') {
      classes.push('bingo-border-scalloped');
    } else if (theme.effects.borderStyle === 'geometric') {
      classes.push('bingo-border-geometric');
    }

    return classes;
  }, [theme]);

  // Check if overlay pattern is enabled
  const hasPattern = theme.effects.overlayPattern && theme.effects.overlayPattern.type !== 'none';

  // Check if decorative elements are enabled
  const hasDecorations = theme.effects.decorativeElements?.enabled;

  return (
    <div
      data-bingo-theme={theme.id}
      className={`${getThemeClassName(theme.id)} ${effectClasses.join(' ')} ${className || ''}`}
      style={cssVariables as React.CSSProperties}
    >
      {/* Decorative elements (behind everything) */}
      {hasDecorations && <DecorativeElements config={theme.effects.decorativeElements} />}

      {/* Overlay pattern if enabled */}
      {hasPattern && (
        <GeometricPattern
          type={theme.effects.overlayPattern!.type}
          opacity={theme.effects.overlayPattern!.opacity}
          color={theme.effects.overlayPattern!.color}
        />
      )}

      {children}
    </div>
  );
}

/**
 * Hook to get theme-specific CSS variables for inline styles
 */
export function useThemeStyles(theme: ThemePreset) {
  return useMemo(() => themeToCSS(theme), [theme]);
}

/**
 * Get background style for card based on theme
 */
export function getCardBackgroundStyle(theme: ThemePreset): React.CSSProperties {
  const { colors, effects } = theme;

  const style: React.CSSProperties = {};

  // Handle gradient backgrounds - use backgroundImage instead of background
  if (colors.cardBackground.includes('linear-gradient') || colors.cardBackground.includes('radial-gradient')) {
    style.backgroundImage = colors.cardBackground;
  } else {
    style.backgroundColor = colors.cardBackground;
  }

  // Add animation if enabled
  if (effects.gradientAnimation?.enabled) {
    style.backgroundSize = '200% 200%';
  }

  return style;
}

/**
 * Get cell style based on theme and state
 */
export function getCellStyle(
  theme: ThemePreset,
  isFreeSpace: boolean,
  isMarked: boolean,
  isHovered: boolean
): React.CSSProperties {
  const { colors, effects, typography } = theme;

  const style: React.CSSProperties = {
    fontFamily: `var(--bingo-font-family)`,
    fontSize: isFreeSpace && typography.freeFontSize
      ? `${typography.freeFontSize}rem`
      : `${typography.cellFontSize}rem`,
    fontWeight: isFreeSpace && typography.freeFontWeight
      ? typography.freeFontWeight
      : typography.cellFontWeight,
    textTransform: typography.cellTextTransform || 'none',
    letterSpacing: typography.cellLetterSpacing ? `${typography.cellLetterSpacing}em` : '0',
  };

  // Background and text colors
  if (isFreeSpace) {
    if (colors.freeBackground.includes('gradient')) {
      style.backgroundImage = colors.freeBackground;
    } else {
      style.backgroundColor = colors.freeBackground;
    }
    style.color = colors.freeText;
    style.borderColor = colors.freeBorder;
  } else if (isMarked) {
    style.backgroundColor = colors.markedBackground;
    style.color = colors.markedText;
    style.borderColor = colors.markedBorder;
  } else if (isHovered) {
    style.backgroundColor = colors.cellHoverBackground;
    style.color = colors.cellText;
    style.borderColor = colors.cellHoverBorder || colors.cellBorder;
  } else {
    style.backgroundColor = colors.cellBackground;
    style.color = colors.cellText;
    style.borderColor = colors.cellBorder;
  }

  // Border
  style.borderWidth = `${effects.borderWidth || 2}px`;
  style.borderStyle = 'solid';
  style.borderRadius = `${effects.borderRadius?.cell || 8}px`;

  // Shadows
  if (isHovered && effects.shadows?.cellHover) {
    style.boxShadow = effects.shadows.cellHover;
  } else if (effects.shadows?.cell) {
    style.boxShadow = effects.shadows.cell;
  }

  return style;
}

/**
 * Get header style based on theme
 */
export function getHeaderStyle(theme: ThemePreset): React.CSSProperties {
  const { colors, typography } = theme;

  return {
    backgroundColor: colors.headerBackground || 'transparent',
    color: colors.headerText || colors.cellText,
    borderColor: colors.headerBorder || colors.cellBorder,
    fontFamily: `var(--bingo-font-family)`,
    fontSize: typography.headerFontSize ? `${typography.headerFontSize}rem` : '2rem',
    fontWeight: typography.headerFontWeight || 700,
    letterSpacing: typography.headerLetterSpacing ? `${typography.headerLetterSpacing}em` : '0',
  };
}
