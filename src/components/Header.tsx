
import React from 'react';
import { Code, Download, Settings, HelpCircle, FileImage, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeaderProps {
  activeTab: 'wizard' | 'import';
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm">
            <Code 
              className="h-6 w-6 text-primary transform transition-transform duration-300 hover:rotate-12 hover:scale-110" 
              strokeWidth={1.5}
            />
          </div>
          <h1 className="font-semibold text-lg tracking-tight flex items-center">
            <span>Archi</span>
            <span className="text-xs bg-primary text-white rounded-full px-2 ml-2 py-0.5">AI</span>
          </h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
          <TabsList className="bg-transparent">
            <TabsTrigger value="wizard" className="data-[state=active]:bg-primary/10">
              <Code className="h-4 w-4 mr-2" /> Wizard
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-primary/10">
              <Upload className="h-4 w-4 mr-2" /> Import
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10" title="Export Diagram">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10" title="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10" title="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
