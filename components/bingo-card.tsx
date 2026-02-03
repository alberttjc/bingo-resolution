'use client'

import { cn } from '@/lib/utils'

interface BingoCardProps {
  goals: string[]
  title?: string
  theme?: string
  font?: string
  backgroundImage?: string | null
  className?: string
  onCellClick?: (index: number) => void
  completedCells?: Set<number>
}

const themes = {
  default: {
    card: 'bg-gradient-to-br from-card to-accent/10',
    cell: 'bg-card border-2 border-border',
    freeSpace: 'bg-secondary text-secondary-foreground',
    title: 'text-foreground',
    hasScallop: false
  },
  vintage: {
    card: 'bg-[#E8DCC4]',
    cell: 'bg-[#E8DCC4] border-3 border-[#E63946]',
    freeSpace: 'bg-[#E63946] text-white relative',
    title: 'text-[#E63946] uppercase font-black tracking-tight',
    subtitle: 'text-[#E63946] uppercase font-bold tracking-wide',
    hasScallop: false
  },
  whimsical: {
    card: 'bg-white',
    cell: 'bg-white border-2 border-[#B4889F]',
    freeSpace: 'bg-[#F9A8D4] text-white',
    title: 'text-[#B4889F]',
    subtitle: 'text-[#F9A8D4] italic',
    hasScallop: true,
    borderColor: '#B4889F'
  },
  modern: {
    card: 'bg-white',
    cell: 'bg-white border border-gray-200',
    freeSpace: 'bg-[#FF6B6B] text-white',
    title: 'text-gray-900',
    subtitle: 'text-gray-600',
    hasScallop: false,
    showBingoLetters: true
  },
  illustrated: {
    card: 'bg-white',
    cell: 'bg-white border-2 border-gray-300',
    freeSpace: 'bg-white border-2 border-gray-300 relative',
    title: 'text-gray-900',
    subtitle: 'text-gray-700',
    hasScallop: true,
    borderColor: '#8B7355',
    showNumbers: true
  },
  sunset: {
    card: 'bg-gradient-to-br from-orange-50 to-pink-50',
    cell: 'bg-white border-2 border-orange-300',
    freeSpace: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
    title: 'text-orange-900',
    hasScallop: false
  },
  ocean: {
    card: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    cell: 'bg-white border-2 border-blue-300',
    freeSpace: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
    title: 'text-blue-900',
    hasScallop: false
  },
  forest: {
    card: 'bg-gradient-to-br from-green-50 to-emerald-50',
    cell: 'bg-white border-2 border-green-300',
    freeSpace: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
    title: 'text-green-900',
    hasScallop: false
  },
  midnight: {
    card: 'bg-gradient-to-br from-slate-800 to-slate-900',
    cell: 'bg-slate-700 border-2 border-slate-500 text-white',
    freeSpace: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
    title: 'text-white',
    hasScallop: false
  },
  pastel: {
    card: 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
    cell: 'bg-white border-2 border-purple-300',
    freeSpace: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
    title: 'text-purple-900',
    hasScallop: false
  }
}

const fontClasses = {
  sans: 'font-sans',
  montserrat: 'font-montserrat',
  serif: 'font-serif',
  mono: 'font-mono'
}

