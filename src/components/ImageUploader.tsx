import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Trash, ZoomIn, X, FilePlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageUploaderProps {
  onImageProcessed: (imageUrl: string, enhancedUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed }) => {
  const [images, setImages] = useState<{ original: string; enhanced: string | null }[]>([]);
  const [processingIndexes, setProcessingIndexes] = useState<number[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    // Programmatically trigger the file input click
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array and process each file
    Array.from(files).forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Image ${file.name} is larger than 10MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImages(prevImages => [...prevImages, { original: result, enhanced: null }]);
        processImage(result, images.length);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImage = async (imageUrl: string, index: number) => {
    try {
      setProcessingIndexes(prev => [...prev, index]);
      
      // Simulate image enhancement processing with a delay
      // In a real application, you would call an API to enhance the image
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just use the same image as the "enhanced" version
      // In a real app, this would be the result from your image enhancement API
      setImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], enhanced: imageUrl };
        return updated;
      });

      // If this is the first image, automatically select it
      if (index === 0 && selectedImageIndex === -1) {
        setSelectedImageIndex(0);
        onImageProcessed(imageUrl, imageUrl);
      }
      
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setProcessingIndexes(prev => prev.filter(i => i !== index));
    }
  };

  const clearImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    // If we removed the selected image, update the selection
    if (index === selectedImageIndex) {
      if (images.length > 1) {
        const newIndex = index === 0 ? 0 : index - 1;
        setSelectedImageIndex(newIndex);
        const image = images[newIndex];
        if (image.enhanced) {
          onImageProcessed(image.original, image.enhanced);
        }
      } else {
        setSelectedImageIndex(-1);
      }
    } else if (index < selectedImageIndex) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
    const image = images[index];
    if (image.enhanced) {
      onImageProcessed(image.original, image.enhanced);
    }
  };

  const clearAllImages = () => {
    setImages([]);
    setSelectedImageIndex(-1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {images.length === 0 ? (
        <div className="flex flex-col items-center">
          <Card className="w-full border-dashed border-2 border-purple-light hover:border-purple transition-colors animate-pulse hover:animate-none">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-purple/10 rounded-full p-4 mb-4">
                  <Upload className="h-8 w-8 text-purple" />
                </div>
                <p className="text-center mb-4">
                  <span className="font-semibold text-purple">Upload bill images</span>
                  <br />
                  <span className="text-sm text-gray-500">PNG, JPG up to 10MB each</span>
                </p>
                <input 
                  ref={fileInputRef}
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  multiple 
                />
                <Button 
                  className="bg-purple hover:bg-purple-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  onClick={handleButtonClick}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Select Multiple Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Uploaded Images ({images.length})</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:border-purple/50 hover:text-purple transition-colors" 
              onClick={clearAllImages}
            >
              <Trash className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
          
          <ScrollArea className="h-24 mb-4 border rounded-md p-2">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index ? 'border-purple' : 'border-transparent hover:border-purple/50'
                  }`}
                  onClick={() => selectImage(index)}
                >
                  <img 
                    src={image.original} 
                    alt={`Bill ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                  <button 
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage(index);
                    }}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                  {processingIndexes.includes(index) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ))}
              <div 
                className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-purple/50"
                onClick={handleButtonClick}
              >
                <Plus className="h-8 w-8 text-gray-400" />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  multiple 
                />
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex flex-col md:flex-row gap-4">
            {selectedImageIndex !== -1 && (
              <>
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
                      src={images[selectedImageIndex]?.original} 
                      alt="Original Bill" 
                      className={`w-full object-contain ${isZoomed ? 'cursor-zoom-out max-h-[500px]' : 'cursor-zoom-in max-h-[300px]'} transition-all duration-300`}
                      onClick={() => setIsZoomed(!isZoomed)}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Enhanced Image</h3>
                    {processingIndexes.includes(selectedImageIndex) ? (
                      <span className="text-xs text-purple">Processing...</span>
                    ) : null}
                  </div>
                  <div className="border border-border rounded-md overflow-hidden bg-secondary/30 transition-all duration-300">
                    {processingIndexes.includes(selectedImageIndex) ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
                      </div>
                    ) : images[selectedImageIndex]?.enhanced ? (
                      <img 
                        src={images[selectedImageIndex].enhanced!} 
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
