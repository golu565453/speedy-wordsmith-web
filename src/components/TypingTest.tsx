
import React from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import Timer from "./Timer";
import Results from "./Results";
import TypingTestControls from "./TypingTestControls";
import TypingTestDisplay from "./TypingTestDisplay";

const TypingTest: React.FC = () => {
  const {
    characters,
    isTestActive,
    isTestComplete,
    timerDuration,
    pageCount,
    inputRef,
    resetTest,
    handleKeyDown,
    handleTimeUp,
    handleTimerTick,
    getTypingStats,
    handleTimerChange,
    handlePageChange
  } = useTypingTest();

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {!isTestComplete ? (
        <>
          <TypingTestControls
            timerDuration={timerDuration}
            pageCount={pageCount}
            isTestActive={isTestActive}
            onTimerChange={handleTimerChange}
            onPageChange={handlePageChange}
            onReset={resetTest}
          />
          
          <Timer
            duration={timerDuration}
            isActive={isTestActive}
            onTimeUp={handleTimeUp}
            onTick={handleTimerTick}
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
