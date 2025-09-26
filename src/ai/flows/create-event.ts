'use server';
/**
 * @fileOverview A flow to create a new event.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { EventCategory } from '@/lib/types';

const CreateEventInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  description: z.string().describe('The description of the event.'),
  date: z.string().describe('The date of the event.'),
  coins: z.number().describe('The number of coins offered as a prize.'),
  category: z.enum(['cultural', 'hackathon', 'ideathon', 'project-expo', 'tech', 'club']).describe('The category of the event.'),
});
export type CreateEventInput = z.infer<typeof CreateEventInputSchema>;

const CreateEventOutputSchema = z.object({
  success: z.boolean(),
  eventId: z.string().optional(),
  message: z.string(),
});
export type CreateEventOutput = z.infer<typeof CreateEventOutputSchema>;

export async function createEvent(input: CreateEventInput): Promise<CreateEventOutput> {
  return createEventFlow(input);
}

const createEventFlow = ai.defineFlow(
  {
    name: 'createEventFlow',
    inputSchema: CreateEventInputSchema,
    outputSchema: CreateEventOutputSchema,
  },
  async (input) => {
    // In a real application, you would save this to a database.
    // For now, we'll just log it and return a success message.
    console.log('Creating event:', input);
    
    const newEventId = `evt-${Date.now()}`;

    // Here you would interact with your database to create the event.
    // Since we don't have a database, we'll just simulate success.
    
    return {
      success: true,
      eventId: newEventId,
      message: `Event '${input.title}' created successfully.`,
    };
  }
);
