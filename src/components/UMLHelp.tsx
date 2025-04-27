
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UMLHelp = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <HelpCircle size={14} />
          <span>UML Help</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <Tabs defaultValue="syntax">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="syntax">Local Syntax</TabsTrigger>
            <TabsTrigger value="plantuml">PlantUML</TabsTrigger>
          </TabsList>
          
          <TabsContent value="syntax">
            <div className="space-y-4">
              <h3 className="font-medium">UML Syntax Guide</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Write one element per line using the following syntax:</p>
                <code className="block bg-muted p-2 rounded text-xs">
                  type: Label
                </code>
                <p>Supported types:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><code>service:</code> - Add a service component</li>
                  <li><code>database:</code> - Add a database</li>
                  <li><code>api:</code> - Add an API endpoint</li>
                  <li><code>microservice:</code> - Add a microservice</li>
                  <li><code>system:</code> - Add a system component</li>
                  <li><code>component:</code> - Add a generic component</li>
                  <li><code>connect:</code> - Connect last two components</li>
                </ul>
                <p className="pt-2">Example:</p>
                <pre className="bg-muted p-2 rounded text-xs">
                  service: Auth Service{'\n'}
                  database: Users DB{'\n'}
                  connect: Authenticates
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="plantuml">
            <div className="space-y-4">
              <h3 className="font-medium">PlantUML Integration</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>You can export your diagram as PlantUML code to use with any PlantUML renderer.</p>
                <p>Steps to use:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Create your diagram using the whiteboard or wizard</li>
                  <li>Click the <span className="px-1 py-0.5 bg-muted rounded"><Code size={12} className="inline" /> Code</span> button or go to Developer Mode</li>
                  <li>Copy the generated PlantUML code</li>
                  <li>Paste into a PlantUML editor like <a href="https://www.planttext.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">planttext.com</a></li>
                </ol>
                <p className="pt-2">Example PlantUML code:</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                  @startuml{'\n'}
                  !theme plain{'\n'}
                  [Service] as service_1{'\n'}
                  database "Database" as db_1{'\n'}
                  service_1 --> db_1{'\n'}
                  @enduml
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UMLHelp;
