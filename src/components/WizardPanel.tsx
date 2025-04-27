import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  title: string;
  description: string;
  type: 'radio' | 'text' | 'textarea' | 'hybrid-components';
  options?: { value: string; label: string }[];
}

interface WizardPanelProps {
  onCommandGenerated: (command: string) => void;
  hidden?: boolean;
}

const WizardPanel: React.FC<WizardPanelProps> = ({ onCommandGenerated, hidden = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [customComponents, setCustomComponents] = useState<string>('');

  const questions: Question[] = [
    {
      id: 'purpose',
      title: 'What is the purpose of your system?',
      description: 'Select the primary purpose of your architecture',
      type: 'radio',
      options: [
        { value: 'web_app', label: 'Web Application' },
        { value: 'mobile_app', label: 'Mobile Application' },
        { value: 'api_service', label: 'API Service' },
        { value: 'microservices', label: 'Microservices Architecture' },
        { value: 'ecommerce', label: 'E-commerce Platform' },
        { value: 'cms', label: 'Content Management System (CMS)' },
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
      description: 'Select recommended components or add custom ones',
      type: 'hybrid-components',
      options: [
        { value: 'user_service', label: 'User Service' },
        { value: 'auth_service', label: 'Authentication Service' },
        { value: 'api_gateway', label: 'API Gateway' },
        { value: 'database_service', label: 'Database Service' },
        { value: 'cache_service', label: 'Cache Service' },
        { value: 'message_broker', label: 'Message Broker' },
        { value: 'notification_service', label: 'Notification Service' },
        { value: 'payment_service', label: 'Payment Service' },
      ],
    },
    {
      id: 'data_storage',
      title: 'What type of data storage will you use?',
      description: 'Select the primary storage solution',
      type: 'radio',
      options: [
        { value: 'mysql', label: 'MySQL Database' },
        { value: 'postgresql', label: 'PostgreSQL Database' },
        { value: 'mongodb', label: 'MongoDB (NoSQL)' },
        { value: 'firebase', label: 'Firebase' },
        { value: 'multi', label: 'Multiple Storage Solutions' },
      ],
    },
    {
      id: 'communication',
      title: 'How will components communicate?',
      description: 'Select the primary communication protocol',
      type: 'radio',
      options: [
        { value: 'rest', label: 'REST APIs' },
        { value: 'graphql', label: 'GraphQL' },
        { value: 'grpc', label: 'gRPC' },
        { value: 'event', label: 'Event-Driven (Message Brokers)' },
      ],
    },
    {
      id: 'auth_method',
      title: 'What authentication method will you use?',
      description: 'Select the primary authentication method',
      type: 'radio',
      options: [
        { value: 'oauth', label: 'OAuth 2.0' },
        { value: 'jwt', label: 'JWT Tokens' },
        { value: 'basic', label: 'Basic Auth' },
        { value: 'custom', label: 'Custom Authentication' },
      ],
    },
    {
      id: 'deployment',
      title: 'Where will you deploy the system?',
      description: 'Select the primary deployment environment',
      type: 'radio',
      options: [
        { value: 'aws', label: 'AWS Cloud' },
        { value: 'azure', label: 'Azure Cloud' },
        { value: 'gcp', label: 'Google Cloud' },
        { value: 'onprem', label: 'On-Premises' },
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
    if (currentQuestion.type === 'hybrid-components') {
      return;
    }
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleComponentToggle = (value: string, checked: boolean) => {
    let newComponents;
    if (checked) {
      newComponents = [...selectedComponents, value];
    } else {
      newComponents = selectedComponents.filter(c => c !== value);
    }
    setSelectedComponents(newComponents);
    setAnswers({
      ...answers,
      [currentQuestion.id]: [...newComponents, customComponents].filter(Boolean).join(', '),
    });
  };

  const handleCustomComponents = (value: string) => {
    setCustomComponents(value);
    setAnswers({
      ...answers,
      [currentQuestion.id]: [...selectedComponents, value].filter(Boolean).join(', '),
    });
  };

  const generateDiagram = () => {
    const systemName = answers.system_name || 'Main System';
    
    let plantUMLCode = '@startuml\n\n';
    
    plantUMLCode += '!theme plain\n';
    plantUMLCode += 'skinparam backgroundColor transparent\n';
    plantUMLCode += 'skinparam componentStyle rectangle\n\n';
    
    let systemShape = '';
    switch (answers.purpose) {
      case 'web_app':
        systemShape = `rectangle "${systemName}" as MainSystem #LightBlue {\n`;
        break;
      case 'mobile_app':
        systemShape = `node "${systemName}" as MainSystem #LightGreen {\n`;
        break;
      case 'api_service':
        systemShape = `cloud "${systemName}" as MainSystem #LightYellow {\n`;
        break;
      case 'microservices':
        systemShape = `package "${systemName}" as MainSystem #LightCyan {\n`;
        break;
      case 'ecommerce':
        systemShape = `rectangle "${systemName}" as MainSystem #LightPink {\n`;
        break;
      case 'cms':
        systemShape = `rectangle "${systemName}" as MainSystem #LightGrey {\n`;
        break;
      default:
        systemShape = `rectangle "${systemName}" as MainSystem {\n`;
    }
    
    plantUMLCode += systemShape;
    
    if (answers.components) {
      const componentsList = answers.components.split(',').map(comp => comp.trim());
      const processedComponents = new Set<string>();
      
      componentsList.forEach((component, index) => {
        if (!processedComponents.has(component)) {
          const compId = `comp_${index + 1}`;
          
          if (component.toLowerCase().includes('service')) {
            plantUMLCode += `  [${component}] as ${compId}\n`;
          } else if (component.toLowerCase().includes('database') || 
                   component.toLowerCase().includes('storage')) {
            plantUMLCode += `  database "${component}" as ${compId}\n`;
          } else if (component.toLowerCase().includes('api') || 
                   component.toLowerCase().includes('gateway')) {
            plantUMLCode += `  interface "${component}" as ${compId}\n`;
          } else if (component.toLowerCase().includes('broker') || 
                   component.toLowerCase().includes('queue')) {
            plantUMLCode += `  queue "${component}" as ${compId}\n`;
          } else {
            plantUMLCode += `  [${component}] as ${compId}\n`;
          }
          
          processedComponents.add(component);
        }
      });
      
      const connectedComponents = new Set<string>();
      
      for (let i = 0; i < componentsList.length - 1; i++) {
        const source = `comp_${i + 1}`;
        const target = `comp_${i + 2}`;
        const connectionKey = `${source}-${target}`;
        
        if (!connectedComponents.has(connectionKey)) {
          plantUMLCode += `  ${source} --> ${target}\n`;
          connectedComponents.add(connectionKey);
        }
      }
    }
    
    plantUMLCode += '}\n\n';
    
    if (answers.data_storage) {
      let dbName = '';
      switch (answers.data_storage) {
        case 'mysql':
          dbName = 'MySQL Database';
          break;
        case 'postgresql':
          dbName = 'PostgreSQL Database';
          break;
        case 'mongodb':
          dbName = 'MongoDB (NoSQL)';
          break;
        case 'firebase':
          dbName = 'Firebase';
          break;
        case 'multi':
          dbName = 'Multiple Databases';
          break;
        default:
          dbName = 'Database';
      }
      
      plantUMLCode += `database "${dbName}" as DB #Pink\n`;
      plantUMLCode += 'MainSystem --> DB\n\n';
    }
    
    if (answers.auth_method) {
      let authName = '';
      switch (answers.auth_method) {
        case 'oauth':
          authName = 'OAuth 2.0 Service';
          break;
        case 'jwt':
          authName = 'JWT Auth Service';
          break;
        case 'basic':
          authName = 'Basic Auth Service';
          break;
        case 'custom':
          authName = 'Custom Auth Service';
          break;
        default:
          authName = 'Auth Service';
      }
      
      plantUMLCode += `cloud "${authName}" as Auth #LightYellow\n`;
      plantUMLCode += 'MainSystem --> Auth\n\n';
    }
    
    if (answers.deployment) {
      let envName = '';
      let envColor = '';
      switch (answers.deployment) {
        case 'aws':
          envName = 'AWS Cloud';
          envColor = '#LightBlue';
          break;
        case 'azure':
          envName = 'Azure Cloud';
          envColor = '#LightCyan';
          break;
        case 'gcp':
          envName = 'Google Cloud';
          envColor = '#LightYellow';
          break;
        case 'onprem':
          envName = 'On-Premises';
          envColor = '#LightGrey';
          break;
        default:
          envName = 'Deployment Environment';
          envColor = '';
      }
      
      plantUMLCode += `cloud "${envName}" as Env ${envColor}\n`;
      plantUMLCode += 'MainSystem .... Env : deployed on\n\n';
    }
    
    plantUMLCode += '@enduml';
    
    console.log('Generated PlantUML code:', plantUMLCode);
    onCommandGenerated(plantUMLCode);
    toast.success("Generating architecture diagram based on your answers");
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'hybrid-components':
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedComponents.includes(option.value)}
                    onCheckedChange={(checked) => handleComponentToggle(option.value, checked as boolean)}
                  />
                  <Label htmlFor={option.value} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <Label htmlFor="custom-components">Or add custom components (comma-separated)</Label>
              <Textarea 
                id="custom-components"
                value={customComponents}
                onChange={(e) => handleCustomComponents(e.target.value)}
                placeholder="e.g., Search Service, Analytics Service, Report Generator"
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        );
      
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

  if (hidden) {
    return null;
  }

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
