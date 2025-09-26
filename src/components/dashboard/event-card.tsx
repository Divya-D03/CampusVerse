'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Event, type EventStatus } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Ticket, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

type EventCardProps = {
  event: Event;
};

const statusStyles: Record<EventStatus, string> = {
  Available: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  'Almost Full': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  Full: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
  'On-Spot Registration': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
};

export function EventCard({ event }: EventCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === event.imageId);

  return (
    <div className="h-full group">
      <Card
        className="holographic-card flex flex-col h-full overflow-hidden"
      >
        <CardHeader>
          <div className="relative aspect-[3/2] w-full rounded-md overflow-hidden mb-4">
            {image && (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
          <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <p className="text-sm text-foreground/80">{event.description}</p>
          {event.coins > 0 && (
              <div className="flex items-center gap-2 text-sm text-accent-foreground p-2 bg-accent/10 rounded-md">
                  <Ticket className="w-4 h-4 text-accent" />
                  <span className="font-medium">Win up to {event.coins} coins!</span>
              </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4">
          <Badge variant="outline" className={cn(statusStyles[event.status])}>
            {event.status}
          </Badge>
          <Button asChild variant="secondary">
            <Link href={`/events/${event.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
