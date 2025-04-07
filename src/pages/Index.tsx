
import React, { useEffect } from "react";
import TypingTest from "@/components/TypingTest";

const Index = () => {
  // Focus on the page when it loads
  useEffect(() => {
    window.focus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 pb-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">SpeedType</h1>
        <p className="text-muted-foreground">
          Improve your typing speed and accuracy with this typing test
        </p>
      </header>
      
      <main className="w-full flex-1 flex flex-col items-center">
        <TypingTest />
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Click anywhere and start typing to begin the test.</p>
        <p className="mt-1">
          Press <kbd className="px-2 py-1 bg-secondary rounded text-xs">ESC</kbd> to restart.
        </p>
      </footer>
    </div>
  );
};

export default Index;
