'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, User, LogOut } from 'lucide-react';
import { db } from '@/lib/db';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  setIsAuthModalOpen: (open: boolean) => void;
}

export default function Navbar({ setIsAuthModalOpen }: NavbarProps) {
  const pathname = usePathname();
  const { user } = db.useAuth();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];

  const handleSignOut = async () => {
    await db.auth.signOut();
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
          <div className="flex items-center gap-8">
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-primary"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 