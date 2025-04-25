'use client';

import { ReactNode } from 'react';
import PageTransition from './PageTransition';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  heading: string;
  subheading?: string;
  className?: string;
}

export default function PageLayout({
  children,
  heading,
  subheading,
  className = '',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background pt-20">
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center relative">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-4xl sm:text-5xl font-bold relative inline-block"
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary 
                  bg-clip-text text-transparent animate-gradient">
                {heading}
              </span>
              <div className="absolute -bottom-2 left-0 h-0.5 w-full 
                  bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            </motion.h1>
            {subheading && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto"
              >
                {subheading}
              </motion.p>
            )}
          </div>
          <div className={`fade-in-slide-up ${className}`}>{children}</div>
        </div>
      </PageTransition>
    </div>
  );
} 