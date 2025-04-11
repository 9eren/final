
import { Template } from '@/components/TemplateSelector';
import { ExtractedItem } from '@/components/ExtractedDataEditor';

// Mock templates data
export const fetchTemplates = async (): Promise<Template[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'grocery',
      name: 'Grocery Receipt',
      categories: ['Dairy', 'Produce', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other']
    },
    {
      id: 'restaurant',
      name: 'Restaurant Bill',
      categories: ['Appetizers', 'Main Course', 'Beverages', 'Desserts', 'Alcohol', 'Tax', 'Tip']
    },
    {
      id: 'office',
      name: 'Office Supplies',
      categories: ['Stationery', 'Electronics', 'Furniture', 'Kitchen', 'Cleaning', 'Software', 'Other']
    },
    {
      id: 'utility',
      name: 'Utility Bill',
      categories: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone', 'Cable', 'Fees']
    }
  ];
};

// Mock function to categorize items based on template
export const categorizeItems = async (
  items: { name: string; amount: number }[], 
  template: Template
): Promise<ExtractedItem[]> => {
  // In a real app, this would use AI to categorize items based on the template
  // For this demo, we'll use a simple mapping

  const categorizeItem = (name: string): string => {
    name = name.toLowerCase();
    
    // Simple rules for grocery template
    if (template.id === 'grocery') {
      if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) {
        return 'Dairy';
      } else if (name.includes('apple') || name.includes('vegetable') || name.includes('fruit')) {
        return 'Produce';
      } else if (name.includes('chicken') || name.includes('beef') || name.includes('fish')) {
        return 'Meat';
      } else if (name.includes('bread') || name.includes('cake') || name.includes('muffin')) {
        return 'Bakery';
      } else if (name.includes('rice') || name.includes('pasta') || name.includes('cereal')) {
        return 'Pantry';
      }
    }
    
    // Simple rules for restaurant template
    if (template.id === 'restaurant') {
      if (name.includes('salad') || name.includes('appetizer') || name.includes('starter')) {
        return 'Appetizers';
      } else if (name.includes('burger') || name.includes('steak') || name.includes('pasta')) {
        return 'Main Course';
      } else if (name.includes('soda') || name.includes('coffee') || name.includes('tea')) {
        return 'Beverages';
      } else if (name.includes('dessert') || name.includes('cake') || name.includes('ice')) {
        return 'Desserts';
      }
    }
    
    // Default to the first category
    return template.categories[0];
  };

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return items.map((item, index) => ({
    id: `extracted-${index}`,
    name: item.name,
    category: categorizeItem(item.name),
    amount: item.amount
  }));
};