export function BingoCard({
  goals,
  title = 'My 2026 Resolution Bingo',
  theme = 'default',
  font = 'sans',
  backgroundImage = null,
  className,
  onCellClick,
  completedCells = new Set()
}: BingoCardProps) {
  const themeStyles = themes[theme as keyof typeof themes] || themes.default
  const fontClass = fontClasses[font as keyof typeof fontClasses] || fontClasses.sans

  // Insert FREE SPACE at center (index 12)
  const displayGoals = [...goals.slice(0, 12), 'FREE SPACE', ...goals.slice(12)]

  const isVintage = theme === 'vintage'
  const isWhimsical = theme === 'whimsical'
  const isModern = theme === 'modern'
  const isIllustrated = theme === 'illustrated'
  const hasScallop = themeStyles.hasScallop

  const scalloppedBorderSVG = (color: string) => `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="scallop-${color.replace('#', '')}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q 10 10, 20 20 T 40 20" stroke="${color}" fill="none" strokeWidth="2"/>
        </pattern>
      </defs>
    </svg>
  `

  return (
    <div 
      className={cn(
        'p-6 md:p-8 relative',
        isVintage ? '' : hasScallop ? 'rounded-3xl' : 'rounded-xl border-2',
        themeStyles.card,
        fontClass,
        className
      )}
      style={{
        ...(backgroundImage ? {
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}),
        ...(hasScallop && themeStyles.borderColor ? {
          border: `3px solid ${themeStyles.borderColor}`,
          boxShadow: `0 0 0 1px ${themeStyles.borderColor}, inset 0 0 0 1px ${themeStyles.borderColor}`
        } : {})
      }}
    >
      {/* Scalloped border decoration */}
      {hasScallop && themeStyles.borderColor && (
        <>
          <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden pointer-events-none">
            <svg width="100%" height="24" xmlns="http://www.w3.org/2000/svg" className="absolute top-0">
              <defs>
                <pattern id={`scallop-top-${theme}`} x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 24 Q 10 0, 20 24 T 40 24" stroke={themeStyles.borderColor} fill="none" strokeWidth="2.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="24" fill={`url(#scallop-top-${theme})`}/>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden pointer-events-none">
            <svg width="100%" height="24" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0">
              <defs>
                <pattern id={`scallop-bottom-${theme}`} x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 0 Q 10 24, 20 0 T 40 0" stroke={themeStyles.borderColor} fill="none" strokeWidth="2.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="24" fill={`url(#scallop-bottom-${theme})`}/>
            </svg>
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-6 overflow-hidden pointer-events-none">
            <svg width="24" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute left-0">
              <defs>
                <pattern id={`scallop-left-${theme}`} x="0" y="0" width="24" height="40" patternUnits="userSpaceOnUse">
                  <path d="M24 0 Q 0 10, 24 20 T 24 40" stroke={themeStyles.borderColor} fill="none" strokeWidth="2.5"/>
                </pattern>
              </defs>
              <rect width="24" height="100%" fill={`url(#scallop-left-${theme})`}/>
            </svg>
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-6 overflow-hidden pointer-events-none">
            <svg width="24" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute right-0">
              <defs>
                <pattern id={`scallop-right-${theme}`} x="0" y="0" width="24" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 0 Q 24 10, 0 20 T 0 40" stroke={themeStyles.borderColor} fill="none" strokeWidth="2.5"/>
                </pattern>
              </defs>
              <rect width="24" height="100%" fill={`url(#scallop-right-${theme})`}/>
            </svg>
          </div>
        </>
      )}

      <div className="space-y-4 md:space-y-6 relative z-10">
        {/* Title */}
        {isVintage ? (
          <div className="text-center space-y-2">
            <div className="border-t-4 border-b-4 border-[#E63946] py-2 mb-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase text-[#E63946]">
                BINGO
              </h2>
            </div>
            <p className="text-base md:text-xl font-bold uppercase tracking-wide text-[#E63946]">
              What Will 2026 Have In Store For You?
            </p>
          </div>
        ) : isWhimsical ? (
          <div className="text-center space-y-2">
            <p className={cn('text-lg md:text-xl italic', themeStyles.subtitle)}>
              Find the guest
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-[#F9A8D4]" style={{ fontFamily: 'cursive' }}>
              Bingo
            </h2>
            <p className="text-sm text-gray-700">
              {title}
            </p>
          </div>
        ) : isModern ? (
          <div className="text-center space-y-3">
            <p className="text-sm uppercase tracking-widest text-gray-500">PureWow</p>
            <h2 className={cn('text-3xl md:text-4xl font-serif', themeStyles.title)}>
              New Year's Resolution Bingo
            </h2>
            <div className="flex justify-center gap-8 text-xl font-bold tracking-widest">
              {'BINGO'.split('').map((letter, i) => (
                <span key={i}>{letter}</span>
              ))}
            </div>
          </div>
        ) : isIllustrated ? (
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'cursive' }}>
              Resolutions Bingo
            </h2>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>New Year's</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <h2 className={cn('text-2xl md:text-3xl font-bold', themeStyles.title)}>
              {title}
            </h2>
            <p className="text-sm opacity-70">
              Complete a row, column, or diagonal to win!
            </p>
          </div>
        )}

        {/* Bingo Grid */}
        <div className={cn('grid grid-cols-5', isVintage ? 'gap-3 md:gap-4' : 'gap-2 md:gap-3')}>
          {displayGoals.map((goal, index) => {
            const isFreeSpace = index === 12
            const isCompleted = completedCells.has(index)
            
            return (
              <button
                type="button"
                key={index}
                onClick={() => onCellClick?.(index)}
                className={cn(
                  'aspect-square flex items-center justify-center text-center p-2 relative',
                  'transition-all duration-200',
                  isVintage || isWhimsical ? '' : isModern ? 'rounded' : 'rounded-lg',
                  isFreeSpace ? themeStyles.freeSpace : themeStyles.cell,
                  onCellClick && 'hover:scale-105 cursor-pointer active:scale-95',
                  isCompleted && !isFreeSpace && 'opacity-50 line-through'
                )}
              >
                {themeStyles.showNumbers && (
                  <span className="absolute top-1 left-1 text-[8px] text-gray-400">
                    {index + 1}
                  </span>
                )}
                {isFreeSpace && isVintage ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 fill-[#E8DCC4]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="absolute text-xs font-black text-[#E8DCC4]">free</span>
                  </div>
                ) : isFreeSpace && (isWhimsical || isIllustrated) ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 fill-current opacity-20">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="absolute text-xs font-bold">FREE</span>
                  </div>
                ) : (
                  <span className={cn(
                    'leading-tight break-words',
                    isVintage 
                      ? 'text-xs md:text-sm font-semibold text-[#E63946]'
                      : isModern
                      ? 'text-[9px] md:text-xs font-normal text-gray-900'
                      : isWhimsical
                      ? 'text-[10px] md:text-xs font-medium text-gray-800'
                      : 'text-[10px] md:text-xs font-medium'
                  )}>
                    {goal || `Goal ${index + 1}`}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { themes }
