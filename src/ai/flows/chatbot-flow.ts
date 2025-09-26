'use server';
/**
 * @fileOverview A chatbot flow to answer user questions.
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
  query: z.string().describe('The user\'s latest query.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
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
  prompt: `You are a friendly and helpful chatbot for CampusVerse, a university event hub application.
Your goal is to assist users with their questions about events, clubs, coins, and how to use the app.
Be concise and clear in your answers.
If you use a tool, do not start your response with "Based on the tool output...". Just give the answer directly.

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
