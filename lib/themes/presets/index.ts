/**
 * Theme Presets Index
 * Export all available theme presets
 */

import { basicThemes } from './basic';
import { extravagantThemes } from './extravagant';
import type { ThemePreset } from '../types';

// Export all themes
export const allThemes: ThemePreset[] = [
  ...basicThemes,
  ...extravagantThemes,
];

// Export by category
export { basicThemes } from './basic';
export { extravagantThemes } from './extravagant';

// Export individual themes for direct imports
export {
  defaultTheme,
  vintageTheme,
  whimsicalTheme,
  modernTheme,
  illustratedTheme,
  sunsetTheme,
  oceanTheme,
  forestTheme,
  midnightTheme,
  pastelTheme,
} from './basic';

export {
  spotifyWrappedTheme,
  tronLegacyTheme,
  cyberpunkTheme,
  artDecoTheme,
  vaporwaveTheme,
  holographicTheme,
} from './extravagant';

// Get theme by ID helper
export function getThemeById(id: string): ThemePreset | undefined {
  return allThemes.find((theme) => theme.id === id);
}

// Get themes by category helper
export function getThemesByCategory(category: string): ThemePreset[] {
  return allThemes.filter((theme) => theme.category === category);
}
