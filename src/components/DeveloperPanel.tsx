
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import UMLHelp from './UMLHelp';

interface DeveloperPanelProps {
  onCommandGenerated: (command: string) => void;
  plantUMLCode?: string;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onCommandGenerated, plantUMLCode = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Code size={16} />
            Developer Mode
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <UMLHelp />
        </div>
        
        {isExpanded && (
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  PlantUML Code:
                </label>
                <div className="text-xs text-muted-foreground mb-2">
                  Use this code with a PlantUML plugin or at <a href="https://www.planttext.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">planttext.com</a>
                </div>
                <Textarea
                  value={plantUMLCode}
                  readOnly
                  placeholder="Create a diagram to generate PlantUML code..."
                  className="font-mono text-xs"
                  rows={10}
                />
              </div>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(plantUMLCode);
                  toast.success('PlantUML code copied to clipboard');
                }}
                className="w-full"
                disabled={!plantUMLCode}
              >
                Copy PlantUML Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPanel;
