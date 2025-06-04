
import React, { useEffect, useState, useRef, useCallback } from "react";
import { CharacterState, TimerOption, TypingStats } from "@/types/typingTypes";
import { calculateWPM, calculateAccuracy, getRandomQuote } from "@/utils/typingUtils";
import Timer from "./Timer";
import Results from "./Results";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const timerOptions: TimerOption[] = [
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 300, label: "5 minutes" }
];

const pageOptions = [
  { value: 1, label: "1 page" },
  { value: 2, label: "2 pages" },
  { value: 3, label: "3 pages" },
  { value: 5, label: "5 pages" }
];

const TypingTest: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [characters, setCharacters] = useState<CharacterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [pageCount, setPageCount] = useState<number>(1);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with a random quote
  useEffect(() => {
    resetTest();
  }, []);

  // Create character state array from quote
  const initializeCharacters = useCallback((text: string) => {
    return text.split("").map((char, index) => ({
      char,
      isCorrect: null,
      isCurrent: index === 0
    }));
  }, []);

  // Reset the test
  const resetTest = useCallback(() => {
    let newQuote = "";
    for (let i = 0; i < pageCount; i++) {
      if (i > 0) newQuote += " ";
      newQuote += getRandomQuote();
    }
    setQuote(newQuote);
    setCharacters(initializeCharacters(newQuote));
    setCurrentIndex(0);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTimeElapsed(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [initializeCharacters, pageCount]);

  // Reset test when page count changes
  useEffect(() => {
    if (!isTestActive) {
      resetTest();
    }
  }, [pageCount, resetTest, isTestActive]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Start the test on first keypress
    if (!isTestActive && !isTestComplete) {
      setIsTestActive(true);
    }

    // Don't process input if test is complete
    if (isTestComplete) return;

    // Handle backspace
    if (e.key === "Backspace" && currentIndex > 0) {
      // Prevent default behavior when using Backspace
      e.preventDefault();
      
      // Update the character states
      const updatedCharacters = [...characters];
      
      // Reset current character
      updatedCharacters[currentIndex].isCurrent = false;
      
      // Reset previous character
      updatedCharacters[currentIndex - 1].isCorrect = null;
      updatedCharacters[currentIndex - 1].isCurrent = true;
      
      setCharacters(updatedCharacters);
      setCurrentIndex(currentIndex - 1);
      
      // Adjust correct/incorrect counts if needed
      if (updatedCharacters[currentIndex - 1].isCorrect === true) {
        setCorrectChars(prev => prev - 1);
      } else if (updatedCharacters[currentIndex - 1].isCorrect === false) {
        setIncorrectChars(prev => prev - 1);
      }
      
      return;
    }

    // Only process alphanumeric keys, spaces, and punctuation
    if (e.key.length !== 1) return;

    // Process the typed character
    const currentChar = characters[currentIndex].char;
    const isCorrect = e.key === currentChar;
    
    // Update character states
    const updatedCharacters = [...characters];
    updatedCharacters[currentIndex].isCorrect = isCorrect;
    updatedCharacters[currentIndex].isCurrent = false;
    
    // Update stats
    if (isCorrect) {
      setCorrectChars(prev => prev + 1);
    } else {
      setIncorrectChars(prev => prev + 1);
    }
    
    // Move to next character if available
    if (currentIndex < characters.length - 1) {
      updatedCharacters[currentIndex + 1].isCurrent = true;
      setCharacters(updatedCharacters);
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of text reached
      setCharacters(updatedCharacters);
      finishTest();
    }
  };

  // Handle timer completion
  const handleTimeUp = () => {
    finishTest();
  };

  // Update time elapsed
  const handleTimerTick = (remainingSeconds: number) => {
    setTimeElapsed(timerDuration - remainingSeconds);
  };

  // Finish the test
  const finishTest = () => {
    setIsTestActive(false);
    setIsTestComplete(true);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Calculate typing statistics
  const getTypingStats = (): TypingStats => {
    const totalChars = correctChars + incorrectChars;
    return {
      wpm: calculateWPM(correctChars, timeElapsed),
      accuracy: calculateAccuracy(correctChars, totalChars),
      correctChars,
      incorrectChars,
      totalChars
    };
  };

  // Handle timer duration change
  const handleTimerChange = (value: string) => {
    setTimerDuration(Number(value));
    resetTest();
  };

  // Handle page count change
  const handlePageChange = (value: string) => {
    setPageCount(Number(value));
  };

  // Render characters with styling
  const renderText = () => {
    return (
      <div className="text-xl leading-relaxed tracking-wide">
        {characters.map((char, index) => (
          <span
            key={index}
            className={`
              ${char.isCorrect === true ? "correct" : ""}
              ${char.isCorrect === false ? "incorrect" : ""}
              ${char.isCurrent ? "current" : ""}
            `}
          >
            {char.char}
            {char.isCurrent && <span className="cursor" />}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {!isTestComplete ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Typing Test</h2>
            <div className="flex items-center space-x-2">
              <Select
                value={timerDuration.toString()}
                onValueChange={handleTimerChange}
                disabled={isTestActive}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={pageCount.toString()}
                onValueChange={handlePageChange}
                disabled={isTestActive}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select pages" />
                </SelectTrigger>
                <SelectContent>
                  {pageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={resetTest}
                disabled={isTestActive}
                title="New Quote"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Timer
            duration={timerDuration}
            isActive={isTestActive}
            onTimeUp={handleTimeUp}
            onTick={handleTimerTick}
          />
          
          <div className="mb-8 p-6 bg-secondary rounded-lg">
            {renderText()}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {!isTestActive ? (
              "Type to start the test"
            ) : (
              "Test in progress..."
            )}
          </div>
          
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
