
import React, { useState, useEffect } from 'react';
import { Element, generatePlantUMLCode } from '@/lib/diagramUtils';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
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

  // Update when external PlantUML code changes
  useEffect(() => {
    if (externalPlantUMLCode) {
      setPlantUMLCode(externalPlantUMLCode);
    }
  }, [externalPlantUMLCode]);

  const handleReset = () => {
    setElements([]);
    setPlantUMLCode('');
    
    if (onElementsChange) {
      onElementsChange([]);
    }
    
    toast.info('Diagram reset');
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900 flex justify-between items-center">
        <h2 className="font-medium">Diagram Preview</h2>
        <div className="flex items-center space-x-1">
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
      
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
        {plantUMLCode ? (
          <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-xs font-mono overflow-auto">
            {plantUMLCode}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Complete the wizard to generate a diagram
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagramCanvas;
