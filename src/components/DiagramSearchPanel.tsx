
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Element } from '@/lib/diagramUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiagramSearchPanelProps {
  elements: Element[];
  onElementClick: (elementId: string) => void;
}

const DiagramSearchPanel: React.FC<DiagramSearchPanelProps> = ({ elements, onElementClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter out connection elements and filter by search term
  const filteredElements = elements
    .filter(element => element.type !== 'connection')
    .filter(element => 
      element.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div className="border rounded-md p-4">
      <div className="relative mb-4">
        <Input
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        {searchTerm ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      <ScrollArea className="h-[200px]">
        {filteredElements.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No elements found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredElements.map((element) => (
              <div
                key={element.id}
                className="p-2 rounded-md hover:bg-primary/10 cursor-pointer"
                onClick={() => onElementClick(element.id)}
              >
                <div className="font-medium">{element.label || 'Untitled'}</div>
                <div className="text-xs text-muted-foreground capitalize">{element.type}</div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DiagramSearchPanel;
