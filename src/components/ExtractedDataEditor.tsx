
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export interface ExtractedItem {
  id: string;
  name: string;
  category: string;
  amount: number;
}

interface ExtractedDataEditorProps {
  items: ExtractedItem[];
  categories: string[];
  onDataChange: (items: ExtractedItem[]) => void;
}

const ExtractedDataEditor: React.FC<ExtractedDataEditorProps> = ({ 
  items, 
  categories, 
  onDataChange 
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editableItems, setEditableItems] = useState<ExtractedItem[]>(items);
  
  useEffect(() => {
    setEditableItems(items);
  }, [items]);

  const startEditing = (id: string) => {
    setEditingItemId(id);
  };

  const stopEditing = () => {
    setEditingItemId(null);
    onDataChange(editableItems);
    toast.success('Data updated successfully');
  };

  const handleItemChange = (id: string, field: keyof ExtractedItem, value: string | number) => {
    const updatedItems = editableItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    
    setEditableItems(updatedItems);
  };

  const addNewItem = () => {
    const newItem: ExtractedItem = {
      id: `item-${Date.now()}`,
      name: '',
      category: categories[0] || 'Uncategorized',
      amount: 0
    };
    
    setEditableItems([...editableItems, newItem]);
    setEditingItemId(newItem.id);
  };

  const deleteItem = (id: string) => {
    const updatedItems = editableItems.filter(item => item.id !== id);
    setEditableItems(updatedItems);
    onDataChange(updatedItems);
    toast.success('Item deleted');
  };

  const calculateTotal = () => {
    return editableItems.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
  };
  
  const calculateCategoryTotals = () => {
    const totals: Record<string, number> = {};
    
    editableItems.forEach(item => {
      if (!totals[item.category]) {
        totals[item.category] = 0;
      }
      totals[item.category] += Number(item.amount);
    });
    
    return totals;
  };

  const categoryTotals = calculateCategoryTotals();

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Extracted Items</span>
            <Button 
              onClick={addNewItem} 
              size="sm" 
              className="h-8"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-light/10">
                  <TableHead className="w-[40%]">Item</TableHead>
                  <TableHead className="w-[30%]">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editableItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No items extracted yet. Upload a bill to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  editableItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {editingItemId === item.id ? (
                          <Input 
                            value={item.name} 
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} 
                          />
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItemId === item.id ? (
                          <select
                            className="w-full border border-input rounded-md h-10 px-3"
                            value={item.category}
                            onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          >
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2 py-1 bg-purple-light/10 text-xs rounded-md">
                            {item.category}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingItemId === item.id ? (
                          <Input 
                            type="number"
                            value={item.amount} 
                            onChange={(e) => handleItemChange(item.id, 'amount', Number(e.target.value))} 
                            className="text-right"
                          />
                        ) : (
                          <span>${item.amount.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          {editingItemId === item.id ? (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={stopEditing}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditing(item.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                
                {editableItems.length > 0 && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${calculateTotal()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {editableItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Category Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple mr-2"></div>
                    <span>{category}</span>
                  </div>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExtractedDataEditor;
