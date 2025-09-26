'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/app-header';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { EventTabs } from '@/components/dashboard/event-tabs';
import { WelcomeDialog } from '@/components/dashboard/welcome-dialog';
import Confetti from '@/components/effects/confetti';
import { UserDetailsDialog } from '@/components/dashboard/name-dialog';
import { ClubMemberProof } from '@/components/dashboard/club-member-proof';
import { Chatbot } from '@/components/chatbot/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { culturalEvents, hackathons, techEvents } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading, isFirstLogin, markFirstLoginDone } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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
    // This is dummy data for demonstration. In a real app, you'd fetch this.
    const allEvents = [...culturalEvents, ...hackathons, ...techEvents];
    const wonEvents = allEvents.slice(2, 3);
    
    const wonEventsCount = wonEvents.length;

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
  }, []);

  const handleWelcomeDialogClose = () => {
    setShowWelcome(false);
    markFirstLoginDone();
  };

  const handleDetailsDialogClose = () => {
    setShowDetailsDialog(false);
    // After name is submitted, we might want to show the welcome dialog
    if(isFirstLogin){
      setShowWelcome(true);
    }
  };

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen">
      {showWelcome && <Confetti />}
      <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeDialogClose} />
      <UserDetailsDialog open={showDetailsDialog} onOpenChange={handleDetailsDialogClose} />
      
      <AppHeader />
      <ScrollArea className="flex-1">
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome{user.name ? `, ${user.name}` : ''} to CampusVerse</h1>
                  <Badge variant="outline" className={cn("text-base", rankStyles)}>
                      {rank}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-8">Your central hub for all university events and clubs.</p>
              {user.role === 'Club Member' && <ClubMemberProof />}
            </div>
            <EventTabs />
          </div>
        </main>
      </ScrollArea>
      <Chatbot />
    </div>
  );
}
