
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface WizardPanelProps {
  onCommandGenerated: (command: string) => void;
}

interface Question {
  id: string;
  title: string;
  description: string;
  type: 'radio' | 'text' | 'textarea';
  options?: { value: string; label: string }[];
}

const WizardPanel: React.FC<WizardPanelProps> = ({ onCommandGenerated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: Question[] = [
    {
      id: 'system_type',
      title: 'What type of system are you designing?',
      description: 'Select the primary architecture style for your application',
      type: 'radio',
      options: [
        { value: 'microservice', label: 'Microservice Architecture' },
        { value: 'monolith', label: 'Monolithic Application' },
        { value: 'serverless', label: 'Serverless Architecture' },
        { value: 'event_driven', label: 'Event-Driven Architecture' },
      ],
    },
    {
      id: 'system_name',
      title: 'What is the name of your system?',
      description: 'Provide a name for the main system',
      type: 'text',
    },
    {
      id: 'components',
      title: 'What are the main components?',
      description: 'List the main services/components, separated by commas',
      type: 'textarea',
    },
    {
      id: 'database_type',
      title: 'What type of database will you use?',
      description: 'Select the primary database type',
      type: 'radio',
      options: [
        { value: 'sql', label: 'SQL Database' },
        { value: 'nosql', label: 'NoSQL Database' },
        { value: 'graph', label: 'Graph Database' },
        { value: 'multi', label: 'Multiple Database Types' },
      ],
    },
    {
      id: 'user_interface',
      title: 'What type of user interface does your system have?',
      description: 'Select all that apply',
      type: 'radio',
      options: [
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'api', label: 'API Only' },
        { value: 'mixed', label: 'Mixed Interfaces' },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Please answer the question before proceeding");
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateDiagram();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const generateDiagram = () => {
    // Create commands based on collected answers
    const commands: string[] = [];
    
    // Create the main system
    commands.push(`system ${answers.system_name || 'Main System'}`);
    
    // Add components based on system type and components
    if (answers.components) {
      const componentsList = answers.components.split(',').map(comp => comp.trim());
      
      componentsList.forEach((component, index) => {
        if (answers.system_type === 'microservice') {
          commands.push(`microservice ${component}`);
        } else if (answers.system_type === 'monolith') {
          commands.push(`component ${component}`);
        } else {
          commands.push(`service ${component}`);
        }
        
        // Connect to the main system
        if (index === 0) {
          commands.push(`connect ${answers.system_name || 'Main System'} to ${component}`);
        } else {
          // Connect to previous component for a chain
          commands.push(`connect ${componentsList[index-1]} to ${component}`);
        }
      });
    }
    
    // Add database
    if (answers.database_type) {
      let dbName = 'Database';
      switch (answers.database_type) {
        case 'sql': dbName = 'SQL Database'; break;
        case 'nosql': dbName = 'NoSQL Database'; break; 
        case 'graph': dbName = 'Graph Database'; break;
        case 'multi': dbName = 'Primary Database'; break;
      }
      
      commands.push(`database ${dbName}`);
      
      // Connect last component to database
      if (answers.components) {
        const lastComponent = answers.components.split(',').map(comp => comp.trim()).pop();
        if (lastComponent) {
          commands.push(`connect ${lastComponent} to ${dbName}`);
        }
      }
    }
    
    // Add UI elements
    if (answers.user_interface) {
      commands.push(`user Client User`);
      
      switch (answers.user_interface) {
        case 'web':
          commands.push(`service Web Interface`);
          commands.push(`connect Client User to Web Interface`);
          break;
        case 'mobile':
          commands.push(`service Mobile App`);
          commands.push(`connect Client User to Mobile App`);
          break;
        case 'api':
          commands.push(`api API Gateway`);
          commands.push(`connect Client User to API Gateway`);
          break;
        case 'mixed':
          commands.push(`service Web Interface`);
          commands.push(`service Mobile App`);
          commands.push(`api API Gateway`);
          commands.push(`connect Client User to Web Interface`);
          commands.push(`connect Client User to Mobile App`);
          commands.push(`connect Web Interface to API Gateway`);
          commands.push(`connect Mobile App to API Gateway`);
          break;
      }
      
      // Connect UI to main system or first component
      const target = answers.components 
        ? answers.components.split(',')[0].trim() 
        : answers.system_name || 'Main System';
        
      if (answers.user_interface === 'mixed') {
        commands.push(`connect API Gateway to ${target}`);
      } else if (answers.user_interface === 'api') {
        commands.push(`connect API Gateway to ${target}`);
      } else {
        const uiComponent = answers.user_interface === 'web' ? 'Web Interface' : 'Mobile App';
        commands.push(`connect ${uiComponent} to ${target}`);
      }
    }
    
    // Execute all commands with slight delay between them
    executeCommandsSequentially(commands);
    
    toast.success("Generating architecture diagram based on your answers");
  };
  
  const executeCommandsSequentially = (commands: string[]) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < commands.length) {
        onCommandGenerated(commands[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'radio':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswer}
            className="space-y-3 mt-4"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'text':
        return (
          <div className="mt-4">
            <Input 
              value={answers[currentQuestion.id] || ''} 
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here"
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="mt-4">
            <Textarea 
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here"
              rows={5}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuestionInput()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep < questions.length - 1 ? (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
              ) : (
                'Generate Diagram'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WizardPanel;
