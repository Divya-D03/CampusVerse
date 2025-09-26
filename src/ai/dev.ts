import { config } from 'dotenv';
config();

import '@/ai/flows/generate-event-description.ts';
import '@/ai/flows/chatbot-flow.ts';
import '@/ai/tools/event-tool.ts';
import '@/ai/flows/create-event.ts';
