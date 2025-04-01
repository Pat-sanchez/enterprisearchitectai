
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

export const processCommand = (command: string, elements: Element[]): Element[] => {
  const cmd = command.toLowerCase();
  let newElements = [...elements];
  
  if (cmd.includes('service')) {
    const label = extractLabel(command, 'service');
    newElements.push(createService({ x: 400, y: 150 }, label));
  } else if (cmd.includes('database')) {
    const label = extractLabel(command, 'database');
    newElements.push(createDatabase({ x: 400, y: 300 }, label));
  } else if (cmd.includes('api')) {
    const label = extractLabel(command, 'api');
    newElements.push(createApi({ x: 400, y: 220 }, label));
  } else if (cmd.includes('microservice')) {
    const label = extractLabel(command, 'microservice');
    newElements.push(createMicroservice({ x: 400, y: 380 }, label));
  } else if (cmd.includes('user')) {
    const label = extractLabel(command, 'user');
    newElements.push(createUser({ x: 200, y: 150 }, label));
  } else if (cmd.includes('system')) {
    const label = extractLabel(command, 'system');
    newElements.push(createSystem({ x: 400, y: 200 }, label));
  } else if (cmd.includes('container')) {
    const label = extractLabel(command, 'container');
    newElements.push(createContainer({ x: 400, y: 300 }, label));
  } else if (cmd.includes('component')) {
    const label = extractLabel(command, 'component');
    newElements.push(createComponent({ x: 400, y: 400 }, label));
  } else if (cmd.includes('connect')) {
    if (elements.length >= 2) {
      const lastTwo = elements.slice(-2);
      const e1 = lastTwo[0];
      const e2 = lastTwo[1];
      
      const startPoint = {
        x: e1.position.x + e1.size.width / 2,
        y: e1.position.y + e1.size.height / 2
      };
      
      const endPoint = {
        x: e2.position.x + e2.size.width / 2,
        y: e2.position.y + e2.size.height / 2
      };
      
      const label = extractLabel(command, 'connect');
      newElements.push(createConnection(startPoint, endPoint, label));
    }
  } else if (cmd.includes('delete') || cmd.includes('remove')) {
    if (newElements.length > 0) {
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
