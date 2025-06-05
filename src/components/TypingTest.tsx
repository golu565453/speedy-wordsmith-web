
import React, { useEffect } from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import Results from "./Results";
import TypingTestControls from "./TypingTestControls";
import TypingTestDisplay from "./TypingTestDisplay";

const TypingTest: React.FC = () => {
  const {
    characters,
    isTestActive,
    isTestComplete,
    pageCount,
    inputRef,
    resetTest,
    handleKeyDown,
    getTypingStats,
    handlePageChange
  } = useTypingTest();

  // Add ESC key functionality
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetTest();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [resetTest]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {!isTestComplete ? (
        <>
          <TypingTestControls
            pageCount={pageCount}
            isTestActive={isTestActive}
            onPageChange={handlePageChange}
            onReset={resetTest}
          />
          
          <TypingTestDisplay
            characters={characters}
            isTestActive={isTestActive}
          />
          
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
