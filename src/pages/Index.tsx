
import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import DiagramCanvas from '@/components/DiagramCanvas';
import WizardPanel from '@/components/WizardPanel';
import ImportPanel from '@/components/ImportPanel';
import DeveloperPanel from '@/components/DeveloperPanel';
import DiagramSearchPanel from '@/components/DiagramSearchPanel';
import TemplatesDialog from '@/components/TemplatesDialog';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';
import KeyboardShortcutsDialog from '@/components/KeyboardShortcutsDialog';
import HelpDocumentationDialog from '@/components/HelpDocumentationDialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { exportAsSVG, exportAsPNG, exportAsJSON } from '@/lib/exportUtils';
import { Element } from '@/lib/diagramUtils';
import { useHotkeys } from '@/hooks/useHotkeys';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

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
  const svgRef = useRef<SVGSVGElement>(null);

  const handleUserMessage = (message: string) => {
    console.log('User message received:', message);
    setCurrentCommand(undefined);
    setTimeout(() => {
      setCurrentCommand(message);
    }, 10);
  };

  const handleNewDiagram = () => {
    setCurrentCommand(undefined);
    setShowingDiagram(false);
    setElements([]);
  };

  const handleSaveDiagram = () => {
    // For now just log, could be expanded to actually save the diagram
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
    handleUserMessage(message);
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
    // For demo purposes, we'll just show a toast
    console.log('Restore version triggered:', versionId);
    toast.success(`Restored to version ${versionId}`);
  };

  const handleFocusElement = (elementId: string) => {
    // Find the element and focus it (highlight or scroll to it)
    const element = elements.find(el => el.id === elementId);
    if (element) {
      console.log('Focusing element:', element);
      toast.info(`Focused on element: ${element.label || element.type}`);
      // In a real implementation, we would scroll/zoom to the element
    }
  };

  // Register keyboard shortcuts
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-secondary/30">
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
      
      <div className="flex-1 container mx-auto p-6 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl border border-border/50">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              {activeTab === 'wizard' ? (
                <WizardPanel 
                  onCommandGenerated={handleWizardComplete}
                  hidden={showingDiagram}
                />
              ) : (
                <ImportPanel onCommandGenerated={handleUserMessage} />
              )}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full relative">
              <DiagramCanvas 
                command={currentCommand} 
                svgRef={svgRef}
                onElementsChange={setElements}
              />
              
              {elements.length > 0 && (
                <Drawer open={showSearch} onOpenChange={setShowSearch}>
                  <DrawerTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute top-4 right-4 z-10"
                      onClick={() => setShowSearch(true)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="container max-w-sm mx-auto p-4">
                      <h3 className="font-semibold mb-4 text-center">Search Elements</h3>
                      <DiagramSearchPanel 
                        elements={elements} 
                        onElementClick={handleFocusElement}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <DeveloperPanel onCommandGenerated={handleUserMessage} />
      
      <footer className="border-t py-3 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Create enterprise architecture diagrams through guided wizards or imports</p>
        </div>
      </footer>
      
      {/* Dialogs */}
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
