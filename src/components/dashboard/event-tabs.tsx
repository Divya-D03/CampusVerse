
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { culturalEvents, hackathons, techEvents, clubs, ideathons, projectExpos } from '@/lib/placeholder-data';
import { EventCard } from './event-card';
import { ScrollArea } from '../ui/scroll-area';

const statusLegend = [
  { status: 'Available', color: 'bg-green-500' },
  { status: 'Almost Full', color: 'bg-orange-500' },
  { status: 'Ended', color: 'bg-red-500' },
  { status: 'On-Spot Registration', color: 'bg-blue-500' },
  { status: 'Ongoing', color: 'bg-gray-500' },
];

export function EventTabs() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Tabs defaultValue="cultural" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 h-auto">
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 mt-6">
          <TabsContent value="cultural" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturalEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tech" className="mt-0">
            <Tabs defaultValue="hackathons" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                <TabsTrigger value="ideathons">Ideathons</TabsTrigger>
                <TabsTrigger value="expos">Project Expos</TabsTrigger>
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
            </Tabs>
          </TabsContent>
          <TabsContent value="clubs" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <EventCard key={club.id} event={club} />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      <div className="mt-4 pt-4 border-t border-dashed flex-shrink-0">
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
    </div>
  );
}
