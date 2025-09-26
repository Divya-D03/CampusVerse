'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { type Event, type EventStatus } from '@/lib/types';
import { culturalEvents, hackathons, techEvents, clubs, ideathons, projectExpos } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RegistrationDialog } from '@/components/dashboard/RegistrationDialog';
import { Calendar, Coins, Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles: Record<EventStatus, string> = {
  Available: 'bg-green-500/20 text-green-400 border-green-500/30',
  'Almost Full': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Ended: 'bg-red-500/20 text-red-400 border-red-500/30',
  'On-Spot Registration': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Ongoing: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function EventDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (id) {
      const allEvents = [...culturalEvents, ...hackathons, ...techEvents, ...clubs, ...ideathons, ...projectExpos];
      const foundEvent = allEvents.find((e) => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        // Handle event not found, maybe redirect to a 404 page or back to home
        router.replace('/');
      }
    }
  }, [id, router]);

  if (loading || !user || !event) {
    return <LoadingScreen />;
  }
  
  const image = PlaceHolderImages.find((img) => img.id === event.imageId);

  return (
    <>
      <RegistrationDialog 
        event={event} 
        open={showRegistration} 
        onOpenChange={setShowRegistration} 
      />
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All Events
                </Link>
              </Button>
            </div>
            
            <Card className="holographic-card overflow-hidden">
              {image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <CardTitle className="font-headline text-3xl md:text-4xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span>{event.date}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={cn("text-base", statusStyles[event.status])}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-base">
                <p className="text-foreground/80">{event.description}</p>
                {event.coins > 0 && (
                    <div className="flex items-center gap-3 text-lg text-yellow-400 p-4 bg-yellow-500/10 rounded-lg">
                        <Coins className="w-6 h-6" />
                        <span className="font-medium">Win up to {event.coins} coins!</span>
                    </div>
                )}
                 <Button onClick={() => setShowRegistration(true)} size="lg" className="w-full sm:w-auto">
                  Register for this Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
