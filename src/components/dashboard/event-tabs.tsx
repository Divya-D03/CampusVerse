import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { EventCard } from './event-card';
import { CampusView } from './campus-view';
import { Paintbrush, Code, Users, Map } from 'lucide-react';

const statusLegend = [
  { status: 'Available', color: 'bg-green-500' },
  { status: 'Almost Full', color: 'bg-orange-500' },
  { status: 'Ended', color: 'bg-red-500' },
  { status: 'On-Spot Registration', color: 'bg-blue-500' },
  { status: 'Ongoing', color: 'bg-gray-500' },
];

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cultural">
            <Paintbrush className="mr-2 h-4 w-4" />
            Cultural
          </TabsTrigger>
          <TabsTrigger value="tech">
            <Code className="mr-2 h-4 w-4" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="clubs">
            <Users className="mr-2 h-4 w-4" />
            Clubs
          </TabsTrigger>
          <TabsTrigger value="campus-view">
            <Map className="mr-2 h-4 w-4" />
            Campus View
          </TabsTrigger>
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
            {techEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="clubs" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="campus-view" className="mt-6">
          <CampusView />
        </TabsContent>
      </Tabs>
      <div className="mt-8 pt-4 border-t border-dashed">
        <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">Status Legend</h3>
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
          {statusLegend.map(({ status, color }) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-sm text-muted-foreground">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
