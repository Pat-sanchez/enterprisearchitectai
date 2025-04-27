import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import DiagramCanvas from '@/components/DiagramCanvas';
import WizardPanel from '@/components/WizardPanel';
import DeveloperPanel from '@/components/DeveloperPanel';
import TemplatesDialog from '@/components/TemplatesDialog';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import HelpDocumentationDialog from '@/components/HelpDocumentationDialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { exportAsSVG, exportAsPNG, exportAsJSON } from '@/lib/exportUtils';
import { Element } from '@/lib/diagramUtils';
import { useHotkeys } from '@/hooks/useHotkeys';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  const [currentCommand, setCurrentCommand] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'wizard' | 'import'>('wizard');
  const [showingDiagram, setShowingDiagram] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showHelpDocs, setShowHelpDocs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [plantUMLCode, setPlantUMLCode] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(true);

  const handleUserMessage = (message: string) => {
    console.log('User message received:', message);
    
    if (message.includes('@startuml') || message.includes('!theme')) {
      setPlantUMLCode(message);
    } else {
      setCurrentCommand(undefined);
      setTimeout(() => {
        setCurrentCommand(message);
      }, 10);
    }
  };

  const handleNewDiagram = () => {
    setCurrentCommand(undefined);
    setShowingDiagram(false);
    setElements([]);
  };

  const handleSaveDiagram = () => {
    console.log('Save diagram triggered');
    localStorage.setItem('savedDiagram', JSON.stringify(elements));
    toast.success('Diagram saved to local storage');
  };

  const handleResetDiagram = () => {
    setCurrentCommand('reset');
    setElements([]);
  };

  const handleBackToWizard = () => {
    setShowingDiagram(false);
  };

  const handleWizardComplete = (message: string) => {
    if (message.includes('@startuml') || message.includes('!theme')) {
      setPlantUMLCode(message);
    } else {
      handleUserMessage(message);
    }
    setShowingDiagram(true);
  };

  const handleExportDiagram = (format: 'png' | 'svg' | 'json') => {
    if (format === 'svg') {
      exportAsSVG(svgRef.current);
      toast.success('Diagram exported as SVG');
    } else if (format === 'png') {
      exportAsPNG(svgRef.current);
      toast.success('Diagram exported as PNG');
    } else if (format === 'json') {
      exportAsJSON(elements);
      toast.success('Diagram exported as JSON');
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    console.log('Restore version triggered:', versionId);
    toast.success(`Restored to version ${versionId}`);
  };

  const handleFocusElement = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      console.log('Focusing element:', element);
      toast.info(`Focused on element: ${element.label || element.type}`);
    }
  };

  useHotkeys([
    { keys: 'ctrl+n', callback: handleNewDiagram },
    { keys: 'ctrl+s', callback: handleSaveDiagram },
    { keys: 'ctrl+z', callback: () => toast.info('Undo action') },
    { keys: 'ctrl+y', callback: () => toast.info('Redo action') },
    { keys: 'ctrl+e', callback: () => handleExportDiagram('svg') },
    { keys: 'shift+?', callback: () => setShowKeyboardShortcuts(true) },
    { keys: 'ctrl+f', callback: () => setShowSearch(true) },
  ]);

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-background to-secondary/30">
      <Header 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'wizard' | 'import')}
        onNewDiagram={handleNewDiagram}
        onSaveDiagram={handleSaveDiagram}
        onResetDiagram={handleResetDiagram}
        onBackToWizard={handleBackToWizard}
        showWizardControls={showingDiagram}
        onExportDiagram={handleExportDiagram}
        onShowTemplates={() => setShowTemplatesDialog(true)}
        onShowHistory={() => setShowVersionHistory(true)}
        onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
        onShowHelp={() => setShowHelpDocs(true)}
      />
      
      <div className="flex-1 container mx-auto p-6 overflow-hidden flex flex-col">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="min-h-[500px] rounded-xl border"
        >
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle>Onboarding</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <WizardPanel 
                    onCommandGenerated={handleWizardComplete}
                    hidden={showingDiagram}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={70}>
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle>Whiteboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DiagramCanvas 
                  command={currentCommand} 
                  svgRef={svgRef}
                  onElementsChange={setElements}
                  plantUMLCode={plantUMLCode}
                />
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>

        <Collapsible
          open={isDevPanelOpen}
          onOpenChange={setIsDevPanelOpen}
          className="mt-4 border rounded-xl"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="font-semibold">Developer Mode</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isDevPanelOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="p-4 h-[300px]">
              <ScrollArea className="h-full">
                <DeveloperPanel 
                  onCommandGenerated={handleUserMessage}
                  plantUMLCode={plantUMLCode}
                />
              </ScrollArea>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <footer className="border-t py-3 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Create enterprise architecture diagrams through guided wizards or imports</p>
        </div>
      </footer>
      
      <TemplatesDialog
        open={showTemplatesDialog}
        onClose={() => setShowTemplatesDialog(false)}
        onSelectTemplate={handleUserMessage}
      />
      
      <VersionHistoryDialog
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestoreVersion={handleRestoreVersion}
      />
      
      <KeyboardShortcutsDialog
        open={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      
      <HelpDocumentationDialog
        open={showHelpDocs}
        onClose={() => setShowHelpDocs(false)}
      />
    </div>
  );
};

export default Index;
