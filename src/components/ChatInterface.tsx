
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMessage: (message: string) => void;
  onAiResponse: (response: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onMessage, onAiResponse }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your enterprise architecture assistant. Describe the components of your system, and I'll help you visualize it. You can say things like 'add a database', 'add a service named Payment API', or 'connect the last two elements with REST API'.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onMessage(input);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = processUserInput(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      onAiResponse(aiMessage);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Attempt to start recording
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast.success('Voice recording started');
        })
        .catch(() => {
          toast.error('Unable to access microphone');
        });
    } else {
      // Stop recording
      setIsRecording(false);
      toast.info('Voice recording stopped');
      // In a real app, you would process the voice recording here
    }
  };

  // Simple processing logic - in a real app this would be more sophisticated
  const processUserInput = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('database')) {
      return "I've added a database to your diagram.";
    } else if (input.includes('service')) {
      return "I've added a service component to your diagram.";
    } else if (input.includes('api')) {
      return "I've added an API component to your diagram.";
    } else if (input.includes('microservice')) {
      return "I've added a microservice to your diagram.";
    } else if (input.includes('user')) {
      return "I've added a user to your diagram.";
    } else if (input.includes('system')) {
      return "I've added a system to your diagram.";
    } else if (input.includes('container')) {
      return "I've added a container to your diagram.";
    } else if (input.includes('component')) {
      return "I've added a component to your diagram.";
    } else if (input.includes('connect')) {
      return "I've connected the last two components in your diagram.";
    } else if (input.includes('delete') || input.includes('remove')) {
      return "I've removed the last element from your diagram.";
    } else if (input.includes('help')) {
      return "You can ask me to add components like databases, services, APIs, microservices, users, systems, containers, and components. You can also connect components by saying 'connect the last two components' or similar phrases. To name a component, say something like 'add a service named Payment Processor'.";
    } else {
      return "I'm not sure how to process that request. Try asking me to add a database, service, API, microservice, user, system, container, or component. You can also connect components or remove the last element.";
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900">
        <h2 className="font-medium">Enterprise Architecture Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex max-w-[80%] rounded-lg p-3",
                message.sender === 'user'
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your enterprise architecture components..."
            className="min-h-[60px] flex-1"
          />
          <Button
            onClick={toggleRecording}
            variant="outline"
            size="icon"
            className={cn(isRecording ? "bg-red-100 text-red-500 border-red-200" : "")}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
