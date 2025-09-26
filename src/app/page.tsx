'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { WelcomeDialog } from '@/components/dashboard/welcome-dialog';
import Confetti from '@/components/effects/confetti';
import { UserDetailsDialog } from '@/components/dashboard/name-dialog';
import { ClubMemberProof } from '@/components/dashboard/club-member-proof';
import { Chatbot } from '@/components/chatbot/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { culturalEvents, hackathons, techEvents, clubs } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trophy, Paintbrush, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaderboardDialog } from '@/components/dashboard/leaderboard-dialog';
import { EventCard } from '@/components/dashboard/event-card';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import type { EventCategory } from '@/lib/types';

const categoryComponents = {
  cultural: culturalEvents,
  tech: [...hackathons, ...techEvents],
  clubs: clubs,
};

export default function DashboardPage() {
  const { user, loading, isFirstLogin, markFirstLoginDone, allUsers } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const activeCategory = (searchParams.get('category') as EventCategory) || 'cultural';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (!loading && user && isFirstLogin) {
      if (!user.name) {
        setShowDetailsDialog(true);
      } else {
        setShowWelcome(true);
      }
    }
  }, [user, loading, isFirstLogin]);

  const { rank, rankStyles } = useMemo(() => {
    const allEvents = [...culturalEvents, ...hackathons, ...techEvents];
    const wonEvents = allEvents.slice(2, 3);
    
    const wonEventsCount = user?.eventsWon || wonEvents.length;

    let rank: 'Newbie' | 'Pro' | 'Master' | 'Grandmaster' = 'Newbie';
    let rankStyles = 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    if (wonEventsCount >= 20) {
        rank = 'Grandmaster';
        rankStyles = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    } else if (wonEventsCount >= 10) {
        rank = 'Master';
        rankStyles = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    } else if (wonEventsCount >= 5) {
        rank = 'Pro';
        rankStyles = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    return { rank, rankStyles };
  }, [user]);

  const handleWelcomeDialogClose = () => {
    setShowWelcome(false);
    markFirstLoginDone();
  };

  const handleDetailsDialogClose = () => {
    setShowDetailsDialog(false);
    if(isFirstLogin){
      setShowWelcome(true);
    }
  };

  if (loading || !user) {
    return <LoadingScreen />;
  }
  
  const CategoryIcon = activeCategory === 'cultural' ? Paintbrush : activeCategory === 'tech' ? Code : Users;
  const categoryTitle = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        {showWelcome && <Confetti />}
        <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeDialogClose} />
        <UserDetailsDialog open={showDetailsDialog} onOpenChange={handleDetailsDialogClose} />
        <LeaderboardDialog open={showLeaderboard} onOpenChange={setShowLeaderboard} users={allUsers} />
        
        <Sidebar>
            <AppSidebar />
        </Sidebar>

        <SidebarInset>
            <ScrollArea className="flex-1">
            <main className="p-6 sm:p-8 md:p-12">
                <div className="max-w-7xl mx-auto w-full">
                <div className="flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <CategoryIcon className="w-8 h-8" />
                                {categoryTitle} Events
                            </h1>
                            <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger>
                                    <Badge variant="outline" className={cn("text-base", rankStyles)}>
                                    {rank}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-center">
                                    <p className="font-bold">Rank Progression</p>
                                    <ul className="list-none text-left text-sm text-muted-foreground mt-2 space-y-1">
                                        <li><span className="font-semibold text-foreground">Pro:</span> 5 wins</li>
                                        <li><span className="font-semibold text-foreground">Master:</span> 10 wins</li>
                                        <li><span className="font-semibold text-foreground">Grandmaster:</span> 20+ wins</li>
                                    </ul>
                                    </div>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Button variant="outline" onClick={() => setShowLeaderboard(true)} className="neumorphic-raised-interactive">
                            <Trophy className="w-4 h-4 mr-2" />
                            Leaderboard
                        </Button>
                    </div>
                    {user.role === 'Club Member' && <ClubMemberProof />}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {(categoryComponents[activeCategory] || []).map((event) => (
                    <EventCard key={event.id} event={event} />
                    ))}
                </div>
                </div>
            </main>
            </ScrollArea>
            <Chatbot />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
