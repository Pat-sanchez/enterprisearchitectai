
import React from 'react';
import { Element } from '@/lib/diagramUtils';
import { Database, User, Server, Layers, Layout, Globe, MessageSquare, Code } from 'lucide-react';

interface ArchitecturalElementProps {
  element: Element;
}

const ArchitecturalElement: React.FC<ArchitecturalElementProps> = ({ element }) => {
  const { id, type, position, size, rotation = 0, label } = element;
  
  // Calculate transform for rotation
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;
  const transform = rotation ? `rotate(${rotation} ${centerX} ${centerY})` : undefined;

  const renderIcon = () => {
    const iconSize = Math.min(size.width, size.height) * 0.4;
    const iconX = position.x + (size.width / 2) - (iconSize / 2);
    const iconY = position.y + (size.height * 0.3) - (iconSize / 2);

    switch (type) {
      case 'database':
        return <Database x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'user':
        return <User x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'service':
        return <Server x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'microservice':
        return <Layers x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'system':
        return <Globe x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'container':
        return <Layout x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'api':
        return <MessageSquare x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      case 'component':
        return <Code x={iconX} y={iconY} width={iconSize} height={iconSize} />;
      default:
        return null;
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    
    const textX = position.x + size.width / 2;
    const textY = position.y + size.height * 0.75;
    
    return (
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        className="fill-current text-sm font-medium"
      >
        {label}
      </text>
    );
  };

  switch (type) {
    case 'service':
    case 'database':
    case 'api':
    case 'microservice':
    case 'user':
    case 'system':
    case 'container':
    case 'component':
      return (
        <g transform={transform}>
          <rect
            id={id}
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            rx={8}
            ry={8}
            className="fill-white stroke-gray-400 stroke-2"
          />
          {renderIcon()}
          {renderLabel()}
        </g>
      );

    case 'connection':
      if (element.properties?.startPoint && element.properties?.endPoint) {
        const { startPoint, endPoint } = element.properties;
        return (
          <g>
            <line
              id={id}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={endPoint.x}
              y2={endPoint.y}
              className="stroke-gray-400 stroke-2"
              markerEnd="url(#arrowhead)"
            />
            {label && (
              <text
                x={(startPoint.x + endPoint.x) / 2}
                y={(startPoint.y + endPoint.y) / 2 - 10}
                textAnchor="middle"
                className="fill-current text-xs"
              >
                {label}
              </text>
            )}
          </g>
        );
      }
      return null;

    default:
      return null;
  }
};

export default ArchitecturalElement;
