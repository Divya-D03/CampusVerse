'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { type Event, type EventStatus } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RegistrationDialog } from '@/components/dashboard/RegistrationDialog';
import { Calendar, Coins, ArrowLeft, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles: Record<EventStatus, string> = {
  Available: 'bg-green-500/20 text-green-400 border-green-500/30',
  'Almost Full': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Ended: 'bg-red-500/20 text-red-400 border-red-500/30',
  'On-Spot Registration': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Ongoing: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function EventDetailsPage() {
  const { user, loading, events } = useAuth();
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
    if (id && events.length > 0) {
      const foundEvent = events.find((e) => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        // If event not found, maybe redirect to a 404 page or home
        router.replace('/');
      }
    }
  }, [id, events, router]);

  if (loading || !user || !event) {
    return <LoadingScreen />;
  }
  
  const image = PlaceHolderImages.find((img) => img.id === event.imageId);
  const isRegistrationDisabled = event.status === 'Ended' || event.status === 'Ongoing';

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
            
            <Card className="neumorphic-flat overflow-hidden">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3">
                  {image && (
                    <div className="relative aspect-[16/9] w-full h-full">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 p-6 flex flex-col">
                  <div className="flex-grow">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex justify-between items-start gap-4">
                          <CardTitle className="font-headline text-2xl md:text-3xl">{event.title}</CardTitle>
                          <Badge variant="outline" className={cn("text-sm", statusStyles[event.status])}>
                              {event.status}
                          </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-base text-muted-foreground pt-2">
                        <Calendar className="w-5 h-5" />
                        <span>{event.date}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4 text-base">
                      <p className="text-foreground/80 text-sm">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {event.coins > 0 && (
                            <div className="flex items-center gap-3 text-md text-yellow-400 p-2 bg-yellow-500/10 rounded-lg">
                                <Coins className="w-5 h-5" />
                                <span className="font-medium">Win {event.coins} coins!</span>
                            </div>
                        )}
                        {event.registrationFee && event.registrationFee > 0 && (
                            <div className="flex items-center gap-3 text-md text-primary p-2 bg-primary/10 rounded-lg">
                                <Ticket className="w-5 h-5" />
                                <span className="font-medium flex items-center gap-1">Fee: <Coins className="w-4 h-4 text-yellow-400" /> {event.registrationFee}</span>
                            </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={() => setShowRegistration(true)} 
                      disabled={isRegistrationDisabled}
                      className={cn(
                        "w-full neumorphic-raised-interactive group relative flex items-center justify-center p-4 rounded-lg overflow-hidden transition-all duration-300",
                        isRegistrationDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg",
                      )}
                    >
                      <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center border-r-2 border-dashed border-background/50">
                        <Ticket className={cn("w-8 h-8 transition-transform duration-300 group-hover:rotate-12", isRegistrationDisabled ? "text-muted-foreground" : "text-primary")} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{isRegistrationDisabled ? 'Registration Closed' : 'Register Now'}</p>
                        <p className="text-sm text-muted-foreground">{isRegistrationDisabled ? event.status : 'Click to join the event'}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
