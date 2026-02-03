import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Grid3x3, Download, Share2 } from 'lucide-react'

export default function HomePage() {
  const exampleGoals = [
    'Read 12 books',
    'Exercise 3x/week',
    'Learn a new skill',
    'Save $5000',
    'Meditate daily',
    'Call family weekly',
    'Cook 2x/week',
    'Drink 8 glasses water',
    'Organize home',
    'Take a trip',
    'Learn Spanish',
    'Start a journal',
    'FREE SPACE',
    'Wake up at 6am',
    'No social media Sundays',
    'Volunteer monthly',
    'Try new restaurants',
    'Practice gratitude',
    'Limit screen time',
    'Take online course',
    'Network 1x/month',
    'Update resume',
    'Declutter closet',
    'Plant a garden',
    'Go to the gym'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-black text-xl uppercase tracking-tight">Resolution Bingo</span>
          </div>
          <Button asChild className="font-bold uppercase">
            <Link href="/create?reset=true">Create Card</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-balance uppercase">
              Turn Your New Year{' '}
              <span className="text-primary">
                Resolutions
              </span>{' '}
              Into a Game
            </h1>
            
            <p className="text-base md:text-lg max-w-4xl mx-auto text-pretty leading-relaxed flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span>Enter 24 goals</span>
              </span>
              <span className="hidden md:inline text-muted-foreground">→</span>
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span>Customize your style</span>
              </span>
              <span className="hidden md:inline text-muted-foreground">→</span>
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span>Download & share</span>
              </span>
            </p>

            <Button size="lg" className="text-lg px-10 py-6 font-bold uppercase tracking-wide" asChild>
              <Link href="/create?reset=true">
                Create Your Bingo Card
              </Link>
            </Button>
          </div>

          {/* Example Bingo Card */}
          <Card className="p-8 md:p-12 bg-card border-4 border-primary shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-primary">
                  BINGO
                </h2>
                <p className="text-lg md:text-xl font-bold uppercase tracking-wide">
                  What Will 2026 Have In Store For You?
                </p>
              </div>
              
              <div className="grid grid-cols-5 gap-3 md:gap-4">
                {exampleGoals.map((goal, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square flex items-center justify-center text-center p-3
                      ${index === 12 
                        ? 'bg-primary relative' 
                        : 'bg-card border-3 border-primary'}
                      transition-all hover:scale-105 cursor-pointer
                    `}
                  >
                    {index === 12 ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 fill-card">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="absolute text-xs font-black text-primary-foreground">free</span>
                      </div>
                    ) : (
                      <span className="text-xs md:text-sm font-semibold leading-tight text-primary">
                        {goal}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-primary mt-16 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-bold uppercase tracking-wide">
              © 2026 Resolution Bingo
            </p>
            <p className="text-xs text-muted-foreground">
              Make every goal count
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
