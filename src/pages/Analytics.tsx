import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import Header from "@/components/Header";

// Mock data for demonstration
const mockCategoryData = [
  { name: 'Groceries', total: 425 },
  { name: 'Utilities', total: 180 },
  { name: 'Dining', total: 320 },
  { name: 'Entertainment', total: 150 },
  { name: 'Transportation', total: 210 },
];

const mockTimelineData = [
  { date: '01/04', groceries: 120, utilities: 45, dining: 75 },
  { date: '08/04', groceries: 95, utilities: 0, dining: 85 },
  { date: '15/04', groceries: 60, utilities: 90, dining: 0 },
  { date: '22/04', groceries: 80, utilities: 0, dining: 100 },
  { date: '29/04', groceries: 70, utilities: 45, dining: 60 },
];

const COLORS = ['#9b87f5', '#D6BCFA', '#E5DEFF', '#8E9196', '#1A1F2C'];

interface DateRange {
  from: Date;
  to?: Date;
}

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2025, 3, 1), // April 1st, 2025
    to: new Date(2025, 3, 30), // April 30th, 2025
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Format the date range for display
  const formatDateRange = () => {
    if (!dateRange.from) return "Select date range";
    
    if (!dateRange.to) {
      return format(dateRange.from, "PPP");
    }
    
    return `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-dark">Bill Analytics</h1>
          <p className="text-muted-foreground">Analyze your spending patterns and track expenses over time</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) setDateRange(range);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Total expenses from {format(dateRange.from, "MMM d")} to {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : format(dateRange.from, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Spending Over Time</CardTitle>
              <CardDescription>Weekly spending patterns</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ChartContainer
                  config={{
                    groceries: {
                      label: "Groceries",
                      color: "#9b87f5"
                    },
                    utilities: {
                      label: "Utilities",
                      color: "#D6BCFA"
                    },
                    dining: {
                      label: "Dining",
                      color: "#E5DEFF"
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="groceries" stackId="a" fill="var(--color-groceries)" />
                      <Bar dataKey="utilities" stackId="a" fill="var(--color-utilities)" />
                      <Bar dataKey="dining" stackId="a" fill="var(--color-dining)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Expense Insights</CardTitle>
            <CardDescription>Summary of your spending habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-dark mb-2">Top Spending Category</h3>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-purple flex items-center justify-center text-white text-xl font-bold">
                    ₹{mockCategoryData[0].total}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{mockCategoryData[0].name}</p>
                    <p className="text-sm text-muted-foreground">Accounts for {((mockCategoryData[0].total / mockCategoryData.reduce((acc, curr) => acc + curr.total, 0)) * 100).toFixed(0)}% of your total spending</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-dark mb-2">Weekly Average Spending</h3>
                <p className="text-2xl font-bold">₹{(mockCategoryData.reduce((acc, curr) => acc + curr.total, 0) / 4).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>BillBoy &copy; {new Date().getFullYear()} • End-to-end encrypted</p>
      </footer>
    </div>
  );
};

export default Analytics;
