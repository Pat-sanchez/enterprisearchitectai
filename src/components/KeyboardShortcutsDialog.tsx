
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const SHORTCUTS: ShortcutGroup[] = [
  {
    title: "General",
    shortcuts: [
      { keys: ["Ctrl", "N"], description: "New Diagram" },
      { keys: ["Ctrl", "S"], description: "Save Diagram" },
      { keys: ["Ctrl", "Z"], description: "Undo" },
      { keys: ["Ctrl", "Y"], description: "Redo" },
      { keys: ["Ctrl", "E"], description: "Export Diagram" },
      { keys: ["?"], description: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], description: "Cancel Current Operation" },
    ]
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Space", "Drag"], description: "Pan Canvas" },
      { keys: ["Ctrl", "+"], description: "Zoom In" },
      { keys: ["Ctrl", "-"], description: "Zoom Out" },
      { keys: ["Ctrl", "0"], description: "Reset Zoom" },
    ]
  },
  {
    title: "Elements",
    shortcuts: [
      { keys: ["Del"], description: "Delete Selected Element" },
      { keys: ["F2"], description: "Rename Selected Element" },
      { keys: ["Ctrl", "A"], description: "Select All Elements" },
      { keys: ["Ctrl", "D"], description: "Duplicate Selected Element" },
    ]
  },
];

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {SHORTCUTS.map((group, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-lg">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b">
                    <span>{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs font-medium">
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
