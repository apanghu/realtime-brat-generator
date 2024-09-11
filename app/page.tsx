'use client'

import { useState, useRef, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShareIcon, DownloadIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import html2canvas from 'html2canvas'

interface ColorPreset {
  label: string;
  value: string;
  textColor: string;
  backgroundColor: string;
}

const colorPresets: ColorPreset[] = [
  { label: "brat deluxe", value: "bratdeluxe", textColor: "#000000", backgroundColor: "#ffffff" },
  { label: "brat", value: "brat", textColor: "#000000", backgroundColor: "#8ace00" },
  { label: "crash", value: "crash", textColor: "#f70000", backgroundColor: "#019bd9" },
  { label: "how i'm feeling now", value: "howimfeelingnow", textColor: "#c1c1c1", backgroundColor: "#ffffff" },
  { label: "charli", value: "charli", textColor: "#000000", backgroundColor: "#918a84" },
  { label: "pop 2", value: "pop2", textColor: "#000000", backgroundColor: "#c9a1dd" },
  { label: "vroom vroom", value: "vroomvroom", textColor: "#404040", backgroundColor: "#000000" },
  { label: "number 1 angel", value: "number1angel", textColor: "#ff1000", backgroundColor: "#d20001" },
  { label: "sucker", value: "sucker", textColor: "#ffffff", backgroundColor: "#f5abcc" },
  { label: "true romance", value: "trueromance", textColor: "#ffffff", backgroundColor: "#700150" },
  { label: "custom color", value: "custom", textColor: "#8ace00", backgroundColor: "#000000" },
]

interface Creation {
  id: number;
  text: string;
  preset: string;
  likes: number;
}

const mockCreations: Creation[] = [
  { id: 1, text: "BRAT LIFE", preset: "brat", likes: 120 },
  { id: 2, text: "POP 2 FOREVER", preset: "pop2", likes: 95 },
  { id: 3, text: "VROOM VROOM", preset: "vroomvroom", likes: 87 },
  { id: 4, text: "CHARLI XCX", preset: "charli", likes: 76 },
  { id: 5, text: "SUCKER PUNCH", preset: "sucker", likes: 65 },
]

export default function BratGeneratorWithTabs() {
  const [bratText, setBratText] = useState('Guess')
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset>(colorPresets[1]) // Default to "brat"
  const bratBoxRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLTextAreaElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    adjustEditableSize()
  }, [bratText, selectedPreset])

  const handlePresetChange = (value: string) => {
    const newPreset = colorPresets.find(preset => preset.value === value)
    if (newPreset) {
      setSelectedPreset(newPreset)
    }
  }

  const adjustEditableSize = () => {
    if (editableRef.current && bratBoxRef.current && displayRef.current) {
      const boxWidth = bratBoxRef.current.offsetWidth
      const fontSize = Math.min(boxWidth / 10, 60)
      editableRef.current.style.fontSize = `${fontSize}px`
      displayRef.current.style.fontSize = `${fontSize}px`
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBratText(e.target.value)
  }

  const handleDownload = () => {
    if (bratBoxRef.current) {
      html2canvas(bratBoxRef.current).then(canvas => {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'brat-creation.png'
        link.click()
      })
    }
  }

  const handleShareSession = async () => {
    if (bratBoxRef.current && navigator.share) {
      const canvas = await html2canvas(bratBoxRef.current)
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], 'brat-creation.png', { type: 'image/png' })

      try {
        await navigator.share({
          files: [file],
          title: 'My BRAT Creation',
          text: 'Check out my BRAT creation!',
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Sharing is not supported on this device or browser.')
    }
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: selectedPreset.backgroundColor }}>
        <Tabs defaultValue="create" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2 mb-4" style={{ backgroundColor: selectedPreset.textColor }}>
            <TabsTrigger
                value="create"
                style={{
                  color: selectedPreset.backgroundColor,
                  backgroundColor: 'transparent',
                }}
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Create
            </TabsTrigger>
            <TabsTrigger
                value="leaderboard"
                style={{
                  color: selectedPreset.backgroundColor,
                  backgroundColor: 'transparent',
                }}
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>
          <div className="h-[600px] overflow-hidden">
            <TabsContent value="create" className="h-full">
              <div
                  ref={bratBoxRef}
                  className="w-full max-w-md mx-auto aspect-square shadow-lg flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{ backgroundColor: selectedPreset.backgroundColor }}
              >
              <textarea
                  ref={editableRef}
                  value={bratText}
                  onChange={handleTextChange}
                  className="w-full h-full outline-none overflow-hidden absolute inset-0 z-10 resize-none bg-transparent text-center opacity-0"
                  style={{
                    color: selectedPreset.textColor,
                    fontWeight: 'bold',
                    fontFamily: 'arialnarrow, Arial Narrow, Arial, sans-serif',
                    lineHeight: '1.2',
                    padding: '10px',
                  }}
              />
                <div
                    ref={displayRef}
                    className="w-full h-full absolute inset-0 pointer-events-none flex items-center justify-center"
                    style={{
                      color: selectedPreset.textColor,
                      fontWeight: 'bold',
                      fontFamily: 'arialnarrow, Arial Narrow, Arial, sans-serif',
                      lineHeight: '1.2',
                      padding: '10px',
                      textAlign: 'center',
                      filter: 'blur(2px) contrast(1.25)',
                      whiteSpace: 'pre-wrap',
                    }}
                >
                  {bratText}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 justify-center">
                <Select onValueChange={handlePresetChange} defaultValue={selectedPreset.value}>
                  <SelectTrigger className="w-[180px]" style={{ backgroundColor: selectedPreset.textColor, color: selectedPreset.backgroundColor }}>
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorPresets.map((preset) => (
                        <SelectItem
                            key={preset.value}
                            value={preset.value}
                            style={{ color: preset.textColor, backgroundColor: preset.backgroundColor }}
                        >
                          {preset.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleShareSession} className="w-[180px]" style={{ backgroundColor: selectedPreset.textColor, color: selectedPreset.backgroundColor }}>
                  <ShareIcon className="mr-2 h-4 w-4" /> Share Session
                </Button>
                <Button onClick={handleDownload} className="w-[180px]" style={{ backgroundColor: selectedPreset.textColor, color: selectedPreset.backgroundColor }}>
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="leaderboard" className="h-full">
              <div
                  className="rounded-lg shadow p-6 h-full overflow-y-auto"
                  style={{ backgroundColor: selectedPreset.textColor, color: selectedPreset.backgroundColor }}
              >
                <h2 className="text-2xl font-bold mb-4">Top Creations</h2>
                <ul className="space-y-4">
                  {mockCreations.map((creation, index) => (
                      <li
                          key={creation.id}
                          className="flex items-center justify-between border-b pb-2"
                          style={{ borderColor: selectedPreset.backgroundColor }}
                      >
                        <div className="flex items-center">
                          <span className="font-bold mr-4">{index + 1}.</span>
                          <div>
                            <p className="font-semibold">{creation.text}</p>
                            <p className="text-sm opacity-75">Preset: {creation.preset}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{creation.likes}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
  )
}