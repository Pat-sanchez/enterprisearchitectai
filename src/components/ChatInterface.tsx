
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
      content: "Hello! I'm your architectural assistant. Describe the building you'd like to create, and I'll help you visualize it. You can say things like 'draw a rectangular room', 'add a door to the north wall', or 'add a window on the east wall'.",
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
    
    if (input.includes('rectangle') || input.includes('room')) {
      return "I've added a rectangular room to your diagram.";
    } else if (input.includes('door')) {
      return "I've added a door as requested.";
    } else if (input.includes('window')) {
      return "I've added a window to the wall.";
    } else if (input.includes('wall')) {
      return "I've added a wall to your diagram.";
    } else if (input.includes('delete') || input.includes('remove')) {
      return "I've removed that element from your diagram.";
    } else if (input.includes('help')) {
      return "You can ask me to draw rooms, add walls, doors, and windows. Try saying things like 'add a rectangular room', 'place a door on the north wall', or 'add a window to the east wall'.";
    } else {
      return "I'm not sure how to process that request. Try asking me to draw a room, add a wall, door, or window.";
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="p-3 border-b bg-muted dark:bg-gray-900">
        <h2 className="font-medium">Architectural Assistant</h2>
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
            placeholder="Describe what you want to build..."
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
