'use client'

import React, { Suspense } from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Shuffle, Sparkles, Palette } from 'lucide-react'
import { templates, shuffleArray } from '@/lib/templates'
import { useBingo } from '@/lib/bingo-context'
import { BingoCard, themes } from '@/components/bingo-card'

function CreatePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cardData, updateGoals, updateTheme, updateFont, updateTitle, updateBackgroundImage, updateStep: saveStep } = useBingo()
  const [step, setStep] = useState(cardData.currentStep || 1)
  const [goals, setGoals] = useState<string[]>(cardData.goals)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // Sync with context on mount
  useEffect(() => {
    setGoals(cardData.goals)
  }, [cardData.goals])

  // Reset to step 1 when coming from home page
  useEffect(() => {
    const shouldReset = searchParams.get('reset') === 'true'
    if (shouldReset && step !== 1) {
      setStep(1)
      // Clean up URL parameter
      router.replace('/create', { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save step to context when it changes
  useEffect(() => {
    saveStep(step)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const goToNextStep = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && isComplete) {
      updateGoals(goals)
      router.push('/export')
    }
  }

  const goToPrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals]
    newGoals[index] = value
    setGoals(newGoals)
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      // Shuffle template goals and take first 24
      const shuffled = shuffleArray(template.goals).slice(0, 24)
      setGoals(shuffled)
      setSelectedTemplate(templateId)
    }
  }

  const handleClear = () => {
    setGoals(Array(24).fill(''))
    setSelectedTemplate('')
  }

  const filledGoals = goals.filter(g => g.trim()).length
  const isComplete = filledGoals === 24

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={goToPrevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-6">
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s ? 'bg-primary text-primary-foreground' : 
                    step > s ? 'bg-primary/20 text-primary' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {s}
                  </div>
                  {s < 2 && <div className="w-12 h-1 bg-muted" />}
                </div>
              ))}
            </div>

            {step === 2 && (
              <span className="text-sm font-semibold">
                {filledGoals}/24 goals
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              {step === 1 ? 'Select Your Style' : 'Enter Your Goals'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {step === 1 ? 'Customize your bingo card appearance' : 'Add 24 resolutions or choose a template'}
            </p>
          </div>

          {/* STEP 1: Style Selection - Side by Side */}
          {step === 1 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Choose Your Style</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Card Title</Label>
                  <Input
                    id="title"
                    value={cardData.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    placeholder="My 2026 Resolution Bingo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font">Font Style</Label>
                  <Select value={cardData.font} onValueChange={updateFont}>
                    <SelectTrigger id="font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans">Geist (Modern)</SelectItem>
                      <SelectItem value="montserrat">Montserrat (Clean)</SelectItem>
                      <SelectItem value="serif">Serif (Classic)</SelectItem>
                      <SelectItem value="mono">Monospace (Tech)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Background Image (Optional)</Label>
                  <Input
                    id="background"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {cardData.backgroundImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBackgroundImage(null)}
                      className="w-full"
                    >
                      Remove Background
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(themes).map(([key, theme]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => updateTheme(key)}
                        className={`
                          p-3 rounded-lg border-2 transition-all hover:scale-105
                          ${cardData.theme === key ? 'ring-2 ring-primary border-primary' : 'border-border'}
                          ${theme.card}
                        `}
                      >
                        <div className="text-xs font-bold capitalize mb-2">
                          {key === 'vintage' ? 'Vintage' : key === 'whimsical' ? 'Whimsical' : key === 'modern' ? 'Modern' : key === 'illustrated' ? 'Illustrated' : key}
                        </div>
                        <div className="flex gap-1">
                          <div className={`w-5 h-5 ${theme.cell.split(' ')[0]}`} />
                          <div className={`w-5 h-5 ${theme.freeSpace.split(' ')[0]}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Preview for Step 1 */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                See your style choices in real-time
              </p>
            </div>
            <BingoCard
              goals={goals}
              title={cardData.title}
              theme={cardData.theme}
              font={cardData.font}
              backgroundImage={cardData.backgroundImage}
              className="w-full"
            />
          </div>
          </div>
          )}

          {/* STEP 2: Goals and Templates */}
          {step === 2 && (
          <div className="space-y-8">
          {/* Template Selection - Full Width */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Choose a Template</h2>
                  <p className="text-sm text-muted-foreground">
                    Quick start with pre-made goals
                  </p>
                </div>
                {selectedTemplate && (
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {templates.map((template) => (
                  <Dialog key={template.id}>
                    <DialogTrigger asChild>
                      <Card 
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          <div className="pt-2">
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        <DialogDescription>{template.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {template.goals.map((goal, idx) => (
                            <div key={idx} className="text-sm p-2 rounded border bg-card">
                              {goal}
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            handleTemplateSelect(template.id)
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Use This Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </Card>

          {/* Goals and Preview - Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Goal Input Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your Goals</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter 24 resolutions for your bingo card
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setGoals(shuffleArray(goals))}
                  disabled={filledGoals < 2}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
              </div>

              {/* Grid Input Method */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`goal-${index}`} className="text-xs text-muted-foreground">
                      Goal {index + 1}
                    </Label>
                    <Input
                      id={`goal-${index}`}
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      placeholder="Enter a goal..."
                      maxLength={50}
                      className="h-20 text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Bulk Input Method */}
              <div className="pt-4 border-t">
                <details className="space-y-3">
                  <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                    Or paste goals as a list (one per line)
                  </summary>
                  <Textarea
                    placeholder="Read 12 books&#10;Exercise 3x/week&#10;Learn Spanish&#10;..."
                    className="min-h-[200px] font-mono text-sm"
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(line => line.trim())
                      const newGoals = [...goals]
                      lines.forEach((line, idx) => {
                        if (idx < 24) {
                          newGoals[idx] = line.trim().slice(0, 50)
                        }
                      })
                      setGoals(newGoals)
                    }}
                  />
                </details>
              </div>
            </div>
          </Card>

          {/* Preview for Step 2 */}
          <div className="sticky top-24">
            <BingoCard
              goals={goals}
              title={cardData.title}
              theme={cardData.theme}
              font={cardData.font}
              backgroundImage={cardData.backgroundImage}
              className="w-full"
            />
          </div>
          </div>
          </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button variant="outline" onClick={goToPrevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {step === 1 ? (
              <Button size="lg" onClick={goToNextStep}>
                Next: Add Goals
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={goToNextStep}
                disabled={!isComplete}
              >
                {isComplete ? 'Continue to Export' : `${24 - filledGoals} more goals needed`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  )
}
