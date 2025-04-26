
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

// Template categories and data
const TEMPLATE_CATEGORIES = [
  { id: 'cloud', name: 'Cloud Architecture' },
  { id: 'microservices', name: 'Microservices' },
  { id: 'containers', name: 'Container Architecture' },
  { id: 'serverless', name: 'Serverless' },
];

const TEMPLATES = [
  { 
    id: 'aws-simple', 
    name: 'Simple AWS Architecture',
    category: 'cloud',
    preview: '/placeholder.svg',
    command: 'Create a system called AWS Cloud with a user and a service called API Gateway connected to a microservice called Lambda Function connected to a database called DynamoDB.' 
  },
  { 
    id: 'microservices-basic', 
    name: 'Basic Microservices',
    category: 'microservices',
    preview: '/placeholder.svg',
    command: 'Create a system with an API gateway connected to three microservices. First microservice called User Service connected to a database called User DB. Second microservice called Order Service connected to a database called Order DB. Third microservice called Payment Service connected to a database called Payment DB.' 
  },
  { 
    id: 'container-arch', 
    name: 'Container Architecture',
    category: 'containers',
    preview: '/placeholder.svg',
    command: 'Create a system with a container called Frontend connected to a container called API Gateway. API Gateway connected to three containers called Auth Service, Product Service, and Cart Service. Each service connected to its own database.' 
  },
  { 
    id: 'serverless', 
    name: 'Serverless Pattern',
    category: 'serverless',
    preview: '/placeholder.svg',
    command: 'Create a system with an API Gateway connected to three Lambda functions. Each function connected to different DynamoDB tables.' 
  },
];

interface TemplatesDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (command: string) => void;
}

const TemplatesDialog: React.FC<TemplatesDialogProps> = ({ open, onClose, onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = React.useState('cloud');
  
  const categoryTemplates = TEMPLATES.filter(template => template.category === activeCategory);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Diagram Templates</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {TEMPLATE_CATEGORIES.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {TEMPLATE_CATEGORIES.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTemplates.map(template => (
                    <div 
                      key={template.id} 
                      className="border rounded-md p-4 hover:border-primary cursor-pointer transition-all"
                      onClick={() => {
                        onSelectTemplate(template.command);
                        onClose();
                        toast.success(`Applied template: ${template.name}`);
                      }}
                    >
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                        <img 
                          src={template.preview} 
                          alt={template.name}
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {template.command.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesDialog;
