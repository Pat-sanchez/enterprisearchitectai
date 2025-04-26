
import React, { useState } from 'react';
import Header from '@/components/Header';
import DiagramCanvas from '@/components/DiagramCanvas';
import WizardPanel from '@/components/WizardPanel';
import ImportPanel from '@/components/ImportPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  const [currentCommand, setCurrentCommand] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'wizard' | 'import'>('wizard');

  const handleUserMessage = (message: string) => {
    console.log('User message received:', message);
    setCurrentCommand(undefined);
    setTimeout(() => {
      setCurrentCommand(message);
    }, 10);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as 'wizard' | 'import')} 
      />
      
      <div className="flex-1 container mx-auto p-6 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl border border-border/50">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              {activeTab === 'wizard' ? (
                <WizardPanel onCommandGenerated={handleUserMessage} />
              ) : (
                <ImportPanel onCommandGenerated={handleUserMessage} />
              )}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              <DiagramCanvas command={currentCommand} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <footer className="border-t py-3 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Create enterprise architecture diagrams through guided wizards or imports</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
