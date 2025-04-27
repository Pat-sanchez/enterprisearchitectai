
import React, { useState, useEffect } from 'react';
import { Element, generatePlantUMLCode } from '@/lib/diagramUtils';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

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

  // Parse PlantUML code and generate SVG elements
  const renderDiagram = () => {
    if (!plantUMLCode) return null;

    const lines = plantUMLCode.split('\n');
    const diagramElements: JSX.Element[] = [];
    const padding = 20;
    let yOffset = padding;
    const itemHeight = 60;
    const itemWidth = 120;
    const arrowLength = 40;

    lines.forEach((line, index) => {
      if (line.includes('database') || line.includes('[') || 
          line.includes('component') || line.includes('interface')) {
        // Extract label from line
        const label = line.match(/"([^"]+)"|(\[[^\]]+\])/)?.[1] || 'Element';
        
        // Create a rectangle or database symbol
        if (line.includes('database')) {
          diagramElements.push(
            <g key={`element-${index}`} transform={`translate(50, ${yOffset})`}>
              <path 
                d="M 0,10 C 0,4.5 26.5,0 60,0 C 93.5,0 120,4.5 120,10 L 120,50 C 120,55.5 93.5,60 60,60 C 26.5,60 0,55.5 0,50 L 0,10"
                fill="#fff" 
                stroke="#000" 
                strokeWidth="2"
              />
              <text x="60" y="35" textAnchor="middle">{label}</text>
            </g>
          );
        } else {
          diagramElements.push(
            <g key={`element-${index}`} transform={`translate(50, ${yOffset})`}>
              <rect 
                width={itemWidth} 
                height={itemHeight} 
                rx="4"
                fill="#fff"
                stroke="#000"
                strokeWidth="2"
              />
              <text x="60" y="35" textAnchor="middle">{label}</text>
            </g>
          );
        }
        yOffset += itemHeight + padding;
      } else if (line.includes('-->')) {
        // Draw arrows between elements
        const elements = line.split('-->').map(s => s.trim());
        if (elements.length === 2) {
          const startY = (elements[0].length * itemHeight) / 2;
          const endY = (elements[1].length * itemHeight) / 2;
          
          diagramElements.push(
            <g key={`arrow-${index}`}>
              <path
                d={`M ${itemWidth + 50} ${startY} L ${itemWidth + 50 + arrowLength} ${endY}`}
                stroke="#000"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        }
      }
    });

    return (
      <svg 
        ref={svgRef}
        width="100%" 
        height={yOffset + padding} 
        viewBox={`0 0 ${itemWidth + 100} ${yOffset + padding}`}
        className="bg-white"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
          </marker>
        </defs>
        {diagramElements}
      </svg>
    );
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
          <div className="space-y-4">
            {renderDiagram()}
            <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-xs font-mono overflow-auto">
              {plantUMLCode}
            </pre>
          </div>
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

