'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUpIcon, ThumbsDownIcon, Share2Icon } from 'lucide-react';
import { BratCreation, colorPresets, User, Vote } from '@/lib/types';
import { renderBratPreview } from '@/components/BratPreview';
import { useToast } from '@/components/ui/use-toast';

interface SavedCreationsProps {
  creations: BratCreation[];
  votes: Vote[];
  user: User | undefined;
  onVote: (creationId: string, orientation: 'upvote' | 'downvote') => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

const SavedCreations = ({
  creations,
  votes,
  user,
  onVote,
  setIsAuthModalOpen,
}: SavedCreationsProps) => {
  const { toast } = useToast();

  const handleShare = (creation: BratCreation) => {
    const shareUrl = `${window.location.origin}/?text=${encodeURIComponent(creation.text)}&preset=${creation.preset}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this link with others!",
        duration: 3000,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
        duration: 3000,
      });
    });
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {creations.map((creation) => {
        const creationVotes = votes.filter(
          (v) => v.bratCreationId === creation.id
        );
        const upvotes = creationVotes.filter(
          (v) => v.orientation === 'upvote'
        ).length;
        const downvotes = creationVotes.filter(
          (v) => v.orientation === 'downvote'
        ).length;
        const userVote = user
          ? creationVotes.find((v) => v.createdUserId === user.id)
          : null;

        return (
          <motion.div
            key={creation.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-effect hover-effect">
              <CardHeader className='p-4'>
                <CardTitle className='truncate text-lg gradient-text'>
                  {creation.text}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-grow p-4 pt-0'>
                {renderBratPreview(creation.text, creation.preset, colorPresets)}
                <p className='mt-2 text-sm text-muted-foreground'>
                  Preset: {creation.preset}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Created: {new Date(creation.createdAt).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className='flex flex-col space-y-2 p-4'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center space-x-2'>
                    <Button
                      size='sm'
                      variant={
                        userVote?.orientation === 'upvote' ? 'default' : 'outline'
                      }
                      onClick={() => onVote(creation.id, 'upvote')}
                      className="hover-effect"
                    >
                      <ThumbsUpIcon className='mr-1 h-4 w-4' />
                      {upvotes}
                    </Button>
                    <Button
                      size='sm'
                      variant={
                        userVote?.orientation === 'downvote' ? 'default' : 'outline'
                      }
                      onClick={() => onVote(creation.id, 'downvote')}
                      className="hover-effect"
                    >
                      <ThumbsDownIcon className='mr-1 h-4 w-4' />
                      {downvotes}
                    </Button>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleShare(creation)}
                    className="hover-effect"
                    title="Share this BRAT"
                  >
                    <Share2Icon className='h-4 w-4' />
                  </Button>
                </div>
                <div className='text-sm font-medium'>
                  Score: {upvotes - downvotes}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

SavedCreations.displayName = 'SavedCreations';

export default SavedCreations;
