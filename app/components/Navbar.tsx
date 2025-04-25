'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300"
            >
              <Sparkles className="h-6 w-6 text-primary animate-glow" />
              <span className="font-bold text-xl gradient-text">BRAT Generator</span>
            </Link>
          </div>
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative font-medium transition-colors hover:text-primary',
                  pathname === item.href 
                    ? 'text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""] after:animate-glow' 
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 