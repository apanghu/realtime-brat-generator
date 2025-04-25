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
          <div className="space-y-16 py-8 animate-fade-in">
            {/* Main Creation Section */}
            <div className="mx-auto max-w-4xl">
              <Card className="glass-effect hover-effect card-hover">
                <CardHeader className="border-b border-border/40">
                  <CardTitle className="text-3xl font-bold gradient-text text-center">
                    Create Your BRAT
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="mb-4 grid w-full grid-cols-3 rounded-lg bg-muted/50 p-1">
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
                        className="rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
                      >
                        Top BRATs
                      </TabsTrigger>
                    </TabsList>
                    <div className="h-[600px] overflow-hidden rounded-lg">
                      <TabsContent value="create" className="h-full">
                        <BratCreationForm
                          bratText={bratText}
                          setBratText={setBratText}
                          selectedPreset={selectedPreset}
                          setSelectedPreset={setSelectedPreset}
                          updateQueryParams={updateQueryParams}
                        />
                      </TabsContent>
                      <TabsContent value="saved" className="h-full overflow-y-auto">
                        <SavedCreations
                          creations={sortedByDate}
                          votes={votes}
                          user={user}
                          onVote={handleVote}
                        />
                      </TabsContent>
                      <TabsContent value="top" className="h-full overflow-y-auto">
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
              </Card>
            </div>

            {/* Stats and Features Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="space-y-16">
                <div className="glass-effect rounded-lg p-8 card-hover">
                  <StatsSection />
                </div>

                <div className="glass-effect rounded-lg p-8 card-hover">
                  <FeatureHighlight />
                </div>
              </div>
            </div>

            {/* Auth Dialog */}
            <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
              <DialogContent className="glass-effect sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold gradient-text">
                    {!authState.sentEmail ? 'Sign In' : 'Enter Code'}
                  </DialogTitle>
                  <DialogDescription>
                    {!authState.sentEmail
                      ? 'Enter your email to receive a magic link'
                      : 'Check your email for the magic code'}
                  </DialogDescription>
                </DialogHeader>
                
                {!authState.sentEmail ? (
                  <form onSubmit={handleSendMagicCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={authState.email}
                        onChange={(e) =>
                          setAuthState({ ...authState, email: e.target.value })
                        }
                        className="glass-effect"
                        required
                      />
                    </div>
                    {authState.error && (
                      <p className="text-destructive text-sm">{authState.error}</p>
                    )}
                    <Button type="submit" className="w-full button-effect">
                      Send Magic Code
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyMagicCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Magic Code</Label>
                      <Input
                        id="code"
                        value={authState.code}
                        onChange={(e) =>
                          setAuthState({ ...authState, code: e.target.value })
                        }
                        className="glass-effect"
                        required
                      />
                    </div>
                    {authState.error && (
                      <p className="text-destructive text-sm">{authState.error}</p>
                    )}
                    <Button type="submit" className="w-full button-effect">
                      Verify Code
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </PageLayout>
        
        <Footer className="glass-effect mt-auto" />
      </div>
    </Suspense>
  );
}
