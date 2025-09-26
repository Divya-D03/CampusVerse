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
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-transparent p-0 mb-8">
          <TabsTrigger value="cultural" className="text-base font-semibold pb-2 rounded-none bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent">
            <Paintbrush className="mr-2 h-5 w-5" />
            Cultural
          </TabsTrigger>
          <TabsTrigger value="tech" className="text-base font-semibold pb-2 rounded-none bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent">
            <Code className="mr-2 h-5 w-5" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="clubs" className="text-base font-semibold pb-2 rounded-none bg-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent">
            <Users className="mr-2 h-5 w-5" />
            Clubs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cultural" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {culturalEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tech" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="clubs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubs.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
