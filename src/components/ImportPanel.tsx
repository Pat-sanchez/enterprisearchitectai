
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, FileImage } from "lucide-react";
import { toast } from "sonner";

interface ImportPanelProps {
  onCommandGenerated: (command: string) => void;
}

const ImportPanel: React.FC<ImportPanelProps> = ({ onCommandGenerated }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("Analyzing diagram from URL...");
      
      // Simulate processing with a timeout
      setTimeout(() => {
        // Mock analysis results - in a real app, this would come from an API
        const mockCommands = [
          "system Main System",
          "microservice Authentication Service",
          "microservice Payment Service",
          "microservice User Service",
          "database User Database",
          "api API Gateway",
          "user Client",
          "connect Client to API Gateway",
          "connect API Gateway to Authentication Service",
          "connect API Gateway to Payment Service",
          "connect API Gateway to User Service",
          "connect User Service to User Database",
        ];
        
        toast.success("Diagram successfully analyzed");
        
        // Execute commands with delay
        executeCommandsSequentially(mockCommands);
      }, 2000);
    } catch (error) {
      toast.error("Failed to analyze diagram from URL");
      console.error("Error analyzing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image')) {
      toast.error("Please upload an image file");
      return;
    }
    
    setUploadedImage(file);
    toast.info("Image uploaded successfully");
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("Analyzing uploaded diagram...");
      
      // Simulate processing with a timeout
      setTimeout(() => {
        // Mock analysis results - in a real app, this would come from an API
        const mockCommands = [
          "system Enterprise System",
          "container Frontend",
          "container Backend",
          "database Main Database",
          "component Authentication",
          "component Business Logic",
          "connect Frontend to Backend",
          "connect Backend to Main Database",
          "connect Backend to Authentication",
          "connect Backend to Business Logic",
        ];
        
        toast.success("Diagram successfully analyzed");
        
        // Execute commands with delay
        executeCommandsSequentially(mockCommands);
      }, 2000);
    } catch (error) {
      toast.error("Failed to analyze uploaded diagram");
      console.error("Error analyzing image:", error);
    } finally {
      setIsLoading(false);
      setUploadedImage(null); // Reset after processing
      
      // Reset file input
      const fileInput = document.getElementById('diagram-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" /> URL Import
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" /> File Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle>Import from URL</CardTitle>
                <CardDescription>
                  Enter the URL of a webpage containing an architecture diagram
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUrlSubmit}>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Input
                      placeholder="https://example.com/architecture-diagram"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      type="url"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Diagram"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Diagram Image</CardTitle>
                <CardDescription>
                  Upload an image file of your architecture diagram
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleImageSubmit}>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        id="diagram-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    
                    {uploadedImage && (
                      <div className="border rounded-md p-4 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileImage className="h-5 w-5 text-primary" />
                          <span className="font-medium">{uploadedImage.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(uploadedImage.size / 1024)} KB
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !uploadedImage}
                    className="w-full"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Diagram"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImportPanel;
