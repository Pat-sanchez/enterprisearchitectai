
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantUMLViewerProps {
  plantUMLCode: string;
}

const PlantUMLViewer: React.FC<PlantUMLViewerProps> = ({ plantUMLCode }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      if (!plantUMLCode) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Encode PlantUML for the URL
        // PlantText uses a simple format: https://www.planttext.com/api/plantuml/svg/[encoded-text]
        const encodedCode = encodeURIComponent(plantUMLCode);
        const url = `https://www.planttext.com/api/plantuml/svg/${encodedCode}`;
        
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error generating PlantUML diagram:', err);
        setError('Failed to generate diagram');
        setLoading(false);
      }
    };

    generateImage();
  }, [plantUMLCode]);

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-8">
        <div className="space-y-4 w-full">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-20 w-1/2 mx-auto" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <p className="text-sm mt-2">Please check your PlantUML syntax</p>
        </div>
      </Card>
    );
  }

  if (!plantUMLCode) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p>No diagram code available</p>
          <p className="text-sm mt-2">Complete the wizard to generate a diagram</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex items-center justify-center p-4 overflow-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="PlantUML Diagram"
          className="max-w-full max-h-full"
          onError={() => setError('Failed to load diagram image')}
        />
      )}
    </Card>
  );
};

export default PlantUMLViewer;
