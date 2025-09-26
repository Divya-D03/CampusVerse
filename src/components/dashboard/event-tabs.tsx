import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { EventCard } from './event-card';
import { Paintbrush, Code, Users } from 'lucide-react';

export function EventTabs() {
  const { events } = useAuth();

  const culturalEvents = events.filter((event) => event.category === 'cultural');
  const techEvents = events.filter((event) =>
    ['hackathon', 'tech', 'ideathon', 'project-expo'].includes(event.category)
  );
  const clubs = events.filter((event) => event.category === 'club');


  return (
    <>
      <Tabs defaultValue="cultural" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="cultural">
            <Paintbrush className="mr-2 h-5 w-5" />
            Cultural
          </TabsTrigger>
          <TabsTrigger value="tech">
            <Code className="mr-2 h-5 w-5" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="clubs">
            <Users className="mr-2 h-5 w-5" />
            Clubs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cultural">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {culturalEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tech">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {techEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="clubs">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {clubs.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
