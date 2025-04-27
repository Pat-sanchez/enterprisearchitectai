import React, { useState, useEffect } from 'react';
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
  svgRef?: React.RefObject<SVGSVGElement>;
  onElementsChange?: (elements: Element[]) => void;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ command, svgRef, onElementsChange }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [scale, setScale] = useState(1);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const localSvgRef = React.useRef<SVGSVGElement>(null);
  
  // Use provided ref or local ref
  const effectiveSvgRef = svgRef || localSvgRef;

  useEffect(() => {
    if (command) {
      console.log('DiagramCanvas received command:', command);
      try {
        const newElements = processCommand(command, elements);
        console.log('Processed elements:', newElements);
        
        if (command.toLowerCase() === 'reset') {
          toast.info('Diagram reset');
        } else if (newElements.length > elements.length) {
          // A new element was added
          const newElement = newElements[newElements.length - 1];
          
          // Determine what type of component was added
          if (newElement.type === 'connection') {
            toast.success('Connected elements in diagram');
          } else {
            const componentType = 
              newElement.type === 'database' ? 'database' : 
              newElement.type === 'service' ? 'service' : 
              newElement.type === 'api' ? 'API' : 
              newElement.type === 'user' ? 'user' : 
              newElement.type === 'microservice' ? 'microservice' : 
              newElement.type === 'system' ? 'system' : 
              newElement.type === 'container' ? 'container' : 
              newElement.type === 'component' ? 'component' : 
              'element';
            
            toast.success(`Added new ${componentType} to diagram`);
          }
        } else if (newElements.length < elements.length) {
          toast.info('Removed element from diagram');
        } else if (command.toLowerCase().includes('connect')) {
          // Connection was attempted but failed
          toast.error('Could not connect elements. Make sure both elements exist.');
        }
        
        setElements(newElements);
        
        // Notify parent of element changes
        if (onElementsChange) {
          onElementsChange(newElements);
        }
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
    
    // Notify parent of element changes
    if (onElementsChange) {
      onElementsChange([]);
    }
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    console.log('Starting drag for element:', id);
    e.stopPropagation();
    setDraggedElement(id);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedElement || !effectiveSvgRef.current) return;

    const svg = effectiveSvgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) {
      console.error('getScreenCTM returned null');
      return;
    }
    
    const svgPoint = point.matrixTransform(screenCTM.inverse());

    // Find the dragged element
    const draggedElem = elements.find(elem => elem.id === draggedElement);
    if (!draggedElem || draggedElem.type === 'connection') return;

    // Update the element's position
    const updatedElements = elements.map(elem => {
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
    });

    // Update connections involving the dragged element
    const updatedWithConnections = updatedElements.map(elem => {
      if (elem.type === 'connection' && elem.properties) {
        const connectionLabel = elem.label || '';
        const draggedLabel = draggedElem.label || '';

        // Check if this connection involves the dragged element
        if (connectionLabel.includes(draggedLabel)) {
          // Find source and target elements
          const sourceTargetMatch = connectionLabel.match(/(.+) to (.+)/);
          
          if (sourceTargetMatch) {
            const [, sourceLabel, targetLabel] = sourceTargetMatch;
            const isSource = sourceLabel === draggedLabel;
            const otherLabel = isSource ? targetLabel : sourceLabel;
            
            // Find the other element in the connection
            const otherElement = elements.find(e => e.label === otherLabel);
            
            if (otherElement) {
              const updatedDraggedElem = updatedElements.find(e => e.id === draggedElement);
              
              if (updatedDraggedElem) {
                // Calculate new connection points
                const startPoint = isSource ? 
                  {
                    x: updatedDraggedElem.position.x + updatedDraggedElem.size.width / 2,
                    y: updatedDraggedElem.position.y + updatedDraggedElem.size.height / 2
                  } : 
                  {
                    x: otherElement.position.x + otherElement.size.width / 2,
                    y: otherElement.position.y + otherElement.size.height / 2
                  };
                
                const endPoint = isSource ?
                  {
                    x: otherElement.position.x + otherElement.size.width / 2,
                    y: otherElement.position.y + otherElement.size.height / 2
                  } :
                  {
                    x: updatedDraggedElem.position.x + updatedDraggedElem.size.width / 2,
                    y: updatedDraggedElem.position.y + updatedDraggedElem.size.height / 2
                  };
                
                return {
                  ...elem,
                  position: {
                    x: Math.min(startPoint.x, endPoint.x),
                    y: Math.min(startPoint.y, endPoint.y)
                  },
                  size: {
                    width: Math.abs(endPoint.x - startPoint.x),
                    height: Math.abs(endPoint.y - startPoint.y)
                  },
                  properties: {
                    ...elem.properties,
                    startPoint,
                    endPoint
                  }
                };
              }
            }
          }
        }
      }
      return elem;
    });
    
    setElements(updatedWithConnections);
    
    // Notify parent of element changes
    if (onElementsChange) {
      onElementsChange(updatedWithConnections);
    }
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
    
    const elementToRename = elements.find(elem => elem.id === id);
    if (!elementToRename) return;
    
    const oldLabel = elementToRename.label || '';
    
    // Update the element's label
    const updatedElements = elements.map(elem => {
      if (elem.id === id) {
        return {
          ...elem,
          label: newLabel
        };
      }
      return elem;
    });
    
    // Update any connection labels that reference this element
    const finalUpdatedElements = updatedElements.map(elem => {
      if (elem.type === 'connection' && elem.label) {
        // Replace old label in connection labels
        return {
          ...elem,
          label: elem.label.replace(oldLabel, newLabel)
        };
      }
      return elem;
    });
    
    toast.success(`Renamed to "${newLabel}"`);
    setElements(finalUpdatedElements);
    setEditingLabel(null);
    
    // Notify parent of element changes
    if (onElementsChange) {
      onElementsChange(finalUpdatedElements);
    }
  };

  const handleDeleteElement = (id: string) => {
    const elementToDelete = elements.find(e => e.id === id);
    if (!elementToDelete) return;
    
    const elementLabel = elementToDelete.label || '';
    
    // Remove the element
    let updatedElements = elements.filter(e => e.id !== id);
    
    // Also remove any connections involving this element
    if (elementLabel) {
      updatedElements = updatedElements.filter(elem => {
        if (elem.type === 'connection' && elem.label) {
          // Keep connections that don't involve this element
          return !elem.label.includes(elementLabel);
        }
        return true;
      });
    }
    
    setElements(updatedElements);
    toast.info(`Removed ${elementToDelete?.label || 'element'}`);
    
    // Notify parent of element changes
    if (onElementsChange) {
      onElementsChange(updatedElements);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900 flex justify-between items-center">
        <h2 className="font-medium">Archi Whiteboard</h2>
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
      
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <svg 
          ref={effectiveSvgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'center',
            minHeight: '600px',
            background: 'white',
          }}
          className="min-h-[600px] dark:bg-gray-800"
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
                className="fill-gray-400 text-sm dark:fill-gray-300"
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
                      <ContextMenuItem onClick={() => handleDeleteElement(element.id)}>
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
