'use server';
/**
 * @fileOverview A tool for searching university events.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { culturalEvents, hackathons, techEvents, clubs, ideathons, projectExpos } from '@/lib/placeholder-data';
import { Event } from '@/lib/types';

const allEvents: Event[] = [...culturalEvents, ...hackathons, ...techEvents, ...clubs, ...ideathons, ...projectExpos];

export const searchEventsTool = ai.defineTool(
  {
    name: 'searchEvents',
    description: 'Search for university events based on a query. Can filter by event type or search by name.',
    inputSchema: z.object({
      query: z.string().describe('The search query, e.g., "hackathons", "music fest", "coding workshops".'),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        date: z.string(),
        status: z.string(),
        coins: z.number(),
      })
    ),
  },
  async ({ query }) => {
    const lowerCaseQuery = query.toLowerCase();
    
    // A simple search implementation
    const results = allEvents.filter(event => 
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery) ||
      event.imageId.toLowerCase().includes(lowerCaseQuery)
    );

    return results;
  }
);
