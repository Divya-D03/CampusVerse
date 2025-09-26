'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, Loader, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chat } from '@/ai/flows/chatbot-flow';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/contexts/auth-context';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const viewportRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email.charAt(0).toUpperCase() || 'U');
  
  let userAvatar = '';
  if (user) {
    userAvatar = user.profilePicture || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`;
  }

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat({
        history: messages.map(m => ({role: m.role, content: m.content})),
        query: input,
      });
      const modelMessage: Message = { role: 'model', content: response.response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I am having trouble connecting. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-14 h-14 shadow-lg">
          {isOpen ? <X /> : <Bot />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-80 h-96 flex flex-col shadow-2xl holographic-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot /> CampusVerse Helper
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {message.role === 'model' && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=chatbot`} alt="Chatbot"/>
                           <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && user && (
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={userAvatar} alt={user.email} />
                           <AvatarFallback>{userInitial}</AvatarFallback>
                         </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=chatbot`} alt="Chatbot"/>
                        <AvatarFallback>B</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                        <Loader className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} size="icon" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
