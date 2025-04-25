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
import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';
import { BratCreation, colorPresets, User, Vote } from '@/lib/types';
import { renderBratPreview } from '@/components/BratPreview';

interface SavedCreationsProps {
  creations: BratCreation[];
  votes: Vote[];
  user: User | undefined;
  onVote: (creationId: string, orientation: 'upvote' | 'downvote') => void;
}

const SavedCreations = ({
  creations,
  votes,
  user,
  onVote,
}: SavedCreationsProps) => (
  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
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

SavedCreations.displayName = 'SavedCreations';

export default SavedCreations;
