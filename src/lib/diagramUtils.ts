
// Utility types for architectural elements
export type ElementType = 'wall' | 'door' | 'window' | 'room';
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
  properties?: Record<string, any>;
}

// Helper functions
export const createRoom = (
  position: Point,
  size: Size = { width: 200, height: 150 }
): Element => {
  return {
    id: `room-${Date.now()}`,
    type: 'room',
    position,
    size,
  };
};

export const createWall = (
  startPoint: Point,
  endPoint: Point
): Element => {
  // Calculate position (top-left corner) and size
  const position = {
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
  };
  
  const size = {
    width: Math.abs(endPoint.x - startPoint.x),
    height: Math.abs(endPoint.y - startPoint.y),
  };
  
  return {
    id: `wall-${Date.now()}`,
    type: 'wall',
    position,
    size,
    properties: {
      startPoint,
      endPoint,
    },
  };
};

export const createDoor = (
  position: Point,
  size: Size = { width: 40, height: 5 }
): Element => {
  return {
    id: `door-${Date.now()}`,
    type: 'door',
    position,
    size,
    rotation: 0,
  };
};

export const createWindow = (
  position: Point,
  size: Size = { width: 30, height: 5 }
): Element => {
  return {
    id: `window-${Date.now()}`,
    type: 'window',
    position,
    size,
    rotation: 0,
  };
};

export const rotateElement = (element: Element, degrees: number): Element => {
  return {
    ...element,
    rotation: (element.rotation || 0) + degrees,
  };
};

export const processCommand = (command: string, elements: Element[]): Element[] => {
  const cmd = command.toLowerCase();
  let newElements = [...elements];
  
  if (cmd.includes('room') || cmd.includes('rectangle')) {
    const center = { x: 400, y: 300 };
    newElements.push(createRoom(center));
  } else if (cmd.includes('wall')) {
    // Simple wall processing logic
    if (elements.length > 0 && elements[0].type === 'room') {
      const room = elements[0];
      const { position, size } = room;
      
      // Add walls around the room
      const walls = [
        // Top wall
        createWall(
          { x: position.x, y: position.y },
          { x: position.x + size.width, y: position.y }
        ),
        // Right wall
        createWall(
          { x: position.x + size.width, y: position.y },
          { x: position.x + size.width, y: position.y + size.height }
        ),
        // Bottom wall
        createWall(
          { x: position.x, y: position.y + size.height },
          { x: position.x + size.width, y: position.y + size.height }
        ),
        // Left wall
        createWall(
          { x: position.x, y: position.y },
          { x: position.x, y: position.y + size.height }
        ),
      ];
      
      newElements = [...newElements, ...walls];
    }
  } else if (cmd.includes('door')) {
    if (elements.length > 0) {
      // Find a wall to add the door to
      const walls = elements.filter(el => el.type === 'wall');
      if (walls.length > 0) {
        const wall = walls[0];
        const { position, size } = wall;
        
        // Place door in the middle of the wall
        const doorPosition = {
          x: position.x + size.width / 2 - 20,
          y: position.y - 2.5,
        };
        
        newElements.push(createDoor(doorPosition));
      }
    }
  } else if (cmd.includes('window')) {
    if (elements.length > 0) {
      // Find a wall to add the window to
      const walls = elements.filter(el => el.type === 'wall');
      if (walls.length > 0) {
        const wall = walls[1]; // Use the second wall for variety
        const { position, size } = wall;
        
        // Place window in the middle of the wall
        const windowPosition = {
          x: position.x - 2.5,
          y: position.y + size.height / 2 - 15,
        };
        
        const window = createWindow(windowPosition);
        newElements.push(rotateElement(window, 90));
      }
    }
  } else if (cmd.includes('delete') || cmd.includes('remove')) {
    // Remove the last element added
    if (newElements.length > 0) {
      newElements.pop();
    }
  }
  
  return newElements;
};
