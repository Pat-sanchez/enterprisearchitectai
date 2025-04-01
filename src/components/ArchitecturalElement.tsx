
import React from 'react';
import { Element } from '@/lib/diagramUtils';

interface ArchitecturalElementProps {
  element: Element;
}

const ArchitecturalElement: React.FC<ArchitecturalElementProps> = ({ element }) => {
  const { id, type, position, size, rotation = 0 } = element;
  
  // Calculate transform for rotation
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;
  const transform = rotation ? `rotate(${rotation} ${centerX} ${centerY})` : undefined;

  switch (type) {
    case 'room':
      return (
        <rect
          id={id}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          className="room architectural-element"
          transform={transform}
        />
      );

    case 'wall':
      if (element.properties?.startPoint && element.properties?.endPoint) {
        const { startPoint, endPoint } = element.properties;
        return (
          <line
            id={id}
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            className="wall architectural-element"
          />
        );
      }
      return (
        <rect
          id={id}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          className="wall architectural-element"
          transform={transform}
        />
      );

    case 'door':
      return (
        <rect
          id={id}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          className="door architectural-element"
          transform={transform}
        />
      );

    case 'window':
      return (
        <rect
          id={id}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          className="window architectural-element"
          transform={transform}
        />
      );

    default:
      return null;
  }
};

export default ArchitecturalElement;
