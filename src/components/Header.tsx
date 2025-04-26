
import React from 'react';
import { 
  Glasses, 
  Save, 
  Plus, 
  RotateCcw, 
  ArrowLeft, 
  Upload, 
  Code, 
  Download,
  FileText,
  FileCode,
  Moon,
  Sun,
  History,
  Keyboard,
  HelpCircle,
  Templates
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  activeTab: 'wizard' | 'import';
  onTabChange: (tab: string) => void;
  onNewDiagram?: () => void;
  onSaveDiagram?: () => void;
  onResetDiagram?: () => void;
  onBackToWizard?: () => void;
  showWizardControls?: boolean;
  onExportDiagram?: (format: 'png' | 'svg' | 'json') => void;
  onShowTemplates?: () => void;
  onShowHistory?: () => void;
  onShowKeyboardShortcuts?: () => void;
  onShowHelp?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange,
  onNewDiagram,
  onSaveDiagram,
  onResetDiagram,
  onBackToWizard,
  showWizardControls = false,
  onExportDiagram,
  onShowTemplates,
  onShowHistory,
  onShowKeyboardShortcuts,
  onShowHelp
}) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm overflow-hidden">
            <div className="flex items-center justify-center relative">
              <Glasses 
                className="h-6 w-6 text-primary transform transition-transform duration-300 hover:rotate-12 hover:scale-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="font-semibold text-lg tracking-tight flex items-center">
            <span>Archi</span>
            <span className="text-xs bg-primary text-white rounded-full px-2 ml-2 py-0.5">AI</span>
          </h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
          <TabsList className="bg-transparent">
            <TabsTrigger value="wizard" className="data-[state=active]:bg-primary/10">
              <Code className="h-4 w-4 mr-2" /> Wizard
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-primary/10">
              <Upload className="h-4 w-4 mr-2" /> Import
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            {showWizardControls && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-primary/10" 
                    onClick={() => {
                      if (onBackToWizard) {
                        onBackToWizard();
                        toast.info('Returning to wizard questions');
                      }
                    }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Wizard Questions</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10" 
                  onClick={() => {
                    if (onNewDiagram) {
                      onNewDiagram();
                      toast.success('Created new diagram');
                    }
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create New Diagram</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onSaveDiagram) {
                      onSaveDiagram();
                      toast.success('Diagram saved');
                    }
                  }}
                >
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Current Diagram</p>
              </TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Diagram</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExportDiagram && onExportDiagram('png')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportDiagram && onExportDiagram('svg')}>
                  <FileCode className="mr-2 h-4 w-4" />
                  Export as SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportDiagram && onExportDiagram('json')}>
                  <FileCode className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onShowTemplates) {
                      onShowTemplates();
                      toast.info('Showing templates');
                    }
                  }}
                >
                  <Templates className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Browse Templates</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onShowHistory) {
                      onShowHistory();
                      toast.info('Showing version history');
                    }
                  }}
                >
                  <History className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Version History</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onResetDiagram) {
                      onResetDiagram();
                      toast.info('Diagram reset');
                    }
                  }}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Diagram to Initial State</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onShowKeyboardShortcuts) {
                      onShowKeyboardShortcuts();
                    } else {
                      toast.info('Keyboard shortcuts coming soon');
                    }
                  }}
                >
                  <Keyboard className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard Shortcuts</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    if (onShowHelp) {
                      onShowHelp();
                    } else {
                      toast.info('Help documentation coming soon');
                    }
                  }}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    toast.info(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
                  }}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Dark Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
