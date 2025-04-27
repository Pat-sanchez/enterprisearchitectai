import React, { useState, useEffect } from 'react';
import { Element, generatePlantUMLCode } from '@/lib/diagramUtils';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import PlantUMLViewer from './PlantUMLViewer';

interface DiagramCanvasProps {
  command?: string;
  svgRef?: React.RefObject<SVGSVGElement>;
  onElementsChange?: (elements: Element[]) => void;
  plantUMLCode?: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ 
  command, 
  svgRef, 
  onElementsChange,
  plantUMLCode: externalPlantUMLCode 
}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [plantUMLCode, setPlantUMLCode] = useState<string>(externalPlantUMLCode || '');
  
  useEffect(() => {
    if (command) {
      console.log('DiagramCanvas received command:', command);
      
      if (command.includes('@startuml') || command.includes('!theme')) {
        setPlantUMLCode(command);
      } else if (externalPlantUMLCode) {
        setPlantUMLCode(externalPlantUMLCode);
      }
      
      if (onElementsChange) {
        onElementsChange(elements);
      }
    }
  }, [command, externalPlantUMLCode]);

  const handleReset = () => {
    setElements([]);
    setPlantUMLCode('');
    
    if (onElementsChange) {
      onElementsChange([]);
    }
    
    toast.info('Diagram reset');
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(plantUMLCode);
    toast.success('PlantUML code copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900 flex justify-between items-center">
        <h2 className="font-medium">PlantUML Diagram</h2>
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopyCode} 
            title="Copy PlantUML Code"
            disabled={!plantUMLCode}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleReset} 
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <PlantUMLViewer plantUMLCode={plantUMLCode} />
      </div>
    </div>
  );
};

export default DiagramCanvas;
