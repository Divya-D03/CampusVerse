import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { EventCard } from './event-card';

const statusLegend = [
  { status: 'Available', color: 'bg-green-500' },
  { status: 'Almost Full', color: 'bg-orange-500' },
  { status: 'Ended', color: 'bg-red-500' },
  { status: 'On-Spot Registration', color: 'bg-blue-500' },
  { status: 'Ongoing', color: 'bg-gray-500' },
];

export function EventTabs() {
  const { events } = useAuth();

  const culturalEvents = events.filter(e => e.category === 'cultural');
  const hackathons = events.filter(e => e.category === 'hackathon');
  const ideathons = events.filter(e => e.category === 'ideathon');
  const projectExpos = events.filter(e => e.category === 'project-expo');
  const clubs = events.filter(e => e.category === 'club');
  const techWorkshops = events.filter(e => e.category === 'tech');

  return (
    <>
      <Tabs defaultValue="cultural" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3">
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
          <Tabs defaultValue="hackathons" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="ideathons">Ideathons</TabsTrigger>
              <TabsTrigger value="expos">Project Expos</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
            </TabsList>
            <TabsContent value="hackathons" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="ideathons" className="mt-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideathons.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
             <TabsContent value="expos" className="mt-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectExpos.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="workshops" className="mt-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {techWorkshops.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="clubs" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <EventCard key={club.id} event={club} />
            ))}
          </div>
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
