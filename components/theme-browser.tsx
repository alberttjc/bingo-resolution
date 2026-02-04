/**
 * Theme Browser Component
 * Categorized theme selection with preview cards
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getAllThemes } from '@/lib/themes/theme-helpers';
import type { ThemePreset, ThemeCategory } from '@/lib/themes/types';

interface ThemeBrowserProps {
  currentTheme: string;
  onThemeSelect: (themeId: string) => void;
  className?: string;
}

export function ThemeBrowser({ currentTheme, onThemeSelect, className }: ThemeBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const allThemes = getAllThemes();

  // Group themes by category
  const themesByCategory: Record<ThemeCategory, ThemePreset[]> = {
    basic: allThemes.filter((t) => t.category === 'basic'),
    gradient: allThemes.filter((t) => t.category === 'gradient'),
    extravagant: allThemes.filter((t) => t.category === 'extravagant'),
  };

  // Get filtered themes
  const displayThemes = selectedCategory === 'all'
    ? allThemes
    : themesByCategory[selectedCategory] || [];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <CategoryTab
          label="All Themes"
          count={allThemes.length}
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        />
        <CategoryTab
          label="Basic"
          count={themesByCategory.basic.length}
          active={selectedCategory === 'basic'}
          onClick={() => setSelectedCategory('basic')}
        />
        <CategoryTab
          label="Gradient"
          count={themesByCategory.gradient.length}
          active={selectedCategory === 'gradient'}
          onClick={() => setSelectedCategory('gradient')}
        />
        <CategoryTab
          label="Extravagant"
          count={themesByCategory.extravagant.length}
          active={selectedCategory === 'extravagant'}
          onClick={() => setSelectedCategory('extravagant')}
          highlight
        />
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={theme.id === currentTheme}
            onClick={() => onThemeSelect(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}

function CategoryTab({ label, count, active, onClick, highlight }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? highlight
            ? 'bg-purple-600 text-white'
            : 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )}
    >
      {label} <span className="opacity-70">({count})</span>
    </button>
  );
}

interface ThemeCardProps {
  theme: ThemePreset;
  isSelected: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isSelected, onClick }: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 overflow-hidden transition-all group',
        'hover:scale-105 hover:shadow-lg',
        isSelected
          ? 'border-primary ring-2 ring-primary ring-offset-2'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* Preview */}
      <ThemePreview theme={theme} />

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-sm font-semibold text-white">{theme.name}</p>
        <p className="text-xs text-white/70 line-clamp-1">{theme.description}</p>
      </div>

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          Selected
        </div>
      )}

      {/* Category Badge */}
      {theme.category === 'extravagant' && (
        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
          New
        </div>
      )}
    </button>
  );
}

function ThemePreview({ theme }: { theme: ThemePreset }) {
  // Generate a mini preview of the theme
  const cardBg = theme.colors.cardBackground;
  const cellBg = theme.colors.cellBackground;
  const cellBorder = theme.colors.cellBorder;
  const freeBg = theme.colors.freeBackground;

  return (
    <div
      className="aspect-square p-2 relative"
      style={{
        backgroundImage: cardBg.includes('gradient') ? cardBg : undefined,
        backgroundColor: !cardBg.includes('gradient') ? cardBg : undefined,
      }}
    >
      {/* Mini 3x3 grid preview */}
      <div className="grid grid-cols-3 gap-1 h-full">
        {Array.from({ length: 9 }).map((_, i) => {
          const isFree = i === 4; // Center cell
          return (
            <div
              key={i}
              className="rounded"
              style={{
                backgroundImage: isFree
                  ? freeBg.includes('gradient')
                    ? freeBg
                    : undefined
                  : cellBg.includes?.('gradient')
                  ? cellBg
                  : undefined,
                backgroundColor: isFree
                  ? !freeBg.includes('gradient')
                    ? freeBg
                    : undefined
                  : !cellBg.includes?.('gradient')
                  ? cellBg
                  : undefined,
                border: `1px solid ${isFree ? theme.colors.freeBorder : cellBorder}`,
              }}
            />
          );
        })}
      </div>

      {/* Effect indicators */}
      {theme.effects.glassmorphism?.enabled && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400" title="Glassmorphism" />
      )}
      {theme.effects.neonGlow?.enabled && (
        <div className="absolute top-1 right-4 w-2 h-2 rounded-full bg-cyan-400" title="Neon Glow" />
      )}
      {theme.effects.gradientAnimation?.enabled && (
        <div className="absolute top-1 right-7 w-2 h-2 rounded-full bg-purple-400" title="Animated" />
      )}
    </div>
  );
}
