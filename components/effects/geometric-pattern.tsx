/**
 * Geometric Pattern Effect Component
 * Creates overlay patterns (dots, grid, circuit, waves, geometric)
 */

import { cn } from '@/lib/utils';
import type { PatternType } from '@/lib/themes/types';

interface GeometricPatternProps {
  type: PatternType;
  opacity?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function GeometricPattern({
  type,
  opacity = 0.1,
  color = 'currentColor',
  className,
  style,
}: GeometricPatternProps) {
  if (type === 'none') return null;

  const patternClass = `bingo-pattern-${type}`;

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        patternClass,
        className
      )}
      style={{
        '--bingo-pattern-opacity': opacity.toString(),
        '--bingo-pattern-color': color,
        ...style,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
