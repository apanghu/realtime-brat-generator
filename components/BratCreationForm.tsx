'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CloudIcon, CheckCircleIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPreset, colorPresets } from '@/lib/types';
import { db } from '@/lib/db';
import { tx } from '@instantdb/react';
import { id } from '@instantdb/core';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface BratCreationFormProps {
  bratText: string;
  setBratText: (text: string) => void;
  selectedPreset: ColorPreset;
  setSelectedPreset: (preset: ColorPreset) => void;
  updateQueryParams: (text: string, preset: string) => void;
}

function BratCreationForm({
  bratText,
  setBratText,
  selectedPreset,
  setSelectedPreset,
  updateQueryParams,
}: BratCreationFormProps) {
  const bratBoxRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiComplete, setConfettiComplete] = useState(false);

  useEffect(() => {
    adjustDisplaySize();
  }, [bratText, selectedPreset]);

  const adjustDisplaySize = () => {
    if (bratBoxRef.current && displayRef.current) {
      const boxWidth = bratBoxRef.current.offsetWidth;
      const fontSize = Math.min(boxWidth / 10, 60);
      displayRef.current.style.fontSize = `${fontSize}px`;
    }
  };

  const handlePresetChange = (value: string) => {
    const newPreset = colorPresets.find((preset) => preset.value === value);
    if (newPreset) {
      setSelectedPreset(newPreset);
      updateQueryParams(bratText, newPreset.value);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setBratText(newText);
    updateQueryParams(newText, selectedPreset.value);
  };

  const handleDownload = () => {
    if (bratBoxRef.current) {
      toPng(bratBoxRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'brat-creation.png';
          link.click();
        })
        .catch((error) => {
          console.error('Failed to capture image: ', error);
        });
    }
  };

  const handleSave = () => {
    const bratCreation = {
      text: bratText,
      preset: selectedPreset.value,
      createdAt: Date.now(),
    };
    db.transact(
      tx.bratCreations[id()].update({
        ...bratCreation,
      })
    );

    setShowSaveAnimation(true);
    setShowConfetti(true);
    setConfettiComplete(false);

    setTimeout(() => {
      setShowSaveAnimation(false);
    }, 2000);
  };

  const handleConfettiComplete = () => {
    setConfettiComplete(true);
    setShowConfetti(false);
  };

  return (
    <div className='w-full p-2 sm:p-4'>
      {/* Confetti animation for successful actions */}
      {showConfetti && !confettiComplete && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          onConfettiComplete={handleConfettiComplete}
        />
      )}

      {/* Improved grid layout with better balance */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        {/* Left side: Preview section with enhanced container */}
        <div className='flex flex-col items-center justify-center w-full bg-background/30 rounded-xl p-6 backdrop-blur-sm border border-white/10'>
          <div
            ref={bratBoxRef}
            className='relative w-full max-w-md aspect-[3/4] items-center justify-center 
                overflow-hidden rounded-xl transition-all duration-500 
                hover:shadow-2xl hover:scale-[1.02] 
                border border-white/20 shadow-lg'
            style={{ 
              backgroundColor: selectedPreset.backgroundColor,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              ref={displayRef}
              className='absolute inset-0 z-10 flex h-full w-full 
                  resize-none items-center justify-center overflow-hidden 
                  text-center text-4xl outline-none transition-all duration-300'
              style={{
                color: selectedPreset.textColor,
                fontWeight: 'bold',
                fontFamily: 'arialnarrow, Arial Narrow, Arial, sans-serif',
                lineHeight: 1.2,
                padding: '20px',
                filter: 'blur(1.7px)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {bratText}
            </div>
          </div>
          {/* Add preview label */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Preview - Your BRAT will look like this
          </div>
        </div>

        {/* Right side: Control panel with matching style */}
        <div className='flex flex-col space-y-6 bg-background/30 rounded-xl p-6 backdrop-blur-sm border border-white/10'>
          {/* Text input with improved styling */}
          <div className='space-y-3'>
            <label htmlFor='bratText' className='text-base font-semibold text-foreground/90'>
              Enter Your Text
            </label>
            <Textarea
              id='bratText'
              value={bratText}
              onChange={handleTextChange}
              placeholder='Enter your text here...'
              className='w-full min-h-[120px] rounded-lg border-2 
                  border-primary/20 bg-background/50 p-4 
                  transition-all duration-300 
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  hover:border-primary/40 text-base'
              rows={4}
            />
          </div>

          {/* Theme selection with improved styling */}
          <div className='space-y-3'>
            <label className='text-base font-semibold text-foreground/90'>
              Color Theme
            </label>
            <Select onValueChange={handlePresetChange} value={selectedPreset.value}>
              <SelectTrigger className='w-full transition-all duration-300 
                  hover:border-primary focus:ring-2 focus:ring-primary/20
                  bg-background/50 border-2 border-primary/20'>
                <SelectValue placeholder='Choose a color theme' />
              </SelectTrigger>
              <SelectContent>
                {colorPresets.map((preset) => (
                  <SelectItem 
                    key={preset.value} 
                    value={preset.value}
                    className='transition-colors duration-200 hover:bg-primary/10'
                  >
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons with consistent styling */}
          <div className='flex flex-col space-y-4 pt-2'>
            {/* Save button */}
            <div className='relative'>
              <Button 
                onClick={handleSave} 
                className='w-full bg-primary hover:bg-primary/90 
                    transition-all duration-300 transform 
                    hover:scale-[1.02] hover:shadow-lg
                    active:scale-[0.98] py-6
                    rounded-lg text-base font-semibold'
              >
                <CloudIcon className='mr-2 h-5 w-5' /> Save to Cloud
              </Button>
              {/* Success Animation Overlay */}
              <AnimatePresence>
                {showSaveAnimation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className='absolute inset-0 flex items-center justify-center rounded-md bg-green-500 text-white shadow-lg'
                  >
                    <CheckCircleIcon className='mr-2 h-5 w-5' /> Saved!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Download button */}
            <Button
              onClick={handleDownload}
              variant='secondary'
              className='w-full py-6 transition-all duration-300 
                  transform hover:scale-[1.02] hover:shadow-lg 
                  active:scale-[0.98] rounded-lg text-base font-semibold
                  bg-background/50 border-2 border-primary/20'
            >
              <DownloadIcon className='mr-2 h-5 w-5' /> Download Image
            </Button>
          </div>

          {/* Tips section with matching style */}
          <div className='rounded-lg bg-background/50 p-5 
              text-sm backdrop-blur-sm 
              border-2 border-primary/20'>
            <p className="font-semibold text-base text-foreground/90 mb-3">Quick Tips</p>
            <ul className='space-y-2 text-muted-foreground'>
              <li className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="mr-2">•</span>
                Modify text anytime to update preview
              </li>
              <li className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="mr-2">•</span>
                Experiment with different themes
              </li>
              <li className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="mr-2">•</span>
                Save to cloud for later edits
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BratCreationForm;
