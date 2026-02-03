'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<PrintSize>('a4')
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState('')
  const isSharing = searchParams.get('share') === 'true'

  // Track created resources for cleanup
  const cleanupRefs = useRef<{
    blobUrls: string[]
    downloadLinks: HTMLAnchorElement[]
  }>({
    blobUrls: [],
    downloadLinks: []
  })

  useEffect(() => {
    // Redirect if no goals set
    if (cardData.goals.filter(g => g.trim()).length < 24) {
      router.push('/create')
    }
  }, [cardData.goals, router])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupResources()
    }
  }, [])

  const cleanupResources = () => {
    // Revoke all blob URLs
    cleanupRefs.current.blobUrls.forEach(url => {
      URL.revokeObjectURL(url)
    })
    cleanupRefs.current.blobUrls = []

    // Remove all download links from DOM
    cleanupRefs.current.downloadLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    })
    cleanupRefs.current.downloadLinks = []
  }

  const getErrorMessage = (errorType: string) => {
    const messages: Record<string, { title: string; description: string }> = {
      'ref-missing': {
        title: 'Card Not Ready',
        description: 'Please wait a moment and try again.'
      },
      'rendering-failed': {
        title: 'Export Failed',
        description: 'Could not export the card. Try a smaller paper size or simpler theme.'
      },
      'size-exceeded': {
        title: 'File Too Large',
        description: 'Try a smaller paper size (A5 or A4).'
      },
      'share-failed': {
        title: 'Share Not Available',
        description: 'Your device does not support sharing. Downloading instead.'
      },
      'unknown': {
        title: 'Export Failed',
        description: 'Please try again with a smaller paper size.'
      }
    }
    return messages[errorType] || messages['unknown']
  }

  // Helper: Check if error is retryable
  function isRetryableError(error: Error): boolean {
    const errorMsg = error.message.toLowerCase()
    return errorMsg.includes('size') ||
           errorMsg.includes('memory') ||
           errorMsg.includes('too large') ||
           errorMsg.includes('timeout') ||
           errorMsg.includes('blob')
  }

  // Helper: Render card to canvas
  async function renderCardToCanvas(
    element: HTMLDivElement,
    scale: number,
    onProgress: (message: string) => void
  ): Promise<HTMLCanvasElement> {
    const { toPng } = await import('html-to-image')

    onProgress('Rendering card...')

    // Wait for fonts to load before capturing
    await document.fonts.ready

    // Create timeout promise
    const renderTimeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Rendering timeout')), 20000)
    })

    // Convert DOM to PNG data URL
    const dataUrl = await Promise.race([
      toPng(element, {
        pixelRatio: scale,
        backgroundColor: '#ffffff',
        cacheBust: true
      }),
      renderTimeoutPromise
    ])

    // Convert data URL to canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        resolve()
      }
      img.onerror = reject
      img.src = dataUrl
    })

    return canvas
  }

  // Helper: Convert canvas to blob
  async function canvasToBlob(
    canvas: HTMLCanvasElement,
    format: 'jpeg' | 'png' = 'jpeg',
    quality: number = 0.95
  ): Promise<Blob> {
    const createBlobPromise = new Promise<Blob>((resolve, reject) => {
      try {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('canvas.toBlob returned null - canvas may be tainted or too large'))
            }
          },
          `image/${format}`,
          quality
        )
      } catch (error) {
        reject(error)
      }
    })

    const blobTimeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Blob creation timeout - file may be too large')), 10000)
    })

    return Promise.race([createBlobPromise, blobTimeoutPromise])
  }

  // Helper: Validate canvas
  const validateCanvas = (canvas: HTMLCanvasElement): {
    valid: boolean
    errorType?: string
  } => {
    // Check canvas dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('[Export] Invalid canvas dimensions')
      return { valid: false, errorType: 'rendering-failed' }
    }

    // Estimate memory size (4 bytes per pixel for RGBA)
    const estimatedSize = canvas.width * canvas.height * 4
    const maxSize = 100 * 1024 * 1024 // 100MB limit

    if (estimatedSize > maxSize) {
      console.error('[Export] Canvas size exceeded')
      return { valid: false, errorType: 'size-exceeded' }
    }

    return { valid: true }
  }

  // Helper: Validate card ref
  const validateCardRef = (): boolean => {
    if (!cardRef.current) {
      const error = getErrorMessage('ref-missing')
      toast({
        title: error.title,
        description: error.description,
        variant: 'destructive'
      })
      return false
    }
    return true
  }

  const handleExport = async () => {
    if (!validateCardRef()) return

    setIsExporting(true)
    setExportProgress('Preparing...')

    // Cleanup any previous exports
    cleanupResources()

    try {
      // Adaptive scale based on paper size to prevent memory issues
      const getAdaptiveScale = (paperSize: PrintSize): number => {
        switch (paperSize) {
          case 'a2': return 1.5
          case 'a3': return 1.75
          case 'a4': return 2
          case 'a5': return 2.5
          default: return 2
        }
      }

      // Progressive fallback: try with optimal scale, fallback to lower scales if needed
      const scaleAttempts = [
        getAdaptiveScale(size),
        Math.max(1, getAdaptiveScale(size) - 0.5),
        1
      ]

      let lastError: Error | null = null

      for (let attemptIndex = 0; attemptIndex < scaleAttempts.length; attemptIndex++) {
        const attemptScale = scaleAttempts[attemptIndex]

        try {
          setExportProgress(attemptIndex === 0 ? 'Rendering card...' : `Retrying with lower quality (attempt ${attemptIndex + 1})...`)

          // Render card to canvas
          const canvas = await renderCardToCanvas(
            cardRef.current!,
            attemptScale,
            setExportProgress
          )

          // Validate canvas
          const validation = validateCanvas(canvas)
          if (!validation.valid) {
            // If validation failed and we have more attempts, throw to trigger retry
            if (attemptIndex < scaleAttempts.length - 1 &&
                (validation.errorType === 'size-exceeded' || validation.errorType === 'rendering-failed')) {
              throw new Error(validation.errorType!)
            }

            // Last attempt or non-retryable error, show error to user
            const error = getErrorMessage(validation.errorType!)
            toast({
              title: error.title,
              description: error.description,
              variant: 'destructive'
            })
            return
          }

          if (format === 'jpeg') {
            // Export as JPEG
            setExportProgress('Converting to JPEG...')
            const blob = await canvasToBlob(canvas, 'jpeg', 0.95)

            setExportProgress('Downloading...')

            const blobUrl = URL.createObjectURL(blob)
            cleanupRefs.current.blobUrls.push(blobUrl)

            const link = document.createElement('a')
            link.download = `resolution-bingo-${Date.now()}.jpg`
            link.href = blobUrl
            document.body.appendChild(link)
            cleanupRefs.current.downloadLinks.push(link)

            link.click()

            // Schedule cleanup after download starts
            setTimeout(() => {
              cleanupResources()
            }, 3000)

            toast({
              title: 'Download Started',
              description: attemptIndex > 0
                ? 'Your JPEG image is being downloaded (quality adjusted to prevent errors).'
                : 'Your JPEG image is being downloaded.'
            })
          } else {
            // Export as PDF
            setExportProgress('Creating PDF...')

            const { jsPDF } = await import('jspdf')

            let imgData: string
            try {
              imgData = canvas.toDataURL('image/jpeg', 0.95)
            } catch (error) {
              console.error('[Export] toDataURL failed:', error)
              throw new Error('Failed to convert canvas to data URL - canvas may be tainted or too large')
            }

            // Get dimensions in mm for the selected size
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

            setExportProgress('Downloading...')
            pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight)
            pdf.save(`resolution-bingo-${Date.now()}.pdf`)

            toast({
              title: 'Download Started',
              description: attemptIndex > 0
                ? `Your ${size.toUpperCase()} PDF is being downloaded (quality adjusted to prevent errors).`
                : `Your ${size.toUpperCase()} PDF is being downloaded.`
            })
          }

          // Success! Break out of retry loop
          break

        } catch (error) {
          console.error(`[Export] Attempt ${attemptIndex + 1} failed:`, error)
          lastError = error as Error

          // If this isn't the last attempt and it's a retryable error, continue
          if (attemptIndex < scaleAttempts.length - 1 && isRetryableError(lastError)) {
            continue
          }

          // Non-retryable error or last attempt - break and handle below
          break
        }
      }

      // If we get here and lastError exists, all attempts failed
      if (lastError) {
        console.error('[Export] All export attempts failed:', lastError)

        // Determine error type from error message
        let errorType = 'unknown'
        const errorMsg = lastError.message.toLowerCase()

        if (errorMsg.includes('size') || errorMsg.includes('too large') || errorMsg.includes('exceeded')) {
          errorType = 'size-exceeded'
        } else if (errorMsg.includes('render') || errorMsg.includes('canvas') || errorMsg.includes('timeout')) {
          errorType = 'rendering-failed'
        }

        const error = getErrorMessage(errorType)
        toast({
          title: error.title,
          description: error.description,
          variant: 'destructive'
        })
      }
    } finally {
      setIsExporting(false)
      setExportProgress('')
    }
  }

  const handleShare = async () => {
    if (!validateCardRef()) return

    setIsExporting(true)
    setExportProgress('Preparing...')

    // Cleanup any previous exports
    cleanupResources()

    try {
      // Use adaptive scale for share (A4 size equivalent)
      const shareScaleAttempts = [2, 1.5, 1]

      let lastError: Error | null = null

      for (let attemptIndex = 0; attemptIndex < shareScaleAttempts.length; attemptIndex++) {
        const attemptScale = shareScaleAttempts[attemptIndex]

        try {
          setExportProgress(attemptIndex === 0 ? 'Rendering card...' : `Retrying with lower quality (attempt ${attemptIndex + 1})...`)

          // Render card to canvas
          const canvas = await renderCardToCanvas(
            cardRef.current!,
            attemptScale,
            setExportProgress
          )

          // Validate canvas
          const validation = validateCanvas(canvas)
          if (!validation.valid) {
            // If validation failed and we have more attempts, throw to trigger retry
            if (attemptIndex < shareScaleAttempts.length - 1 &&
                (validation.errorType === 'size-exceeded' || validation.errorType === 'rendering-failed')) {
              throw new Error(validation.errorType!)
            }

            // Last attempt or non-retryable error, show error to user
            const error = getErrorMessage(validation.errorType!)
            toast({
              title: error.title,
              description: error.description,
              variant: 'destructive'
            })
            return
          }

          setExportProgress('Converting to image...')

          const blob = await canvasToBlob(canvas, 'jpeg', 0.95)
          const file = new File([blob], 'resolution-bingo.jpg', { type: 'image/jpeg' })

          if (navigator.share && navigator.canShare({ files: [file] })) {
            // Native share available
            setExportProgress('Opening share dialog...')

            try {
              await navigator.share({
                files: [file],
                title: 'My Resolution Bingo Card',
                text: 'Check out my New Year\'s Resolution Bingo Card!'
              })

              toast({
                title: 'Shared Successfully',
                description: 'Your bingo card has been shared.'
              })
            } catch (err: any) {
              // Check if user cancelled
              if (err.name === 'AbortError') {
                toast({
                  title: 'Share Cancelled',
                  description: 'You cancelled the share action.'
                })
              } else {
                console.error('[Share] Share failed:', err)
                const error = getErrorMessage('share-failed')
                toast({
                  title: error.title,
                  description: error.description,
                  variant: 'destructive'
                })
              }
            }
          } else {
            // Fallback: download the image
            setExportProgress('Downloading...')

            const blobUrl = URL.createObjectURL(blob)
            cleanupRefs.current.blobUrls.push(blobUrl)

            const link = document.createElement('a')
            link.download = `resolution-bingo-share-${Date.now()}.jpg`
            link.href = blobUrl
            document.body.appendChild(link)
            cleanupRefs.current.downloadLinks.push(link)

            link.click()

            // Schedule cleanup after download starts
            setTimeout(() => {
              cleanupResources()
            }, 3000)

            toast({
              title: 'Download Started',
              description: attemptIndex > 0
                ? 'Share is not available on this device. Your image is being downloaded (quality adjusted to prevent errors).'
                : 'Share is not available on this device. Your image is being downloaded instead.'
            })
          }

          // Success! Break out of retry loop
          break

        } catch (error) {
          console.error(`[Share] Attempt ${attemptIndex + 1} failed:`, error)
          lastError = error as Error

          // If this isn't the last attempt and it's a retryable error, continue
          if (attemptIndex < shareScaleAttempts.length - 1 && isRetryableError(lastError)) {
            continue
          }

          // Non-retryable error or last attempt - break and handle below
          break
        }
      }

      // If we get here and lastError exists, all attempts failed
      if (lastError) {
        console.error('[Share] All share attempts failed:', lastError)

        // Determine error type from error message
        let errorType = 'share-failed'
        const errorMsg = lastError.message.toLowerCase()

        if (errorMsg.includes('size') || errorMsg.includes('too large') || errorMsg.includes('exceeded')) {
          errorType = 'size-exceeded'
        } else if (errorMsg.includes('render') || errorMsg.includes('canvas') || errorMsg.includes('timeout')) {
          errorType = 'rendering-failed'
        }

        const error = getErrorMessage(errorType)
        toast({
          title: error.title,
          description: error.description,
          variant: 'destructive'
        })
      }
    } finally {
      setIsExporting(false)
      setExportProgress('')
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
                      {isExporting ? (exportProgress || 'Generating...') : 'Share Card'}
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
                    {isExporting ? (exportProgress || 'Generating...') : `Download ${format.toUpperCase()}`}
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
                  <li>• Quality is optimized for each paper size</li>
                  <li>• Export automatically retries if issues occur</li>
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
