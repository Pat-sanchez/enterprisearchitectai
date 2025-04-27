
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
        <Textarea
          value={plantUMLCode}
          readOnly
          placeholder="Complete the wizard to generate PlantUML code..."
          className="font-mono text-xs flex-1 h-[calc(100%-80px)]"
        />
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(plantUMLCode);
              toast.success('PlantUML code copied to clipboard');
            }}
            className="flex-1"
            disabled={!plantUMLCode}
          >
            Copy Code
          </Button>
          <Button
            onClick={() => onCommandGenerated(plantUMLCode)}
            className="flex-1"
            variant="secondary"
            disabled={!plantUMLCode}
          >
            Update Diagram
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPanel;
