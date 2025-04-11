
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import TemplateSelector, { Template } from "@/components/TemplateSelector";
import ExtractedDataEditor, { ExtractedItem } from "@/components/ExtractedDataEditor";
import { extractTextFromImage, processExtractedText } from "@/services/imageProcessing";
import { fetchTemplates, categorizeItems } from "@/services/templateService";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  useEffect(() => {
    // Load templates when component mounts
    const loadTemplates = async () => {
      try {
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
        
        // Set a default template
        if (templatesData.length > 0) {
          setSelectedTemplate(templatesData[0]);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Failed to load templates');
      }
    };
    
    loadTemplates();
  }, []);

  const handleImageProcessed = (imageUrl: string, enhancedUrl: string) => {
    setUploadedImage(imageUrl);
    setEnhancedImage(enhancedUrl);
    
    // Move to the next tab
    setActiveTab("template");
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };
  
  const handleProcessImage = async () => {
    if (!uploadedImage || !selectedTemplate) {
      toast.error('Please upload an image and select a template first');
      return;
    }
    
    try {
      setIsProcessingText(true);
      
      // Extract text from the image
      const extractedData = await extractTextFromImage(uploadedImage);
      
      // Process the extracted text
      const processedData = await processExtractedText(
        extractedData.text, 
        selectedTemplate.categories
      );
      
      // Categorize items based on the selected template
      const categorizedItems = await categorizeItems(
        processedData.items, 
        selectedTemplate
      );
      
      setExtractedItems(categorizedItems);
      
      // Move to the edit tab
      setActiveTab("edit");
      
      toast.success('Bill processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process bill. Please try again.');
    } finally {
      setIsProcessingText(false);
    }
  };
  
  const handleSaveData = () => {
    // In a real app, this would save data to a database
    toast.success('Data saved successfully!');
    
    // For demo purposes, we'll log the data
    console.log('Saved data:', {
      template: selectedTemplate,
      items: extractedItems
    });
  };
  
  const handleDataChange = (updatedItems: ExtractedItem[]) => {
    setExtractedItems(updatedItems);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-dark">Bill Processor</h1>
          <p className="text-muted-foreground">Upload, analyze, and categorize your bills automatically</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Bill</TabsTrigger>
            <TabsTrigger 
              value="template" 
              disabled={!uploadedImage}
            >
              Select Template
            </TabsTrigger>
            <TabsTrigger 
              value="edit" 
              disabled={!uploadedImage || !selectedTemplate || extractedItems.length === 0}
            >
              Edit & Categorize
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-8">
            <TabsContent value="upload" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <ImageUploader 
                    onImageProcessed={handleImageProcessed}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="template" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <TemplateSelector
                        templates={templates}
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={handleSelectTemplate}
                      />
                    </div>
                    
                    {uploadedImage && (
                      <div>
                        <p className="text-sm font-medium mb-2">Selected Image</p>
                        <div className="border border-border rounded-md overflow-hidden bg-secondary/30 h-[200px] flex items-center justify-center">
                          <img 
                            src={enhancedImage || uploadedImage} 
                            alt="Selected Bill" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleProcessImage}
                      disabled={isProcessingText || !selectedTemplate}
                      className="bg-purple hover:bg-purple-dark"
                    >
                      {isProcessingText ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Process Bill'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="edit" className="mt-0">
              {selectedTemplate && (
                <ExtractedDataEditor
                  items={extractedItems}
                  categories={selectedTemplate.categories}
                  onDataChange={handleDataChange}
                />
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSaveData}
                  className="bg-purple hover:bg-purple-dark"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Data
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>BillScribe &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
