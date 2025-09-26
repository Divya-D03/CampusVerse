'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/app-header';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { EventTabs } from '@/components/dashboard/event-tabs';
import { WelcomeDialog } from '@/components/dashboard/welcome-dialog';
import Confetti from '@/components/effects/confetti';
import { UserDetailsDialog } from '@/components/dashboard/name-dialog';
import { ClubMemberProof, useClubMemberVerification } from '@/components/dashboard/club-member-proof';
import { Chatbot } from '@/components/chatbot/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { HostEventDialog } from '@/components/dashboard/host-event-dialog';

export default function DashboardPage() {
  const { user, loading, isFirstLogin, markFirstLoginDone } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHostEventDialog, setShowHostEventDialog] = useState(false);
  const { isVerified } = useClubMemberVerification();


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
      <HostEventDialog open={showHostEventDialog} onOpenChange={setShowHostEventDialog} />
      
      <AppHeader />
      <ScrollArea className="flex-1">
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome{user.name ? `, ${user.name}` : ''} to CampusVerse</h1>
                {user.role === 'Club Member' && isVerified && (
                  <Button onClick={() => setShowHostEventDialog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Host an Event
                  </Button>
                )}
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
