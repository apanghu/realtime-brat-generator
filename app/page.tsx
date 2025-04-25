'use client';

import { useState, useEffect, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';
import { tx } from '@instantdb/react';
import { ColorPreset, colorPresets } from '@/lib/types';
import SavedCreations from '@/components/SavedCreations';
import { id } from '@instantdb/core';
import BratCreationForm from '@/components/BratCreationForm';
import TopBrats from '@/components/TopBrats';
import Navbar from './components/Navbar';
import PageLayout from './components/PageLayout';
import LoadingSpinner from './components/LoadingSpinner';
import StatsSection from './components/StatsSection';
import FeatureHighlight from './components/FeatureHighlight';
import Footer from './components/Footer';

export default function BratGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const charliSongLines = [
    'Boom Clap, the sound of my heart!💖💥',
    "I don't wanna go to school, I just wanna break the rules!🕺🎉",
    "Boys, I was busy dreaming 'bout boys! 🧠💭💃",
    'Vroom Vroom, bitches!💨🚀',
    "I'm so fancy, you already know!✨🔥",
    'Unlock it, lock it, unlock it!🔐🎤',
    'I just wanna go back, back to 1999!⏳💔',
    'Blame it on your love, love every time!💘🚨',
    'Take my hand, let me be your fantasy!✋✨🌟',
    "Doing it, doing it, we're doing it well!💪🌈",
  ];

  const getRandomSongLine = () =>
    charliSongLines[Math.floor(Math.random() * charliSongLines.length)];

  const [bratText, setBratText] = useState(getRandomSongLine());
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset>(
    colorPresets[1]
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authState, setAuthState] = useState({
    sentEmail: '',
    email: '',
    error: null as string | null,
    code: '',
  });
  const [activeTab, setActiveTab] = useState('create');

  const { isLoading, error, data } = db.useQuery({
    bratCreations: {},
    votes: {},
  });
  const { user } = db.useAuth();

  useEffect(() => {
    const textFromQuery = searchParams.get('text');
    if (textFromQuery) {
      setBratText(decodeURIComponent(textFromQuery));
      setActiveTab('create');
    }

    const presetFromQuery = searchParams.get('preset');
    if (presetFromQuery) {
      const newPreset = colorPresets.find(
        (preset) => preset.value === presetFromQuery
      );
      if (newPreset) {
        setSelectedPreset(newPreset);
      }
    }
  }, [searchParams]);

  const updateQueryParams = (text: string, preset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('text', encodeURIComponent(text));
    params.set('preset', preset);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleVote = (
    creationId: string,
    orientation: 'upvote' | 'downvote'
  ) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const existingVote = data?.votes.find(
      (vote) =>
        vote.bratCreationId === creationId && vote.createdUserId === user.id
    );

    if (existingVote) {
      if (existingVote.orientation === orientation) {
        db.transact(tx.votes[existingVote.id].delete());
      } else {
        db.transact(tx.votes[existingVote.id].update({ orientation }));
      }
    } else {
      db.transact(
        tx.votes[id()].update({
          createdUserId: user.id,
          createdAt: Date.now(),
          bratCreationId: creationId,
          orientation,
        })
      );
    }
  };

  const handleSendMagicCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.email) return;

    setAuthState({ ...authState, sentEmail: authState.email, error: null });

    try {
      await db.auth.sendMagicCode({ email: authState.email });
    } catch (error) {
      if (error instanceof Error) {
        setAuthState({ ...authState, error: error.message });
      }
    }
  };

  const handleVerifyMagicCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.code) return;

    try {
      await db.auth.signInWithMagicCode({
        email: authState.sentEmail,
        code: authState.code,
      });
      setIsAuthModalOpen(false);
      setAuthState({ sentEmail: '', email: '', error: null, code: '' });
    } catch (error) {
      if (error instanceof Error) {
        setAuthState({ ...authState, error: error.message });
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Error: {error.message}
      </div>
    );
  }

  const { bratCreations, votes } = data;

  const sortedByDate = [...bratCreations].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const sortedByLikes = [...bratCreations].sort((a, b) => {
    const aVotes = votes.filter((v) => v.bratCreationId === a.id);
    const bVotes = votes.filter((v) => v.bratCreationId === b.id);
    const aScore =
      aVotes.filter((v) => v.orientation === 'upvote').length -
      aVotes.filter((v) => v.orientation === 'downvote').length;
    const bScore =
      bVotes.filter((v) => v.orientation === 'upvote').length -
      bVotes.filter((v) => v.orientation === 'downvote').length;
    return bScore - aScore;
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageLayout
          heading="BRAT Generator"
          subheading="Create and share your unique BRAT content"
          className="flex-grow bg-gradient-to-b from-background via-background/80 to-background"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12 py-6 animate-fade-in">
              <div className="glass-effect rounded-xl p-6 sm:p-8 card-hover">
                <CardHeader className="border-b border-border/40 px-0">
                  <CardTitle className="text-3xl font-bold gradient-text text-center">
                    Create Your BRAT
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 px-0">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="mb-4 grid w-full grid-cols-2 sm:grid-cols-3 rounded-lg bg-muted/50 p-1">
                      <TabsTrigger
                        value="create"
                        className="rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                      >
                        Create
                      </TabsTrigger>
                      <TabsTrigger
                        value="saved"
                        className="rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                      >
                        Creations
                      </TabsTrigger>
                      <TabsTrigger
                        value="top"
                        className="hidden sm:block rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                      >
                        Top BRATs
                      </TabsTrigger>
                    </TabsList>
                    <div className="rounded-lg">
                      <TabsContent value="create" className="focus-visible:outline-none">
                        <BratCreationForm
                          bratText={bratText}
                          setBratText={setBratText}
                          selectedPreset={selectedPreset}
                          setSelectedPreset={setSelectedPreset}
                          updateQueryParams={updateQueryParams}
                        />
                      </TabsContent>
                      <TabsContent value="saved" className="focus-visible:outline-none">
                        <SavedCreations
                          creations={sortedByDate}
                          votes={votes}
                          user={user}
                          onVote={handleVote}
                          setIsAuthModalOpen={setIsAuthModalOpen}
                        />
                      </TabsContent>
                      <TabsContent value="top" className="focus-visible:outline-none">
                        <TopBrats
                          creations={sortedByLikes}
                          votes={votes}
                          user={user}
                          onVote={handleVote}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </div>

              <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <DialogContent className='bg-white sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold'>
                Authentication Required
              </DialogTitle>
              <DialogDescription className='text-foreground/70'>
                Please sign in to vote on BRAT creations.
              </DialogDescription>
            </DialogHeader>
            <div className='mt-6'>
              {!authState.sentEmail ? (
                <form onSubmit={handleSendMagicCode} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email'
                      value={authState.email}
                      onChange={(e) =>
                        setAuthState({
                          ...authState,
                          email: e.target.value,
                          error: null,
                        })
                      }
                      className='w-full'
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    Send Code
                  </Button>
                  {authState.error && (
                    <p className='mt-2 text-sm text-destructive'>
                      {authState.error}
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleVerifyMagicCode} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='code' className='text-sm font-medium'>
                      Magic Code
                    </Label>
                    <Input
                      id='code'
                      type='text'
                      placeholder='Enter the magic code'
                      value={authState.code}
                      onChange={(e) =>
                        setAuthState({
                          ...authState,
                          code: e.target.value,
                          error: null,
                        })
                      }
                      className='w-full'
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    Verify
                  </Button>
                  {authState.error && (
                    <p className='mt-2 text-sm text-destructive'>
                      {authState.error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
              <div className="glass-effect rounded-xl p-6 sm:p-8 card-hover">
                <StatsSection />
              </div>

              <div className="glass-effect rounded-xl p-6 sm:p-8 card-hover">
                <FeatureHighlight />
              </div>

              <div className="mt-12 sm:mt-16 text-center">
                <div className="glass-effect rounded-xl p-8 sm:p-12 card-hover max-w-3xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/90 via-primary to-primary/90 
                      bg-clip-text text-transparent animate-gradient mb-4">
                    Ready to Create Your BRAT?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Join our creative community and start generating unique BRATs today
                  </p>
                  <Button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold
                        transition-all duration-300 transform hover:scale-105"
                  >
                    Start Creating Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageLayout>
        
        <Footer className="glass-effect mt-auto" />
      </div>
    </Suspense>
  );
}
