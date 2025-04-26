
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import DiagramCanvas from '@/components/DiagramCanvas';

const Index = () => {
  const [currentCommand, setCurrentCommand] = useState<string | undefined>();

  const handleUserMessage = (message: string) => {
    console.log('User message received:', message);
    // Clear and then set the command to ensure the effect triggers even if the same command is sent twice
    setCurrentCommand(undefined);
    setTimeout(() => {
      setCurrentCommand(message);
    }, 10);
  };

  const handleAiResponse = (message: any) => {
    console.log('AI response:', message);
    // No need to set the command again from AI response
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header />
      
      <div className="flex-1 container mx-auto p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="h-full flex flex-col">
            <div className="rounded-xl overflow-hidden shadow-lg h-full border border-border/50">
              <ChatInterface 
                onMessage={handleUserMessage}
                onAiResponse={handleAiResponse}
              />
            </div>
          </div>
          
          <div className="h-full flex flex-col">
            <div className="rounded-xl overflow-hidden shadow-lg h-full border border-border/50">
              <DiagramCanvas command={currentCommand} />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t py-3 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Create enterprise architecture diagrams through conversation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
