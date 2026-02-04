/**
 * Decorative Elements Component
 * Renders SVG decorations like chrome tubes and holographic bubbles
 */

'use client';

import type { ThemeEffects } from '@/lib/themes/types';

interface DecorativeElementsProps {
  config: ThemeEffects['decorativeElements'];
}

export function DecorativeElements({ config }: DecorativeElementsProps) {
  if (!config?.enabled || !config.elements?.length) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {config.elements.map((element, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: element.position.top,
            bottom: element.position.bottom,
            left: element.position.left,
            right: element.position.right,
            width: `${element.size}px`,
            height: `${element.size}px`,
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            opacity: element.opacity ?? 1,
          }}
        >
          {element.type === 'chrome-tube' && <ChromeTube size={element.size} colors={element.colors} />}
          {element.type === 'holographic-bubble' && <HolographicBubble size={element.size} colors={element.colors} />}
          {element.type === 'glow-orb' && <GlowOrb size={element.size} colors={element.colors} />}
        </div>
      ))}
    </div>
  );
}

// Chrome Tube SVG - Metallic 3D tube with highlights
function ChromeTube({ size, colors }: { size: number; colors?: string[] }) {
  const [dark, mid, light] = colors || ['#2a2a2a', '#b8b8b8', '#ffffff'];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        {/* Metallic gradient */}
        <linearGradient id={`chrome-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dark} />
          <stop offset="30%" stopColor={mid} />
          <stop offset="50%" stopColor={light} />
          <stop offset="70%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>

        {/* Inner shadow gradient */}
        <linearGradient id={`chrome-inner-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
          <stop offset="20%" stopColor="#000000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        {/* Highlight gradient */}
        <linearGradient id={`chrome-highlight-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="45%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.8" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`chrome-glow-${size}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main tube body - curved path */}
      <path
        d="M 40 20 Q 60 40, 80 70 T 120 140 L 130 150 Q 135 155, 140 150 L 150 140 Q 125 100, 100 60 T 50 10 Q 45 5, 40 10 Z"
        fill={`url(#chrome-grad-${size})`}
        filter={`url(#chrome-glow-${size})`}
      />

      {/* Inner shadow for depth */}
      <path
        d="M 40 20 Q 60 40, 80 70 T 120 140 L 130 150 Q 135 155, 140 150 L 150 140 Q 125 100, 100 60 T 50 10 Q 45 5, 40 10 Z"
        fill={`url(#chrome-inner-${size})`}
      />

      {/* Highlight streak */}
      <path
        d="M 50 15 Q 65 35, 85 65 T 125 135"
        stroke={`url(#chrome-highlight-${size})`}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Holographic Bubble SVG - Iridescent rainbow bubble
function HolographicBubble({ size, colors }: { size: number; colors?: string[] }) {
  const [color1, color2, color3, color4, color5] = colors || [
    '#FF00FF', // Magenta
    '#FF1493', // Deep pink
    '#00FFFF', // Cyan
    '#1DB954', // Green
    '#FF69B4', // Hot pink
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        {/* Radial iridescent gradient */}
        <radialGradient id={`holo-grad-${size}`}>
          <stop offset="0%" stopColor={color1} stopOpacity="0.3" />
          <stop offset="25%" stopColor={color2} stopOpacity="0.4" />
          <stop offset="50%" stopColor={color3} stopOpacity="0.5" />
          <stop offset="75%" stopColor={color4} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color5} stopOpacity="0.2" />
        </radialGradient>

        {/* Rainbow edge gradient */}
        <linearGradient id={`holo-edge-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="25%" stopColor={color2} />
          <stop offset="50%" stopColor={color3} />
          <stop offset="75%" stopColor={color4} />
          <stop offset="100%" stopColor={color5} />
        </linearGradient>

        {/* Blur filter for glow */}
        <filter id={`holo-blur-${size}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill={`url(#holo-grad-${size})`}
        filter={`url(#holo-blur-${size})`}
        opacity="0.6"
      />

      {/* Main bubble with rainbow edge */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill={`url(#holo-grad-${size})`}
        stroke={`url(#holo-edge-${size})`}
        strokeWidth="3"
        opacity="0.8"
      />

      {/* Highlight */}
      <ellipse
        cx="80"
        cy="70"
        rx="25"
        ry="35"
        fill="white"
        opacity="0.4"
      />

      {/* Secondary highlight */}
      <ellipse
        cx="130"
        cy="130"
        rx="15"
        ry="20"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
}

// Glow Orb SVG - Soft glowing sphere
function GlowOrb({ size, colors }: { size: number; colors?: string[] }) {
  const [inner, outer] = colors || ['#FF1493', '#FF69B4'];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <radialGradient id={`orb-grad-${size}`}>
          <stop offset="0%" stopColor={inner} stopOpacity="0.8" />
          <stop offset="50%" stopColor={outer} stopOpacity="0.4" />
          <stop offset="100%" stopColor={outer} stopOpacity="0" />
        </radialGradient>

        <filter id={`orb-glow-${size}`}>
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="90"
        fill={`url(#orb-grad-${size})`}
        filter={`url(#orb-glow-${size})`}
      />
    </svg>
  );
}
