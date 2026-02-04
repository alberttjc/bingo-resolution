/**
 * Theme Registry
 * Manages theme presets, customizations, and persistence
 */

import type { ThemePreset, ThemeCustomization, ThemeCategory, IThemeRegistry } from './types';
import { applyCustomization } from './utils';

const STORAGE_KEY = 'bingo-theme-customizations';

export class ThemeRegistry implements IThemeRegistry {
  private themes: Map<string, ThemePreset> = new Map();
  private customizations: Map<string, ThemeCustomization> = new Map();

  constructor() {
    this.loadCustomizations();
  }

  /**
   * Register a theme preset
   */
  registerTheme(theme: ThemePreset): void {
    this.themes.set(theme.id, theme);
  }

  /**
   * Register multiple themes at once
   */
  registerThemes(themes: ThemePreset[]): void {
    themes.forEach((theme) => this.registerTheme(theme));
  }

  /**
   * Get theme by ID
   */
  getTheme(id: string): ThemePreset | undefined {
    return this.themes.get(id);
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ThemePreset[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get themes by category
   */
  getThemesByCategory(category: ThemeCategory): ThemePreset[] {
    return this.getAllThemes().filter((theme) => theme.category === category);
  }

  /**
   * Get theme with customization applied
   */
  getCustomizedTheme(id: string): ThemePreset | undefined {
    const preset = this.getTheme(id);
    if (!preset) return undefined;

    const customization = this.customizations.get(id);
    if (!customization) return preset;

    return applyCustomization(preset, customization);
  }

  /**
   * Save customization for a theme
   */
  saveCustomization(customization: ThemeCustomization): void {
    customization.updatedAt = Date.now();
    if (!customization.createdAt) {
      customization.createdAt = customization.updatedAt;
    }

    this.customizations.set(customization.presetId, customization);
    this.persistCustomizations();
  }

  /**
   * Get customization for a theme
   */
  getCustomization(themeId: string): ThemeCustomization | undefined {
    return this.customizations.get(themeId);
  }

  /**
   * Delete customization for a theme
   */
  deleteCustomization(themeId: string): void {
    this.customizations.delete(themeId);
    this.persistCustomizations();
  }

  /**
   * Check if theme has customization
   */
  hasCustomization(themeId: string): boolean {
    return this.customizations.has(themeId);
  }

  /**
   * Apply customization and return merged theme
   */
  applyCustomization(themeId: string, customization: ThemeCustomization): ThemePreset {
    const preset = this.getTheme(themeId);
    if (!preset) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    return applyCustomization(preset, customization);
  }

  /**
   * Search themes by name or tags
   */
  searchThemes(query: string): ThemePreset[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllThemes().filter((theme) => {
      const nameMatch = theme.name.toLowerCase().includes(lowerQuery);
      const descMatch = theme.description.toLowerCase().includes(lowerQuery);
      const tagMatch = theme.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
      return nameMatch || descMatch || tagMatch;
    });
  }

  /**
   * Get themes sorted by category
   */
  getThemesByCategorySorted(): Record<ThemeCategory, ThemePreset[]> {
    return {
      basic: this.getThemesByCategory('basic'),
      gradient: this.getThemesByCategory('gradient'),
      extravagant: this.getThemesByCategory('extravagant'),
    };
  }

  /**
   * Load customizations from localStorage
   */
  private loadCustomizations(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([id, customization]) => {
          this.customizations.set(id, customization as ThemeCustomization);
        });
      }
    } catch (error) {
      console.error('Failed to load theme customizations:', error);
    }
  }

  /**
   * Persist customizations to localStorage
   */
  private persistCustomizations(): void {
    if (typeof window === 'undefined') return;

    try {
      const data: Record<string, ThemeCustomization> = {};
      this.customizations.forEach((customization, id) => {
        data[id] = customization;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save theme customizations:', error);
    }
  }

  /**
   * Export all customizations
   */
  exportCustomizations(): Record<string, ThemeCustomization> {
    const data: Record<string, ThemeCustomization> = {};
    this.customizations.forEach((customization, id) => {
      data[id] = customization;
    });
    return data;
  }

  /**
   * Import customizations
   */
  importCustomizations(data: Record<string, ThemeCustomization>): void {
    Object.entries(data).forEach(([id, customization]) => {
      this.customizations.set(id, customization);
    });
    this.persistCustomizations();
  }

  /**
   * Clear all customizations
   */
  clearCustomizations(): void {
    this.customizations.clear();
    this.persistCustomizations();
  }
}

// Singleton instance
let registryInstance: ThemeRegistry | null = null;

/**
 * Get global theme registry instance
 */
export function getThemeRegistry(): ThemeRegistry {
  if (!registryInstance) {
    registryInstance = new ThemeRegistry();
  }
  return registryInstance;
}

/**
 * Reset registry (useful for testing)
 */
export function resetThemeRegistry(): void {
  registryInstance = null;
}
