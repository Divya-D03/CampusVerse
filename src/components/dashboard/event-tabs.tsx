import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { culturalEvents, hackathons, techEvents, clubs } from '@/lib/placeholder-data';
import { EventCard } from './event-card';

export function EventTabs() {
  const allTechEvents = [...techEvents, ...hackathons];

  return (
    <Tabs defaultValue="cultural">
      <TabsList className="grid w-full grid-cols-3 h-auto">
        <TabsTrigger value="cultural">Cultural</TabsTrigger>
        <TabsTrigger value="tech">Tech</TabsTrigger>
        <TabsTrigger value="clubs">Clubs</TabsTrigger>
      </TabsList>
      <TabsContent value="cultural" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {culturalEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="tech" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTechEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </TabsContent>
       <TabsContent value="clubs" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <EventCard key={club.id} event={club} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
