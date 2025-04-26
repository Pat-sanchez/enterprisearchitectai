import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import UMLHelp from './UMLHelp';

interface DeveloperPanelProps {
  onCommandGenerated: (command: string) => void;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onCommandGenerated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState('');

  const handleCodeSubmit = () => {
    try {
      const lines = code.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const [type, label] = line.split(':').map(s => s.trim());
        
        switch (type.toLowerCase()) {
          case 'service':
          case 'database':
          case 'api':
          case 'microservice':
          case 'system':
          case 'component':
            onCommandGenerated(`add ${type} ${label || type}`);
            break;
          case 'connect':
            onCommandGenerated(`connect ${label || ''}`);
            break;
          default:
            toast.error(`Unknown type: ${type}`);
        }
      });
      
      toast.success('Diagram updated from code');
    } catch (error) {
      toast.error('Error processing code');
    }
  };

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
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Write your diagram code:
              </label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your diagram code here..."
                className="font-mono text-sm"
                rows={5}
              />
            </div>
            <Button onClick={handleCodeSubmit} className="w-full">
              Generate Diagram
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPanel;
