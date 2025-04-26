
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// Mock version history data
const MOCK_VERSION_HISTORY = [
  { id: 'v1', timestamp: new Date(Date.now() - 3600000), description: 'Initial diagram creation' },
  { id: 'v2', timestamp: new Date(Date.now() - 2400000), description: 'Added database components' },
  { id: 'v3', timestamp: new Date(Date.now() - 1800000), description: 'Added service connections' },
  { id: 'v4', timestamp: new Date(), description: 'Current version' },
];

interface VersionHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onRestoreVersion: (versionId: string) => void;
}

const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({ open, onClose, onRestoreVersion }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Version History</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] mt-4">
          <div className="space-y-4 pr-4">
            {MOCK_VERSION_HISTORY.map((version, index) => (
              <div 
                key={version.id}
                className={`border rounded-lg p-4 ${index === MOCK_VERSION_HISTORY.length - 1 ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {version.id}
                      {index === MOCK_VERSION_HISTORY.length - 1 && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {version.timestamp.toLocaleString()}
                    </p>
                    <p className="mt-2">{version.description}</p>
                  </div>
                  {index !== MOCK_VERSION_HISTORY.length - 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onRestoreVersion(version.id);
                        onClose();
                        toast.success(`Restored to version: ${version.id}`);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryDialog;
