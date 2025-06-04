
import React, { useState, useRef, useEffect, useCallback } from "react";
import { CharacterState } from "@/types/typingTypes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const Practice: React.FC = () => {
  const [customText, setCustomText] = useState<string>("");
  const [characters, setCharacters] = useState<CharacterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize characters from custom text
  const initializeCharacters = useCallback((text: string) => {
    return text.split("").map((char, index) => ({
      char,
      isCorrect: null,
      isCurrent: index === 0
    }));
  }, []);

  // Reset practice session
  const resetPractice = useCallback(() => {
    if (customText.trim()) {
      setCharacters(initializeCharacters(customText));
      setCurrentIndex(0);
      setIsTypingStarted(false);
      
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  }, [customText, initializeCharacters]);

  // Handle text change
  const handleTextChange = (value: string) => {
    setCustomText(value);
    if (value.trim()) {
      setCharacters(initializeCharacters(value));
      setCurrentIndex(0);
      setIsTypingStarted(false);
    } else {
      setCharacters([]);
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!customText.trim() || characters.length === 0) return;

    // Start typing on first keypress
    if (!isTypingStarted) {
      setIsTypingStarted(true);
    }

    // Handle backspace
    if (e.key === "Backspace" && currentIndex > 0) {
      e.preventDefault();
      
      const updatedCharacters = [...characters];
      updatedCharacters[currentIndex].isCurrent = false;
      updatedCharacters[currentIndex - 1].isCorrect = null;
      updatedCharacters[currentIndex - 1].isCurrent = true;
      
      setCharacters(updatedCharacters);
      setCurrentIndex(currentIndex - 1);
      return;
    }

    // Only process single characters
    if (e.key.length !== 1) return;

    // Process the typed character
    const currentChar = characters[currentIndex].char;
    const isCorrect = e.key === currentChar;
    
    const updatedCharacters = [...characters];
    updatedCharacters[currentIndex].isCorrect = isCorrect;
    updatedCharacters[currentIndex].isCurrent = false;
    
    // Move to next character if available
    if (currentIndex < characters.length - 1) {
      updatedCharacters[currentIndex + 1].isCurrent = true;
      setCharacters(updatedCharacters);
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of text reached
      setCharacters(updatedCharacters);
    }
  };

  // Focus input when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Render text with styling
  const renderText = () => {
    if (characters.length === 0) return null;

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
    <div className="min-h-screen flex flex-col items-center pt-12 pb-16 px-4">
      <header className="mb-12 text-center w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Test
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-primary">Practice Mode</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
        <p className="text-muted-foreground">
          Enter your own text and practice typing at your own pace
        </p>
      </header>
      
      <main className="w-full max-w-2xl flex-1 flex flex-col">
        <div className="mb-6">
          <label htmlFor="customText" className="block text-sm font-medium mb-2">
            Enter text to practice:
          </label>
          <Textarea
            id="customText"
            placeholder="Type or paste the text you want to practice typing..."
            value={customText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px] resize-y"
          />
        </div>

        {customText.trim() && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Practice Text</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPractice}
                title="Reset Practice"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="mb-8 p-6 bg-secondary rounded-lg">
              {renderText()}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {!isTypingStarted ? (
                "Start typing to practice"
              ) : currentIndex >= characters.length ? (
                "Practice completed! Click reset to try again."
              ) : (
                `${currentIndex + 1} / ${characters.length} characters`
              )}
            </div>
          </>
        )}
        
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </main>
    </div>
  );
};

export default Practice;
