
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UMLHelp from './UMLHelp';

interface DeveloperPanelProps {
  onCommandGenerated: (command: string) => void;
  plantUMLCode?: string;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onCommandGenerated, plantUMLCode = '' }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          PlantUML Code:
        </div>
        <UMLHelp />
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="text-xs text-muted-foreground mb-2">
          Use this code with a PlantUML plugin or at <a href="https://www.planttext.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">planttext.com</a>
        </div>
        <Textarea
          value={plantUMLCode}
          readOnly
          placeholder="Create a diagram to generate PlantUML code..."
          className="font-mono text-xs flex-1 h-[calc(100%-120px)]"
        />
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
  );
};

export default DeveloperPanel;
