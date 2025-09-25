import Image from 'next/image';
import { type Event, type EventStatus } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Award } from 'lucide-react';

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
    <Card className="holographic-card flex flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1">
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
        {event.coupons > 0 && (
            <div className="flex items-center gap-2 text-sm text-accent-foreground p-2 bg-accent/10 rounded-md">
                <Award className="w-4 h-4 text-accent" />
                <span className="font-medium">Win up to {event.coupons} coupons!</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <Badge variant="outline" className={cn(statusStyles[event.status])}>
          {event.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
