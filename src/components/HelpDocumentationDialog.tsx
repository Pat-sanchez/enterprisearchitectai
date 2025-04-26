
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpDocumentationDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDocumentationDialog: React.FC<HelpDocumentationDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Help & Documentation</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="getting-started" className="mt-4 h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="wizard">Using the Wizard</TabsTrigger>
            <TabsTrigger value="import">Import Options</TabsTrigger>
            <TabsTrigger value="diagrams">Working with Diagrams</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100%-50px)]">
            <TabsContent value="getting-started" className="pr-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Welcome to ArchiAI</h3>
                    <p>ArchiAI is an AI-powered enterprise architecture diagramming tool that helps you create, visualize, and share architecture diagrams easily.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Features</h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>AI-powered wizard to create diagrams using natural language</li>
                      <li>Import existing architecture from various formats</li>
                      <li>Interactive diagram canvas with drag-and-drop functionality</li>
                      <li>Export diagrams in various formats</li>
                      <li>Version history tracking</li>
                      <li>Template library for common architecture patterns</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Quick Start</h3>
                    <ol className="list-decimal ml-6 space-y-2">
                      <li>Use the <strong>Wizard</strong> tab to create a diagram using natural language</li>
                      <li>Use the interactive <strong>Canvas</strong> to customize your diagram by dragging elements</li>
                      <li>Use the top menu to <strong>Save</strong> or <strong>Export</strong> your diagram</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wizard" className="pr-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Using the AI Wizard</h3>
                    <p>The AI Wizard allows you to create architecture diagrams using natural language. Simply describe what you want to create, and the AI will generate a diagram for you.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Example Commands</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>
                        <div className="font-medium">Create a simple web application:</div>
                        <div className="text-muted-foreground text-sm">"Create a system with a user connected to a web application, which connects to an API service and a database"</div>
                      </li>
                      <li>
                        <div className="font-medium">Create a microservice architecture:</div>
                        <div className="text-muted-foreground text-sm">"Create a microservice architecture with an API gateway connected to three microservices: user service, order service, and payment service"</div>
                      </li>
                      <li>
                        <div className="font-medium">Create a cloud architecture:</div>
                        <div className="text-muted-foreground text-sm">"Create an AWS architecture with a load balancer connected to EC2 instances, an S3 bucket, and an RDS database"</div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="import" className="pr-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Import Options</h3>
                    <p>ArchiAI allows you to import existing architecture diagrams from various formats and sources.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Supported Import Methods</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>
                        <div className="font-medium">Text Descriptions</div>
                        <div className="text-muted-foreground text-sm">Import from natural language descriptions or documentation</div>
                      </li>
                      <li>
                        <div className="font-medium">JSON Format</div>
                        <div className="text-muted-foreground text-sm">Import from ArchiAI JSON format or compatible tools</div>
                      </li>
                      <li>
                        <div className="font-medium">Code Analysis</div>
                        <div className="text-muted-foreground text-sm">Extract architecture from code repositories (coming soon)</div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="diagrams" className="pr-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Working with Diagrams</h3>
                    <p>Once you've created or imported a diagram, you can edit it using the interactive canvas.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Diagram Features</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>
                        <div className="font-medium">Drag and Drop</div>
                        <div className="text-muted-foreground text-sm">Move elements by clicking and dragging them on the canvas</div>
                      </li>
                      <li>
                        <div className="font-medium">Context Menu</div>
                        <div className="text-muted-foreground text-sm">Right-click on elements to access additional options</div>
                      </li>
                      <li>
                        <div className="font-medium">Element Properties</div>
                        <div className="text-muted-foreground text-sm">Edit element properties like name, description, and type</div>
                      </li>
                      <li>
                        <div className="font-medium">Connections</div>
                        <div className="text-muted-foreground text-sm">Create connections between elements using the AI wizard</div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDocumentationDialog;
