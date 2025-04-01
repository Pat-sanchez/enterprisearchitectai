
import React, { useState, useRef, useEffect } from 'react';
import { Element, processCommand } from '@/lib/diagramUtils';
import ArchitecturalElement from './ArchitecturalElement';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface DiagramCanvasProps {
  command?: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ command }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [scale, setScale] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Process commands when they arrive
  useEffect(() => {
    if (command) {
      const newElements = processCommand(command, elements);
      setElements(newElements);
    }
  }, [command]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setElements([]);
    setScale(1);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900 flex justify-between items-center">
        <h2 className="font-medium">Enterprise Architecture Diagram</h2>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto canvas-container">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          className="min-h-[600px]"
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
              <polygon points="0 0, 10 3.5, 0 7" className="fill-gray-400" />
            </marker>
          </defs>
          <g>
            {elements.map((element) => (
              <ArchitecturalElement key={element.id} element={element} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramCanvas;
