
import React from "react";
import { FileText, Upload, BarChart2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-md border-b border-purple-light/20 sticky top-0 z-10 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-purple/10 p-2 rounded-full">
            <div className="text-purple font-bold text-lg">bb</div>
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple to-purple-dark bg-clip-text text-transparent">BillBoy</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hover:bg-purple/10 transition-colors">
            <Link to="/templates">
              <FileText className="h-5 w-5 text-purple mr-1" />
              <span>Templates</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hover:bg-purple/10 transition-colors">
            <Link to="/analytics">
              <BarChart2 className="h-5 w-5 text-purple mr-1" />
              <span>Analytics</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hover:bg-purple/10 transition-colors">
            <Link to="/security">
              <Lock className="h-5 w-5 text-purple mr-1" />
              <span>Security</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

