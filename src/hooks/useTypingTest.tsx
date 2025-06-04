import { useState, useRef, useCallback, useEffect } from "react";
import { CharacterState, TypingStats } from "@/types/typingTypes";
import { calculateWPM, calculateAccuracy, getRandomQuote } from "@/utils/typingUtils";

// Function to generate text with specific number of lines
const generateTextWithLines = (lines: number): string => {
  const words = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "pack", "my", "box", "with",
    "five", "dozen", "liquor", "jugs", "amazingly", "few", "discotheques", "provide", "jukeboxes",
    "sphinx", "of", "black", "quartz", "judge", "vow", "waltz", "bad", "nymph", "for", "luck",
    "fjord", "type", "test", "practice", "speed", "accuracy", "keyboard", "typing", "skills",
    "improve", "learn", "fast", "words", "per", "minute", "character", "correct", "mistake",
    "focus", "concentrate", "rhythm", "flow", "smooth", "consistent", "regular", "daily"
  ];
  
  let result = "";
  const wordsPerLine = 12; // Approximately 12 words per line
  
  for (let line = 0; line < lines; line++) {
    if (line > 0) result += " ";
    
    for (let word = 0; word < wordsPerLine; word++) {
      if (word > 0) result += " ";
      result += words[Math.floor(Math.random() * words.length)];
    }
  }
  
  return result;
};

export const useTypingTest = () => {
  const [quote, setQuote] = useState<string>("");
  const [characters, setCharacters] = useState<CharacterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [pageCount, setPageCount] = useState<number>(1);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
    
    // Generate text based on page count with specific line count
    const pageOptions = [
      { value: 1, lines: 25 },
      { value: 2, lines: 50 },
      { value: 3, lines: 75 },
      { value: 5, lines: 125 }
    ];
    
    const selectedPage = pageOptions.find(p => p.value === pageCount);
    const lines = selectedPage ? selectedPage.lines : 25;
    
    newQuote = generateTextWithLines(lines);
    
    setQuote(newQuote);
    setCharacters(initializeCharacters(newQuote));
    setCurrentIndex(0);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTimeElapsed(0);
    setCompletionTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [initializeCharacters, pageCount]);

  // Initialize with a random quote
  useEffect(() => {
    resetTest();
  }, []);

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
    setCompletionTime(timeElapsed);
    finishTest();
  };

  // Update time elapsed
  const handleTimerTick = (remainingSeconds: number) => {
    setTimeElapsed(timerDuration - remainingSeconds);
  };

  // Finish the test
  const finishTest = () => {
    if (!isTestComplete) {
      setCompletionTime(timeElapsed);
    }
    setIsTestActive(false);
    setIsTestComplete(true);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Calculate typing statistics
  const getTypingStats = (): TypingStats & { completionTime: number } => {
    const totalChars = correctChars + incorrectChars;
    return {
      wpm: calculateWPM(correctChars, completionTime || timeElapsed),
      accuracy: calculateAccuracy(correctChars, totalChars),
      correctChars,
      incorrectChars,
      totalChars,
      completionTime: completionTime || timeElapsed
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

  return {
    quote,
    characters,
    currentIndex,
    isTestActive,
    isTestComplete,
    timerDuration,
    pageCount,
    timeElapsed,
    correctChars,
    incorrectChars,
    inputRef,
    resetTest,
    handleKeyDown,
    handleTimeUp,
    handleTimerTick,
    getTypingStats,
    handleTimerChange,
    handlePageChange
  };
};
