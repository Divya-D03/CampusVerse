'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Event } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === event.imageId);

  return (
    <div className="h-full group">
      <Card
        className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10"
      >
        <CardHeader className="p-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {image && (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={image.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            {event.coins > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-white font-bold bg-black/40 backdrop-blur-sm p-1.5 px-2.5 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{event.coins}</span>
                </div>
            )}
            <div className="absolute bottom-0 left-0 p-5">
                 <CardTitle className="font-headline text-2xl text-white ">{event.title}</CardTitle>
                 <CardDescription className="text-white/80 mt-1">{event.date}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
        </CardContent>
        <CardFooter className="p-5 pt-0">
            <Button asChild variant="outline" className="w-full border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
                <Link href={`/events/${event.id}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
