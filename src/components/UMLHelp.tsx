
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const UMLHelp = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <HelpCircle size={14} />
          <span>UML Help</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
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
      </HoverCardContent>
    </HoverCard>
  );
};

export default UMLHelp;
