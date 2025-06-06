import { useState, useRef, useCallback, useEffect } from "react";
import { CharacterState, TypingStats } from "@/types/typingTypes";
import { calculateWPM, calculateAccuracy } from "@/utils/typingUtils";

// Function to generate text based on difficulty
const generateTextByDifficulty = (lines: number, difficulty: string): string => {
  const easyWords = [
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one",
    "our", "out", "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see",
    "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use", "big",
    "end", "far", "may", "off", "own", "run", "sit", "try", "car", "cut", "dog", "eat", "eye"
  ];
  
  const mediumWords = [
    "about", "after", "again", "against", "before", "being", "between", "could", "during", "every",
    "found", "great", "group", "important", "large", "never", "number", "other", "place", "point",
    "right", "small", "sound", "still", "system", "three", "through", "together", "under", "water",
    "where", "while", "without", "world", "would", "write", "young", "example", "general", "government"
  ];
  
  const hardWords = [
    "absolutely", "acceptance", "accomplish", "architecture", "beautiful", "characteristics", "communicate",
    "complicated", "concentration", "consideration", "development", "environment", "immediately", "independent",
    "information", "intelligence", "international", "investigation", "organization", "performance", "possibility",
    "professional", "recommendation", "responsibility", "sophisticated", "understanding", "unfortunately",
    "comprehensive", "extraordinary", "implementation", "representation", "transformation", "administration"
  ];
  
  let wordList = easyWords;
  if (difficulty === "medium") wordList = mediumWords;
  if (difficulty === "hard") wordList = hardWords;
  
  let result = "";
  const wordsPerLine = difficulty === "hard" ? 8 : difficulty === "medium" ? 10 : 12;
  
  for (let line = 0; line < lines; line++) {
    if (line > 0) result += " ";
    
    for (let word = 0; word < wordsPerLine; word++) {
      if (word > 0) result += " ";
      result += wordList[Math.floor(Math.random() * wordList.length)];
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
  const [pageCount, setPageCount] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
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
    const pageOptions = [
      { value: 1, lines: 25 },
      { value: 2, lines: 50 },
      { value: 3, lines: 75 },
      { value: 5, lines: 125 }
    ];
    
    const selectedPage = pageOptions.find(p => p.value === pageCount);
    const lines = selectedPage ? selectedPage.lines : 25;
    
    const newQuote = generateTextByDifficulty(lines, difficulty);
    
    setQuote(newQuote);
    setCharacters(initializeCharacters(newQuote));
    setCurrentIndex(0);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTimeElapsed(0);
    setCompletionTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setStartTime(0);
    
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [initializeCharacters, pageCount, difficulty]);

  // Initialize with easy text
  useEffect(() => {
    resetTest();
  }, []);

  // Reset test when page count or difficulty changes
  useEffect(() => {
    if (!isTestActive) {
      resetTest();
    }
  }, [pageCount, difficulty, resetTest, isTestActive]);

  // Timer for tracking elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTestActive && !isTestComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestActive, isTestComplete]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Start the test on first keypress
    if (!isTestActive && !isTestComplete) {
      setIsTestActive(true);
      setStartTime(Date.now());
    }

    // Don't process input if test is complete
    if (isTestComplete) return;

    // Handle backspace
    if (e.key === "Backspace" && currentIndex > 0) {
      e.preventDefault();
      
      const updatedCharacters = [...characters];
      updatedCharacters[currentIndex].isCurrent = false;
      updatedCharacters[currentIndex - 1].isCorrect = null;
      updatedCharacters[currentIndex - 1].isCurrent = true;
      
      setCharacters(updatedCharacters);
      setCurrentIndex(currentIndex - 1);
      
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
    const finalTime = completionTime || timeElapsed;
    return {
      wpm: calculateWPM(correctChars, finalTime),
      accuracy: calculateAccuracy(correctChars, totalChars),
      correctChars,
      incorrectChars,
      totalChars,
      completionTime: finalTime
    };
  };

  // Handle page count change
  const handlePageChange = (value: string) => {
    setPageCount(Number(value));
  };

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value);
  };

  return {
    quote,
    characters,
    currentIndex,
    isTestActive,
    isTestComplete,
    pageCount,
    difficulty,
    timeElapsed,
    correctChars,
    incorrectChars,
    inputRef,
    resetTest,
    handleKeyDown,
    getTypingStats,
    handlePageChange,
    handleDifficultyChange
  };
};
