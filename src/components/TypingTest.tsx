
import React, { useEffect, useState } from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import Results from "./Results";
import TypingTestControls from "./TypingTestControls";
import TypingTestDisplay from "./TypingTestDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TypingTest: React.FC = () => {
  const {
    characters,
    isTestActive,
    isTestComplete,
    pageCount,
    difficulty,
    currentIndex,
    inputRef,
    resetTest,
    handleKeyDown,
    getTypingStats,
    handlePageChange,
    handleDifficultyChange,
    finishTest
  } = useTypingTest();

  const [showCurrentStats, setShowCurrentStats] = useState(false);
  const [currentStats, setCurrentStats] = useState(null);

  // Add ESC key functionality
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetTest();
        setShowCurrentStats(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [resetTest]);

  const handleSubmit = () => {
    if (isTestActive) {
      const stats = getTypingStats();
      setCurrentStats(stats);
      setShowCurrentStats(true);
      finishTest(); // Finish the test when user clicks the button
    }
  };

  const handleCloseStats = () => {
    setShowCurrentStats(false);
    setCurrentStats(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {!isTestComplete ? (
        <>
          <TypingTestControls
            pageCount={pageCount}
            difficulty={difficulty}
            isTestActive={isTestActive}
            onPageChange={handlePageChange}
            onDifficultyChange={handleDifficultyChange}
            onReset={resetTest}
          />
          
          <TypingTestDisplay
            characters={characters}
            isTestActive={isTestActive}
            currentIndex={currentIndex}
          />
          
          {/* Submit button to check current speed */}
          {isTestActive && (
            <div className="text-center mt-6">
              <Button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Check Current Speed
              </Button>
            </div>
          )}
          
          {/* Current stats modal */}
          {showCurrentStats && currentStats && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="text-center">Current Typing Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <span className="text-3xl font-bold text-primary">{currentStats.wpm}</span>
                    <span className="text-lg font-medium text-primary">Words Per Minute</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-secondary rounded-lg">
                      <span className="text-xl font-bold text-green-600">{currentStats.accuracy}%</span>
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-secondary rounded-lg">
                      <span className="text-xl font-bold text-blue-600">{currentStats.totalChars}</span>
                      <span className="text-sm text-muted-foreground">Characters</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCloseStats}
                    className="w-full"
                  >
                    Continue Typing
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </>
      ) : (
        <Results stats={getTypingStats()} onRestart={resetTest} />
      )}
    </div>
  );
};

export default TypingTest;
