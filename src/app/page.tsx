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
import { ClubMemberProof } from '@/components/dashboard/club-member-proof';
import { Chatbot } from '@/components/chatbot/chatbot';

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
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
          <div className="flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Welcome{user.name ? `, ${user.name}` : ''} to CampusVerse</h1>
            <p className="text-muted-foreground mb-8">Your central hub for all university events and clubs.</p>
            {user.role === 'Club Member' && <ClubMemberProof />}
          </div>
          <EventTabs />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
