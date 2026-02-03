'use client'

import React from "react"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Shuffle, Download, Share2, Palette, Type, ImageIcon } from 'lucide-react'
import { useBingo } from '@/lib/bingo-context'
import { BingoCard, themes } from '@/components/bingo-card'

export default function PreviewPage() {
  const router = useRouter()
  const { cardData, updateTitle, updateTheme, updateFont, updateBackgroundImage, shuffleGoals } = useBingo()
  const [completedCells, setCompletedCells] = useState<Set<number>>(new Set([12])) // FREE SPACE is always completed

  useEffect(() => {
    // Redirect if no goals set
    if (cardData.goals.filter(g => g.trim()).length < 24) {
      router.push('/create')
    }
  }, [cardData.goals, router])

  const handleCellClick = (index: number) => {
    setCompletedCells(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/create')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Goals
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={shuffleGoals}>
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button asChild>
              <Link href="/export">Export</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Preview & Customize</h1>
            <p className="text-muted-foreground text-lg">
              Click cells to mark them complete and see your progress
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Preview */}
            <div className="space-y-4">
              <BingoCard
                goals={cardData.goals}
                title={cardData.title}
                theme={cardData.theme}
                font={cardData.font}
                backgroundImage={cardData.backgroundImage}
                onCellClick={handleCellClick}
                completedCells={completedCells}
                className="w-full"
              />

              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/export">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/export?share=true">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Link>
                </Button>
              </div>
            </div>

            {/* Customization Panel */}
            <div className="space-y-4">
              <Card className="p-6">
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">
                      <Type className="w-4 h-4 mr-2" />
                      Basic
                    </TabsTrigger>
                    <TabsTrigger value="theme">
                      <Palette className="w-4 h-4 mr-2" />
                      Theme
                    </TabsTrigger>
                    <TabsTrigger value="image">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
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
                          <SelectItem value="sans">Sans Serif (Modern)</SelectItem>
                          <SelectItem value="serif">Serif (Classic)</SelectItem>
                          <SelectItem value="mono">Monospace (Tech)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="theme" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(themes).map(([key, theme]) => (
                          <button
                            type="button"
                            key={key}
                            onClick={() => updateTheme(key)}
                            className={`
                              p-4 rounded-lg border-2 transition-all hover:scale-105
                              ${cardData.theme === key ? 'ring-2 ring-primary border-primary' : 'border-border'}
                              ${theme.card}
                            `}
                          >
                            <div className="text-xs font-bold capitalize mb-2">
                              {key === 'vintage' ? '🎯 Vintage (Classic)' : key}
                            </div>
                            <div className="flex gap-1">
                              <div className={`w-6 h-6 ${theme.cell.split(' ')[0]}`} />
                              <div className={`w-6 h-6 ${theme.freeSpace.split(' ')[0]}`} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background">Background Image</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a background image for your bingo card
                      </p>
                      <Input
                        id="background"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
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
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Tips Card */}
              <Card className="p-4 bg-accent/50">
                <h3 className="font-semibold text-sm mb-2">Pro Tips</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Click cells to mark goals as complete</li>
                  <li>• Use shuffle to randomize goal positions</li>
                  <li>• Try different themes to match your style</li>
                  <li>• Add a background image for personalization</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
