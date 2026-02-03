'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ArrowLeft, Download, Share2, FileImage, FileText } from 'lucide-react'
import { useBingo } from '@/lib/bingo-context'
import { BingoCard } from '@/components/bingo-card'

type PrintSize = 'a5' | 'a4' | 'a3' | 'a2'
type ExportFormat = 'pdf' | 'jpeg'

const printSizes = {
  a5: { name: 'A5 (5.8" × 8.3")', width: 1748, height: 2480 },
  a4: { name: 'A4 (8.3" × 11.7")', width: 2480, height: 3508 },
  a3: { name: 'A3 (11.7" × 16.5")', width: 3508, height: 4961 },
  a2: { name: 'A2 (16.5" × 23.4")', width: 4961, height: 7016 }
}

export default function ExportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cardData } = useBingo()
  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<PrintSize>('a4')
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const isSharing = searchParams.get('share') === 'true'

  useEffect(() => {
    // Redirect if no goals set
    if (cardData.goals.filter(g => g.trim()).length < 24) {
      router.push('/create')
    }
  }, [cardData.goals, router])

  const handleExport = async () => {
    if (!cardRef.current) return

    setIsExporting(true)
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      if (format === 'jpeg') {
        // Export as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const link = document.createElement('a')
        link.download = `resolution-bingo-${Date.now()}.jpg`
        link.href = dataUrl
        link.click()
      } else {
        // Export as PDF
        const { jsPDF } = await import('jspdf')
        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        
        // Get dimensions in mm for the selected size
        const sizeConfig = printSizes[size]
        const pdfWidth = size === 'a5' ? 148 : size === 'a4' ? 210 : size === 'a3' ? 297 : 420
        const pdfHeight = size === 'a5' ? 210 : size === 'a4' ? 297 : size === 'a3' ? 420 : 594
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        })

        // Calculate dimensions to fit page with margin
        const margin = 10
        const availableWidth = pdfWidth - (margin * 2)
        const availableHeight = pdfHeight - (margin * 2)
        
        const imgRatio = canvas.width / canvas.height
        const pageRatio = availableWidth / availableHeight
        
        let finalWidth = availableWidth
        let finalHeight = availableHeight
        
        if (imgRatio > pageRatio) {
          finalHeight = availableWidth / imgRatio
        } else {
          finalWidth = availableHeight * imgRatio
        }
        
        const x = (pdfWidth - finalWidth) / 2
        const y = (pdfHeight - finalHeight) / 2
        
        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight)
        pdf.save(`resolution-bingo-${Date.now()}.pdf`)
      }
    } catch (error) {
      console.error('[v0] Export error:', error)
      alert('Failed to export. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return

    setIsExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], 'resolution-bingo.jpg', { type: 'image/jpeg' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'My Resolution Bingo Card',
              text: 'Check out my New Year\'s Resolution Bingo Card!'
            })
          } catch (err) {
            console.log('[v0] Share cancelled or failed:', err)
          }
        } else {
          // Fallback: download the image
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
          const link = document.createElement('a')
          link.download = `resolution-bingo-share-${Date.now()}.jpg`
          link.href = dataUrl
          link.click()
        }
      }, 'image/jpeg', 0.95)
    } catch (error) {
      console.error('[v0] Share error:', error)
      alert('Failed to share. Please try again.')
    } finally {
      setIsExporting(false)
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              {isSharing ? 'Share Your Card' : 'Export & Download'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isSharing 
                ? 'Share your bingo card with friends and family'
                : 'Choose your format and size, then download'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Export Options - LEFT */}
            <div className="space-y-4">
              <Card className="p-6">
                {isSharing ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Share Options</h2>
                      <p className="text-sm text-muted-foreground">
                        Share your bingo card as an image
                      </p>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleShare}
                      disabled={isExporting}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {isExporting ? 'Generating...' : 'Share Card'}
                    </Button>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground text-center">
                        On mobile, you'll see native share options. On desktop, the image will be downloaded.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <div className="grid gap-3">
                        <button
                          type="button"
                          onClick={() => setFormat('pdf')}
                          className={`
                            p-4 rounded-lg border-2 transition-all text-left
                            ${format === 'pdf' ? 'border-primary bg-primary/5' : 'border-border'}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-semibold">PDF Document</div>
                              <div className="text-sm text-muted-foreground">
                                Best for printing, vector quality
                              </div>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormat('jpeg')}
                          className={`
                            p-4 rounded-lg border-2 transition-all text-left
                            ${format === 'jpeg' ? 'border-primary bg-primary/5' : 'border-border'}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <FileImage className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-semibold">JPEG Image</div>
                              <div className="text-sm text-muted-foreground">
                                Best for digital sharing, smaller file size
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Print Size</Label>
                      <Select value={size} onValueChange={(v) => setSize(v as PrintSize)}>
                        <SelectTrigger id="size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(printSizes).map(([key, { name }]) => (
                            <SelectItem key={key} value={key}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {format === 'pdf' 
                          ? 'PDF will be optimized for the selected paper size'
                          : 'JPEG will be high-resolution (300 DPI)'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {!isSharing && (
                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}
                  </Button>
                )}
              </Card>

              {/* Info Card */}
              <Card className="p-4 bg-accent/50">
                <h3 className="font-semibold text-sm mb-2">Export Tips</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• PDF format is best for printing</li>
                  <li>• JPEG is perfect for social media</li>
                  <li>• A4 is the most common print size</li>
                  <li>• All exports are 300 DPI (print quality)</li>
                </ul>
              </Card>
            </div>

            {/* Preview - RIGHT */}
            <div className="space-y-4">
              <Card className="p-6 bg-card">
                <div ref={cardRef} className="bg-white">
                  <BingoCard
                    goals={cardData.goals}
                    title={cardData.title}
                    theme={cardData.theme}
                    font={cardData.font}
                    backgroundImage={cardData.backgroundImage}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
