
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Plus } from "lucide-react";
import Header from "@/components/Header";
import { Template } from "@/components/TemplateSelector";
import { fetchTemplates } from "@/services/templateService";

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: "Error",
          description: "Failed to load templates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-dark">Template Gallery</h1>
          <p className="text-muted-foreground">Browse and select templates for your bill processing</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-purple-light/20 shadow-sm animate-pulse">
                <CardHeader className="bg-slate-100 h-32"></CardHeader>
                <CardContent className="pt-6">
                  <div className="h-4 bg-slate-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : templates.length > 0 ? (
            templates.map((template) => (
              <Card key={template.id} className="border border-purple-light/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-br from-purple/5 to-purple-light/10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>Bill processing template</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {template.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-light/10 text-purple-dark border-purple-light/20">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-purple hover:bg-purple-dark"
                    onClick={() => {
                      toast({
                        title: "Template selected",
                        description: `${template.name} template has been selected for your next bill.`,
                      });
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-purple/10 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-purple" />
              </div>
              <h3 className="text-xl font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">You don't have any templates yet.</p>
              <Button 
                className="bg-purple hover:bg-purple-dark"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Template creation will be available soon!",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>BillBoy &copy; {new Date().getFullYear()} • End-to-end encrypted</p>
      </footer>
    </div>
  );
};

export default Templates;
