
import React, { useEffect } from "react";
import TypingTest from "@/components/TypingTest";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Index = () => {
  // Focus on the page when it loads
  useEffect(() => {
    window.focus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 pb-16 px-4">
      <header className="mb-12 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-primary">SpeedType</h1>
          <Link to="/practice">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Practice Mode
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Improve your typing speed and accuracy with this typing test
        </p>
      </header>
      
      <main className="w-full flex-1 flex flex-col items-center">
        <TypingTest />
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground space-y-2">
        <p>Click anywhere and start typing to begin the test.</p>
        <p>
          Press <kbd className="px-2 py-1 bg-secondary rounded text-xs">ESC</kbd> to restart the test.
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-primary font-medium">Made by Golu Prajapati</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
