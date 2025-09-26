'use server';
/**
 * @fileOverview A chatbot flow to answer user questions about events.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chat function.
 * - ChatbotOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchEventsTool } from '../tools/event-tool';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  content: z.string(),
});

const ChatbotInputSchema = z.object({
  history: z.array(MessageSchema),
  query: z.string().describe("The user's latest query."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot's response."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chat(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  tools: [searchEventsTool],
  prompt: `You are a helpful assistant for a college events app. Your ONLY job is to answer questions about event details and availability.

- Use the searchEvents tool to find information about cultural events, hackathons, or club activities.
- If an event is found, reply with the event name, date, and status.
- Use these statuses:
  - 🔴 for 'Ended'
  - 🟡 for 'Almost Full' or 'On-Spot Registration'
  - 🟢 for 'Available' or 'Ongoing'
- If no event is found for the user's query, politely say that the event is not found. Do not say 'anything is available.'
- Keep your answers short, clear, and helpful.

Here's the conversation history:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

User's new question:
{{{query}}}

Your response:
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
