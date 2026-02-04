/**
 * Theme Helper Functions
 * Convenient access to the theme registry
 */

import { getThemeRegistry } from './registry';
import { allThemes } from './presets';
import type { ThemePreset } from './types';

// Initialize registry with all themes
let initialized = false;

export function initializeThemeRegistry() {
  if (initialized) return;

  const registry = getThemeRegistry();
  registry.registerThemes(allThemes);

  initialized = true;
}

/**
 * Get theme by ID
 */
export function getTheme(themeId: string): ThemePreset | undefined {
  initializeThemeRegistry();

  const registry = getThemeRegistry();
  return registry.getTheme(themeId);
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemePreset[] {
  initializeThemeRegistry();

  const registry = getThemeRegistry();
  return registry.getAllThemes();
}

/**
 * Check if theme exists
 */
export function hasTheme(themeId: string): boolean {
  initializeThemeRegistry();

  const registry = getThemeRegistry();
  return registry.getTheme(themeId) !== undefined;
}

/**
 * Get theme with fallback to default
 */
export function getThemeOrDefault(themeId?: string): ThemePreset {
  initializeThemeRegistry();

  const registry = getThemeRegistry();
  const theme = themeId ? registry.getTheme(themeId) : undefined;

  return theme || registry.getTheme('default')!;
}
