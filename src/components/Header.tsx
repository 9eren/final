
import React from "react";
import { FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm border-b border-purple-light/20 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-purple" />
          <h1 className="text-xl font-semibold text-purple-dark">BillScribe</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-purple" />
          </Button>
        </div>
      </div>
    </header>
  );
}
