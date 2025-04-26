
import React, { useState, useRef, useEffect } from 'react';
import { Element, processCommand } from '@/lib/diagramUtils';
import ArchitecturalElement from './ArchitecturalElement';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"

interface DiagramCanvasProps {
  command?: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ command }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [scale, setScale] = useState(1);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
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

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    setDraggedElement(id);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedElement || !svgRef.current) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setElements(prev => prev.map(elem => {
      if (elem.id === draggedElement) {
        return {
          ...elem,
          position: {
            x: svgPoint.x - (elem.size.width / 2),
            y: svgPoint.y - (elem.size.height / 2)
          }
        };
      }
      return elem;
    }));
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleRename = (id: string, newLabel: string) => {
    setElements(prev => prev.map(elem => {
      if (elem.id === id) {
        return {
          ...elem,
          label: newLabel
        };
      }
      return elem;
    }));
    setEditingLabel(null);
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
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
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
              <ContextMenu key={element.id}>
                <ContextMenuTrigger>
                  <g
                    onMouseDown={(e) => handleDragStart(element.id, e)}
                    style={{ cursor: draggedElement === element.id ? 'grabbing' : 'grab' }}
                  >
                    <ArchitecturalElement element={element} />
                  </g>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {editingLabel === element.id ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.elements.namedItem('label') as HTMLInputElement;
                        handleRename(element.id, input.value);
                      }}
                      className="p-1"
                    >
                      <Input
                        name="label"
                        defaultValue={element.label}
                        autoFocus
                        onBlur={(e) => handleRename(element.id, e.target.value)}
                      />
                    </form>
                  ) : (
                    <>
                      <ContextMenuItem onClick={() => setEditingLabel(element.id)}>
                        Rename
                      </ContextMenuItem>
                    </>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DiagramCanvas;
