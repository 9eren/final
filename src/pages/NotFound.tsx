
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-purple/10 flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-purple" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-purple-dark">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! We couldn't find that page</p>
        <Button asChild className="bg-purple hover:bg-purple-dark">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
