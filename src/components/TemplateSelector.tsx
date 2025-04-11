
import React from 'react';
import { Check } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface Template {
  id: string;
  name: string;
  categories: string[];
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate
}) => {
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="template-select" className="block text-sm font-medium mb-2">
        Select Template
      </label>
      <Select
        value={selectedTemplate?.id}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex items-center">
                <span>{template.name}</span>
                {selectedTemplate?.id === template.id && (
                  <Check className="ml-2 h-4 w-4 text-purple" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedTemplate && (
        <div className="mt-3 bg-purple-light/10 rounded-md p-3">
          <p className="text-sm font-medium text-purple-dark mb-1">Categories in this template:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTemplate.categories.map((category, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-light/20 text-purple-dark text-xs rounded-md"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
