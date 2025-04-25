'use client';

import { ReactNode } from 'react';
import PageTransition from './PageTransition';

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
          <div className="mb-12 text-center">
            <h1 className="mb-2 text-4xl font-bold gradient-text relative inline-block">
              {heading}
              <div className="absolute -bottom-2 left-0 h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 transition-transform group-hover:scale-x-100"></div>
            </h1>
            {subheading && (
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
          <div className={`fade-in-slide-up ${className}`}>{children}</div>
        </div>
      </PageTransition>
    </div>
  );
} 