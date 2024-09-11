'use client'

import { useState, useRef, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShareIcon, DownloadIcon, SaveIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import html2canvas from 'html2canvas'
import { useRouter, useSearchParams } from 'next/navigation'
import { init, tx, id } from '@instantdb/react'

// ID for app: realtime-brat-generator
const APP_ID = 'eb984380-28b4-4142-a677-5590258bd7fd'

// Declare schema for intellisense
type Schema = {
  bratCreations: BratCreation
}

const db = init<Schema>({ appId: APP_ID })

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

interface BratCreation {
  id: string;
  text: string;
  preset: string;
  createdAt: number;
}

export default function BratGeneratorWithTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bratText, setBratText] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset>(colorPresets[1]) // Default to "brat"
  const bratBoxRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLTextAreaElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  // Read Data
  const { isLoading, error, data } = db.useQuery({ bratCreations: {} })

  useEffect(() => {
    const textFromQuery = searchParams.get('text')
    if (textFromQuery) {
      setBratText(decodeURIComponent(textFromQuery))
    } else {
      setBratText('Guess')
    }

    const presetFromQuery = searchParams.get('preset')
    if (presetFromQuery) {
      const newPreset = colorPresets.find(preset => preset.value === presetFromQuery)
      if (newPreset) {
        setSelectedPreset(newPreset)
      }
    }
  }, [searchParams])

  useEffect(() => {
    adjustEditableSize()
  }, [bratText, selectedPreset])

  const handlePresetChange = (value: string) => {
    const newPreset = colorPresets.find(preset => preset.value === value)
    if (newPreset) {
      setSelectedPreset(newPreset)
      updateQueryParams(bratText, newPreset.value)
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
    const newText = e.target.value
    setBratText(newText)
    updateQueryParams(newText, selectedPreset.value)
  }

  const updateQueryParams = (text: string, preset: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('text', encodeURIComponent(text))
    params.set('preset', preset)
    router.push(`?${params.toString()}`, { scroll: false })
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

  const handleSave = () => {
    db.transact(
        tx.bratCreations[id()].update({
          text: bratText,
          preset: selectedPreset.value,
          createdAt: Date.now(),
        })
    )
  }

  const renderBratPreview = (text: string, preset: string) => {
    const presetConfig = colorPresets.find(p => p.value === preset) || colorPresets[1]
    return (
        <div
            className="w-full aspect-square shadow-sm flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: presetConfig.backgroundColor }}
        >
          <div
              style={{
                color: presetConfig.textColor,
                fontWeight: 'bold',
                fontFamily: 'arialnarrow, Arial Narrow, Arial, sans-serif',
                fontSize: '24px',
                lineHeight: '1.2',
                textAlign: 'center',
                filter: 'blur(1px) contrast(1.25)',
                whiteSpace: 'pre-wrap',
              }}
          >
            {text}
          </div>
        </div>
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>
  }

  const { bratCreations } = data

  return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>BRAT Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 p-1 rounded-md">
                <TabsTrigger
                    value="create"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Create
                </TabsTrigger>
                <TabsTrigger
                    value="saved"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Creations
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
                    <Select onValueChange={handlePresetChange} value={selectedPreset.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorPresets.map((preset) => (
                            <SelectItem
                                key={preset.value}
                                value={preset.value}
                            >
                              {preset.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSave} className="w-[180px]">
                      <SaveIcon className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={handleShareSession} className="w-[180px]">
                      <ShareIcon className="mr-2 h-4 w-4" /> Share Session
                    </Button>
                    <Button onClick={handleDownload} className="w-[180px]">
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="saved" className="h-full overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...bratCreations]
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .map((creation) => (
                            <Card key={creation.id} className="flex flex-col">
                              <CardHeader className="p-4">
                                <CardTitle className="text-lg truncate">{creation.text}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 flex-grow">
                                {renderBratPreview(creation.text, creation.preset)}
                                <p className="text-sm text-muted-foreground mt-2">Preset: {creation.preset}</p>
                                <p className="text-sm text-muted-foreground">
                                  Created: {new Date(creation.createdAt).toLocaleString()}
                                </p>
                              </CardContent>
                            </Card>
                        ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  )
}