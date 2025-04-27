
// Utility types for enterprise architecture elements
export type ElementType = 'service' | 'database' | 'api' | 'microservice' | 'user' | 'system' | 'container' | 'component' | 'connection';
export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Element {
  id: string;
  type: ElementType;
  position: Point;
  size: Size;
  rotation?: number;
  label?: string;
  properties?: Record<string, any>;
}

// Helper functions
export const createService = (
  position: Point,
  label: string = "Service",
  size: Size = { width: 120, height: 80 }
): Element => {
  return {
    id: `service-${Date.now()}`,
    type: 'service',
    position,
    size,
    label,
  };
};

export const createDatabase = (
  position: Point,
  label: string = "Database",
  size: Size = { width: 100, height: 120 }
): Element => {
  return {
    id: `db-${Date.now()}`,
    type: 'database',
    position,
    size,
    label,
  };
};

export const createApi = (
  position: Point,
  label: string = "API",
  size: Size = { width: 120, height: 60 }
): Element => {
  return {
    id: `api-${Date.now()}`,
    type: 'api',
    position,
    size,
    label,
  };
};

export const createMicroservice = (
  position: Point,
  label: string = "Microservice",
  size: Size = { width: 120, height: 80 }
): Element => {
  return {
    id: `ms-${Date.now()}`,
    type: 'microservice',
    position,
    size,
    label,
  };
};

export const createUser = (
  position: Point,
  label: string = "User",
  size: Size = { width: 80, height: 100 }
): Element => {
  return {
    id: `user-${Date.now()}`,
    type: 'user',
    position,
    size,
    label,
  };
};

export const createSystem = (
  position: Point,
  label: string = "System",
  size: Size = { width: 160, height: 120 }
): Element => {
  return {
    id: `system-${Date.now()}`,
    type: 'system',
    position,
    size,
    label,
  };
};

export const createContainer = (
  position: Point,
  label: string = "Container",
  size: Size = { width: 160, height: 100 }
): Element => {
  return {
    id: `container-${Date.now()}`,
    type: 'container',
    position,
    size,
    label,
  };
};

export const createComponent = (
  position: Point,
  label: string = "Component",
  size: Size = { width: 120, height: 70 }
): Element => {
  return {
    id: `component-${Date.now()}`,
    type: 'component',
    position,
    size,
    label,
  };
};

export const createConnection = (
  startPoint: Point,
  endPoint: Point,
  label: string = ""
): Element => {
  return {
    id: `conn-${Date.now()}`,
    type: 'connection',
    position: {
      x: Math.min(startPoint.x, endPoint.x),
      y: Math.min(startPoint.y, endPoint.y),
    },
    size: {
      width: Math.abs(endPoint.x - startPoint.x),
      height: Math.abs(endPoint.y - startPoint.y),
    },
    label,
    properties: {
      startPoint,
      endPoint,
    },
  };
};

// Helper to find element by label (case-insensitive)
const findElementByLabel = (elements: Element[], label: string): Element | undefined => {
  return elements.find(element => 
    element.label?.toLowerCase() === label.toLowerCase()
  );
};

// Helper to generate non-overlapping position
const generatePosition = (elements: Element[], baseX = 400, baseY = 150, spacing = 50): Point => {
  // If no elements, return base position
  if (elements.length === 0) return { x: baseX, y: baseY };
  
  // Try to position in a grid layout
  const cols = 3;
  const index = elements.length;
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  return {
    x: baseX + (col * spacing * 1.5) - spacing,
    y: baseY + (row * spacing * 1.5),
  };
};

export const processCommand = (command: string, elements: Element[]): Element[] => {
  const cmd = command.toLowerCase();
  let newElements = [...elements];
  
  // Handle reset command first
  if (cmd === 'reset') {
    return [];
  }
  
  // Element creation commands
  if (cmd.includes('service')) {
    const label = extractLabel(command, 'service');
    newElements.push(createService(generatePosition(elements), label));
  } else if (cmd.includes('database')) {
    const label = extractLabel(command, 'database');
    newElements.push(createDatabase(generatePosition(elements), label));
  } else if (cmd.includes('api')) {
    const label = extractLabel(command, 'api');
    newElements.push(createApi(generatePosition(elements), label));
  } else if (cmd.includes('microservice')) {
    const label = extractLabel(command, 'microservice');
    newElements.push(createMicroservice(generatePosition(elements), label));
  } else if (cmd.includes('user')) {
    const label = extractLabel(command, 'user');
    newElements.push(createUser(generatePosition(elements), label));
  } else if (cmd.includes('system')) {
    const label = extractLabel(command, 'system');
    newElements.push(createSystem(generatePosition(elements), label));
  } else if (cmd.includes('container')) {
    const label = extractLabel(command, 'container');
    newElements.push(createContainer(generatePosition(elements), label));
  } else if (cmd.includes('component')) {
    const label = extractLabel(command, 'component');
    newElements.push(createComponent(generatePosition(elements), label));
  } 
  // Connect command
  else if (cmd.includes('connect')) {
    // Extract source and target from command
    const connectRegex = /connect\s+["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i;
    const match = command.match(connectRegex);
    
    if (match && match[1] && match[2]) {
      const sourceLabel = match[1].trim();
      const targetLabel = match[2].trim();
      
      const sourceElement = findElementByLabel(elements, sourceLabel);
      const targetElement = findElementByLabel(elements, targetLabel);
      
      if (sourceElement && targetElement) {
        // Calculate connection points from element centers
        const startPoint = {
          x: sourceElement.position.x + sourceElement.size.width / 2,
          y: sourceElement.position.y + sourceElement.size.height / 2
        };
        
        const endPoint = {
          x: targetElement.position.x + targetElement.size.width / 2,
          y: targetElement.position.y + targetElement.size.height / 2
        };
        
        const connectionLabel = `${sourceLabel} to ${targetLabel}`;
        newElements.push(createConnection(startPoint, endPoint, connectionLabel));
      }
    }
  } 
  // Delete/remove command
  else if (cmd.includes('delete') || cmd.includes('remove')) {
    const deleteRegex = /(delete|remove)\s+["']?([^"']+)["']?/i;
    const match = command.match(deleteRegex);
    
    if (match && match[2]) {
      const elementLabel = match[2].trim();
      const elementToRemove = findElementByLabel(elements, elementLabel);
      
      if (elementToRemove) {
        // Remove the element with matching label
        newElements = newElements.filter(el => el.id !== elementToRemove.id);
        
        // Also remove any connections involving this element
        newElements = newElements.filter(el => {
          if (el.type !== 'connection') return true;
          
          const connectionLabel = el.label || '';
          return !connectionLabel.includes(elementLabel);
        });
      }
    } else if (newElements.length > 0) {
      // Default: remove last element if no specific element mentioned
      newElements.pop();
    }
  }
  
  return newElements;
};

// Helper to extract labels from commands
const extractLabel = (command: string, entityType: string): string => {
  const regex = new RegExp(`${entityType}\\s+(?:called|named|labeled)?\\s*["']?([\\w\\s-]+)["']?`, 'i');
  const match = command.match(regex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no specific name found, capitalize the entity type as default label
  return entityType.charAt(0).toUpperCase() + entityType.slice(1);
};
