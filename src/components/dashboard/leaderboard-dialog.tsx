'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Trophy, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

const getRank = (eventsWon: number) => {
    if (eventsWon >= 20) return { name: 'Grandmaster', styles: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    if (eventsWon >= 10) return { name: 'Master', styles: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (eventsWon >= 5) return { name: 'Pro', styles: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    return { name: 'Newbie', styles: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
};

const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Trophy className="w-6 h-6 text-orange-600" />;
    return <div className="w-6 h-6 flex items-center justify-center font-bold">{index + 1}</div>;
};

export function LeaderboardDialog({ open, onOpenChange, users }: LeaderboardDialogProps) {
    const { user: currentUser } = useAuth();
    const sortedUsers = [...users].sort((a, b) => b.coins - a.coins);

    const currentUserRankIndex = sortedUsers.findIndex(u => u.email === currentUser?.email);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md neumorphic-flat">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Trophy className="text-primary" />
            Leaderboard
          </DialogTitle>
          <DialogDescription>
            Top students ranked by coin balance. Keep participating to climb up!
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {sortedUsers.map((user, index) => {
              const rank = getRank(user.eventsWon || 0);
              const isCurrentUser = user.email === currentUser?.email;
              return (
                <div key={user.email} className={cn("flex items-center justify-between p-3 rounded-lg border", isCurrentUser ? "bg-primary/10 border-primary" : "neumorphic-flat")}>
                  <div className="flex items-center gap-4">
                    {getRankIcon(index)}
                    <Avatar className="neumorphic-pressed">
                        <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`} alt={user.name} />
                        <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={cn("font-bold", isCurrentUser && "text-primary")}>{user.name || user.email.split('@')[0]}</p>
                      <p className={cn("text-xs px-2 py-0.5 rounded-full inline-block neumorphic-raised", rank.styles)}>{rank.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-bold text-yellow-400">
                    <Coins className="w-5 h-5" />
                    {user.coins}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
         {currentUserRankIndex !== -1 && (
            <div className="mt-4 text-center text-muted-foreground text-sm">
                You are ranked <span className='font-bold text-foreground'>#{currentUserRankIndex + 1}</span> on the leaderboard.
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
