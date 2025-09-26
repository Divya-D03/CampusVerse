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
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={image.imageHint}
            />
          )}
           {event.coins > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-sm text-white font-bold bg-black/40 backdrop-blur-sm p-1.5 px-2.5 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>{event.coins}</span>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="mt-2">{event.date}</CardDescription>
        <p className="text-sm text-muted-foreground mt-4 line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
