/**
 * Bingo Card Component
 * Uses new theme system with ThemeRenderer for extravagant visual effects
 */

'use client';

import { cn } from '@/lib/utils';
import { getThemeOrDefault } from '@/lib/themes/theme-helpers';
import { ThemeRenderer, getCardBackgroundStyle, getCellStyle, getHeaderStyle } from './theme-renderer';
import type { ThemePreset } from '@/lib/themes/types';

interface BingoCardProps {
  goals: string[];
  title?: string;
  theme?: string;
  font?: string;
  backgroundImage?: string | null;
  className?: string;
  onCellClick?: (index: number) => void;
  completedCells?: Set<number>;
}

export function BingoCard({
  goals,
  title = 'My 2026 Resolution Bingo',
  theme = 'default',
  font = 'sans',
  backgroundImage = null,
  className,
  onCellClick,
  completedCells = new Set(),
}: BingoCardProps) {
  // Get theme preset
  const themePreset = getThemeOrDefault(theme);

  // Insert FREE SPACE at center (index 12)
  const displayGoals = [...goals.slice(0, 12), 'FREE SPACE', ...goals.slice(12)];

  const { layout, typography, effects } = themePreset;

  return (
    <ThemeRenderer theme={themePreset} className={className}>
      <div
        className={cn('relative overflow-hidden')}
        style={{
          // Apply theme background only if no custom image
          ...(!backgroundImage ? getCardBackgroundStyle(themePreset) : {}),
          // Custom background image overrides theme background
          ...(backgroundImage
            ? {
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}),
          padding: `${layout.cardPadding}rem`,
          borderRadius: `${effects.borderRadius?.card || 12}px`,
          boxShadow: effects.shadows?.card,
        }}
      >
        <div className="space-y-4 md:space-y-6 relative z-10">
          {/* Header based on theme */}
          {layout.showHeader && layout.headerType === 'vintage' && (
            <VintageHeader title={title} themePreset={themePreset} />
          )}
          {layout.showHeader && layout.headerType === 'whimsical' && (
            <WhimsicalHeader title={title} themePreset={themePreset} />
          )}
          {layout.showHeader && layout.headerType === 'modern' && (
            <ModernHeader title={title} themePreset={themePreset} />
          )}
          {layout.showHeader && layout.headerType === 'illustrated' && (
            <IllustratedHeader title={title} themePreset={themePreset} />
          )}
          {!layout.showHeader && (
            <DefaultHeader title={title} themePreset={themePreset} />
          )}

          {/* Bingo Grid */}
          <div
            className="grid grid-cols-5"
            style={{
              gap: `${layout.cellGap}rem`,
            }}
          >
            {displayGoals.map((goal, index) => {
              const isFreeSpace = index === 12;
              const isCompleted = completedCells.has(index);

              return (
                <BingoCell
                  key={index}
                  goal={goal}
                  index={index}
                  isFreeSpace={isFreeSpace}
                  isCompleted={isCompleted}
                  themePreset={themePreset}
                  onClick={() => onCellClick?.(index)}
                  interactive={!!onCellClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </ThemeRenderer>
  );
}

// Header Components

function DefaultHeader({ title, themePreset }: { title: string; themePreset: ThemePreset }) {
  return (
    <div className="text-center space-y-1" style={getHeaderStyle(themePreset)}>
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <p className="text-sm opacity-70">Complete a row, column, or diagonal to win!</p>
    </div>
  );
}

function VintageHeader({ title, themePreset }: { title: string; themePreset: ThemePreset }) {
  const headerStyle = getHeaderStyle(themePreset);

  return (
    <div className="text-center space-y-2">
      <div
        className="py-2 mb-4"
        style={{
          borderTop: `4px solid ${themePreset.colors.headerBorder}`,
          borderBottom: `4px solid ${themePreset.colors.headerBorder}`,
        }}
      >
        <h2
          className="text-5xl md:text-7xl uppercase"
          style={{
            ...headerStyle,
            fontWeight: themePreset.typography.headerFontWeight || 900,
            letterSpacing: themePreset.typography.headerLetterSpacing
              ? `${themePreset.typography.headerLetterSpacing}em`
              : '-0.02em',
          }}
        >
          BINGO
        </h2>
      </div>
      <p className="text-md font-bold uppercase tracking-wide" style={{color: themePreset.colors.cellText}}>
        {title}
      </p>
    </div>
  );
}

function WhimsicalHeader({ title, themePreset }: { title: string; themePreset: ThemePreset }) {
  const headerStyle = getHeaderStyle(themePreset);

  return (
    <div className="text-center space-y-2">
      <p className="text-lg md:text-xl italic opacity-80" style={headerStyle}>
        Find the guest
      </p>
      <h2
        className="text-5xl md:text-7xl font-black"
        style={{ ...headerStyle, fontFamily: 'cursive' }}
      >
        Bingo
      </h2>
      <p className="text-sm" style={{ color: themePreset.colors.cellText }}>
        {title}
      </p>
    </div>
  );
}

function ModernHeader({ title, themePreset }: { title: string; themePreset: ThemePreset }) {
  const headerStyle = getHeaderStyle(themePreset);

  return (
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-widest opacity-60" style={headerStyle}>
        PureWow
      </p>
      <h2 className="text-3xl md:text-4xl" style={headerStyle}>
        {title}
      </h2>
      <div className="flex justify-center gap-8 text-xl font-bold tracking-widest" style={headerStyle}>
        {'BINGO'.split('').map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </div>
    </div>
  );
}

function IllustratedHeader({ title, themePreset }: { title: string; themePreset: ThemePreset }) {
  const headerStyle = getHeaderStyle(themePreset);

  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl md:text-5xl font-bold" style={{ ...headerStyle, fontFamily: 'cursive' }}>
        {title}
      </h2>
      <div className="flex justify-center gap-4 text-sm opacity-60" style={headerStyle}>
        <span>New Year's</span>
      </div>
    </div>
  );
}

// Cell Component

interface BingoCellProps {
  goal: string;
  index: number;
  isFreeSpace: boolean;
  isCompleted: boolean;
  themePreset: ThemePreset;
  onClick: () => void;
  interactive: boolean;
}

function BingoCell({
  goal,
  index,
  isFreeSpace,
  isCompleted,
  themePreset,
  onClick,
  interactive,
}: BingoCellProps) {
  const cellStyle = getCellStyle(themePreset, isFreeSpace, isCompleted, false);

  // Show numbers for illustrated theme
  const showNumbers = themePreset.layout.headerType === 'illustrated';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'aspect-square flex items-center justify-center text-center p-2 relative',
        'transition-all duration-200',
        interactive && 'hover:scale-105 cursor-pointer active:scale-95',
        isCompleted && !isFreeSpace && 'opacity-50 line-through'
      )}
      style={cellStyle}
    >
      {showNumbers && (
        <span
          className="absolute top-1 left-1 text-[8px]"
          style={{ opacity: 0.4 }}
        >
          {index + 1}
        </span>
      )}

      {isFreeSpace ? (
        <FreeSpaceContent themePreset={themePreset} />
      ) : (
        <span className="leading-tight break-words">
          {goal || `Goal ${index + 1}`}
        </span>
      )}
    </button>
  );
}

function FreeSpaceContent({ themePreset }: { themePreset: ThemePreset }) {
  const isVintage = themePreset.layout.headerType === 'vintage';
  const isWhimsical = themePreset.layout.headerType === 'whimsical';
  const isIllustrated = themePreset.layout.headerType === 'illustrated';

  if (isVintage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16" fill={themePreset.colors.cellBackground}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="absolute text-xs font-black" style={{ color: themePreset.colors.cellBackground }}>
          free
        </span>
      </div>
    );
  }

  if (isWhimsical || isIllustrated) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 fill-current opacity-20">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="absolute text-xs font-bold">FREE</span>
      </div>
    );
  }

  return <span className="text-xs font-bold">FREE SPACE</span>;
}
