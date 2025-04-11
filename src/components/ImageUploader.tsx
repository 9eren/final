
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Trash, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploaderProps {
  onImageProcessed: (imageUrl: string, enhancedUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed }) => {
  const [image, setImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    // Programmatically trigger the file input click
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
      processImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageUrl: string) => {
    try {
      setIsProcessing(true);
      
      // Simulate image enhancement processing with a delay
      // In a real application, you would call an API to enhance the image
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just use the same image as the "enhanced" version
      // In a real app, this would be the result from your image enhancement API
      setEnhancedImage(imageUrl);
      
      // Pass both the original and enhanced image URLs to the parent component
      onImageProcessed(imageUrl, imageUrl);
      
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setEnhancedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!image ? (
        <div className="flex flex-col items-center">
          <Card className="w-full border-dashed border-2 border-purple-light hover:border-purple transition-colors animate-pulse hover:animate-none">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-purple/10 rounded-full p-4 mb-4">
                  <Upload className="h-8 w-8 text-purple" />
                </div>
                <p className="text-center mb-4">
                  <span className="font-semibold text-purple">Upload a bill image</span>
                  <br />
                  <span className="text-sm text-gray-500">PNG, JPG or PDF up to 10MB</span>
                </p>
                <input 
                  ref={fileInputRef}
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <Button 
                  className="bg-purple hover:bg-purple-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  onClick={handleButtonClick}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Original Image</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-purple/10" 
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative border border-border rounded-md overflow-hidden bg-secondary/30 transition-all duration-300">
                <img 
                  src={image} 
                  alt="Original Bill" 
                  className={`w-full object-contain ${isZoomed ? 'cursor-zoom-out max-h-[500px]' : 'cursor-zoom-in max-h-[300px]'} transition-all duration-300`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Enhanced Image</h3>
                {isProcessing ? (
                  <span className="text-xs text-purple">Processing...</span>
                ) : enhancedImage ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 hover:border-purple/50 hover:text-purple transition-colors" 
                    onClick={clearImage}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                ) : null}
              </div>
              <div className="border border-border rounded-md overflow-hidden bg-secondary/30 transition-all duration-300">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                  </div>
                ) : enhancedImage ? (
                  <img 
                    src={enhancedImage} 
                    alt="Enhanced Bill" 
                    className="w-full object-contain max-h-[300px] transition-all duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Processing image...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <input 
              ref={fileInputRef}
              id="image-upload-new" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <Button 
              variant="outline"
              className="hover:border-purple/50 hover:text-purple transition-colors"
              onClick={handleButtonClick}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              New Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
