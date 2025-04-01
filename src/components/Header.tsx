
import React from 'react';
import { Server, Settings, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Server className="h-6 w-6 text-primary" />
          <h1 className="font-semibold text-lg">EnterpriseArchitect AI</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" title="Export Diagram">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="Help">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
