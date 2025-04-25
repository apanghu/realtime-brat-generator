'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Palette, Share2, Download, Sparkles } from 'lucide-react';

export default function FeatureHighlight() {
  const features = [
    {
      title: 'Beautiful Presets',
      description: 'Choose from a variety of carefully crafted color combinations',
      icon: Palette,
    },
    {
      title: 'Easy Sharing',
      description: 'Share your creations instantly with the community',
      icon: Share2,
    },
    {
      title: 'Download & Save',
      description: 'Download your BRATs in high quality or save them to your collection',
      icon: Download,
    },
    {
      title: 'Real-time Preview',
      description: 'See your changes instantly as you type',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container px-4 mx-auto relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 gradient-text"
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 backdrop-blur-sm bg-background/80">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 