'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { campusLocations } from '@/lib/campus-locations';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCard } from './event-card';
import type { Event, EventCategory } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CampusView() {
  const { events } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{
    title: string;
    categories: EventCategory[];
  } | null>(null);

  if (selectedLocation) {
    const filteredEvents = events.filter((event) =>
      selectedLocation.categories.includes(event.category)
    );

    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setSelectedLocation(null)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campus View
        </Button>
        <h2 className="text-3xl font-bold font-headline mb-6">
          Events at {selectedLocation.title}
        </h2>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No events currently scheduled here.</p>
            <p>Check back later for updates!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {campusLocations.map((location) => {
        const image = PlaceHolderImages.find((img) => img.id === location.imageId);
        const activeEvents = events.filter((event) =>
          location.categories.includes(event.category) && (event.status === 'Available' || event.status === 'Ongoing' || event.status === 'Almost Full' || event.status === 'On-Spot Registration')
        ).length;
        
        return (
          <div
            key={location.id}
            className="group relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => setSelectedLocation(location)}
          >
            {image && (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image.imageHint}
              />
            )}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
              activeEvents > 0 && "animate-pulse from-primary/50 via-primary/20"
            )}></div>
            
            {activeEvents > 0 && (
                 <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                    {activeEvents} Active
                </div>
            )}

            <div className="relative flex flex-col h-full p-6 justify-end text-white">
              <h3 className="text-3xl font-bold font-headline">{location.title}</h3>
              <p className="text-white/80">{location.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
