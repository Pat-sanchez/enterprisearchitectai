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
import { toast } from "sonner";

interface DiagramCanvasProps {
  command?: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ command }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [scale, setScale] = useState(1);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (command) {
      console.log('DiagramCanvas received command:', command);
      try {
        const newElements = processCommand(command, elements);
        console.log('Processed elements:', newElements);
        
        if (newElements.length !== elements.length) {
          const componentType = 
            command.toLowerCase().includes('database') ? 'database' : 
            command.toLowerCase().includes('service') ? 'service' : 
            command.toLowerCase().includes('api') ? 'API' : 
            command.toLowerCase().includes('user') ? 'user' : 
            command.toLowerCase().includes('microservice') ? 'microservice' : 
            command.toLowerCase().includes('system') ? 'system' : 
            command.toLowerCase().includes('container') ? 'container' : 
            command.toLowerCase().includes('component') ? 'component' : 
            'element';
          
          toast.success(`Added new ${componentType} to diagram`);
        } else if (command.toLowerCase().includes('connect')) {
          toast.success('Connected elements in diagram');
        } else if (command.toLowerCase().includes('delete') || command.toLowerCase().includes('remove')) {
          toast.info('Removed element from diagram');
        }
        
        setElements(newElements);
      } catch (error) {
        console.error('Error processing diagram command:', error);
        toast.error('Failed to update diagram');
      }
    }
  }, [command]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
    toast.info('Zoomed in');
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
    toast.info('Zoomed out');
  };

  const handleReset = () => {
    setElements([]);
    setScale(1);
    toast.info('Diagram reset');
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    console.log('Starting drag for element:', id);
    e.stopPropagation();
    setDraggedElement(id);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedElement || !svgRef.current) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) {
      console.error('getScreenCTM returned null');
      return;
    }
    
    const svgPoint = point.matrixTransform(screenCTM.inverse());

    setElements(prev => prev.map(elem => {
      if (elem.id === draggedElement) {
        if (elem.type === 'connection') return elem;
        
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
    if (draggedElement) {
      console.log('Ended drag for element:', draggedElement);
      toast.success('Element moved');
    }
    setDraggedElement(null);
  };

  const handleRename = (id: string, newLabel: string) => {
    console.log('Renaming element:', id, 'to', newLabel);
    if (!newLabel.trim()) {
      toast.error('Label cannot be empty');
      return;
    }
    
    setElements(prev => prev.map(elem => {
      if (elem.id === id) {
        toast.success(`Renamed to "${newLabel}"`);
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
        <h2 className="font-medium">Archi Whiteboard</h2>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" onClick={() => setScale(prev => Math.min(prev + 0.1, 2))} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => {
            setElements([]);
            setScale(1);
            toast.info('Diagram reset');
          }} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'center',
            minHeight: '600px',
            background: 'white',
          }}
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
            {elements.length === 0 && (
              <text
                x="400"
                y="300"
                textAnchor="middle"
                className="fill-gray-400 text-sm"
              >
                Start by asking the assistant to add elements to your diagram
              </text>
            )}
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
                      <ContextMenuItem onClick={() => {
                        setElements(prev => prev.filter(e => e.id !== element.id));
                        toast.info('Element removed');
                      }}>
                        Delete
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
