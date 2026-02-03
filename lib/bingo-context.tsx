'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { shuffleArray, templates } from './templates'

export interface BingoCardData {
  goals: string[]
  title: string
  theme: string
  font: string
  backgroundImage: string | null
  currentStep?: number
}

interface BingoContextType {
  cardData: BingoCardData
  updateGoals: (goals: string[]) => void
  updateTitle: (title: string) => void
  updateTheme: (theme: string) => void
  updateFont: (font: string) => void
  updateBackgroundImage: (image: string | null) => void
  updateStep: (step: number) => void
  shuffleGoals: () => void
  resetCard: () => void
}

const BingoContext = createContext<BingoContextType | undefined>(undefined)

// Get random goals from balanced template for default
const getRandomDefaultGoals = () => {
  const balancedTemplate = templates.find(t => t.id === 'balanced-mix')
  if (balancedTemplate) {
    return shuffleArray(balancedTemplate.goals).slice(0, 24)
  }
  return Array(24).fill('')
}

const DEFAULT_CARD_DATA: BingoCardData = {
  goals: getRandomDefaultGoals(),
  title: 'My 2026 Resolution Bingo',
  theme: 'vintage',
  font: 'sans',
  backgroundImage: null
}

export function BingoProvider({ children }: { children: ReactNode }) {
  const [cardData, setCardData] = useState<BingoCardData>(DEFAULT_CARD_DATA)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bingo-card-data')
    if (saved) {
      try {
        setCardData(JSON.parse(saved))
      } catch (e) {
        console.error('[v0] Failed to parse saved bingo data:', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('bingo-card-data', JSON.stringify(cardData))
  }, [cardData])

  const updateGoals = (goals: string[]) => {
    setCardData(prev => ({ ...prev, goals }))
  }

  const updateTitle = (title: string) => {
    setCardData(prev => ({ ...prev, title }))
  }

  const updateTheme = (theme: string) => {
    setCardData(prev => ({ ...prev, theme }))
  }

  const updateFont = (font: string) => {
    setCardData(prev => ({ ...prev, font }))
  }

  const updateBackgroundImage = (backgroundImage: string | null) => {
    setCardData(prev => ({ ...prev, backgroundImage }))
  }

  const updateStep = (step: number) => {
    setCardData(prev => ({ ...prev, currentStep: step }))
  }

  const shuffleGoals = () => {
    setCardData(prev => ({ ...prev, goals: shuffleArray(prev.goals) }))
  }

  const resetCard = () => {
    setCardData(DEFAULT_CARD_DATA)
    localStorage.removeItem('bingo-card-data')
  }

  return (
    <BingoContext.Provider
      value={{
        cardData,
        updateGoals,
        updateTitle,
        updateTheme,
        updateFont,
        updateBackgroundImage,
        updateStep,
        shuffleGoals,
        resetCard
      }}
    >
      {children}
    </BingoContext.Provider>
  )
}

export function useBingo() {
  const context = useContext(BingoContext)
  if (!context) {
    throw new Error('useBingo must be used within BingoProvider')
  }
  return context
}
