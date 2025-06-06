
import React, { useEffect, useRef } from "react";
import { CharacterState } from "@/types/typingTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TypingTestDisplayProps {
  characters: CharacterState[];
  isTestActive: boolean;
  currentIndex: number;
}

const TypingTestDisplay: React.FC<TypingTestDisplayProps> = ({
  characters,
  isTestActive,
  currentIndex
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when typing reaches near the bottom
  useEffect(() => {
    if (scrollAreaRef.current && textContainerRef.current) {
      const currentChar = textContainerRef.current.querySelector(`[data-index="${currentIndex}"]`);
      if (currentChar) {
        const rect = currentChar.getBoundingClientRect();
        const containerRect = scrollAreaRef.current.getBoundingClientRect();
        
        // If current character is near the bottom of the visible area, scroll down
        if (rect.bottom > containerRect.bottom - 100) {
          currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentIndex]);

  // Render characters with better styling and colors
  const renderText = () => {
    return (
      <div ref={textContainerRef} className="text-2xl leading-relaxed tracking-wide font-mono select-none">
        {characters.map((char, index) => (
          <span
            key={index}
            data-index={index}
            className={`
              relative transition-all duration-150
              ${char.isCorrect === true ? "bg-green-500 text-white rounded px-1" : ""}
              ${char.isCorrect === false ? "bg-red-500 text-white rounded px-1" : ""}
              ${char.isCurrent ? "bg-yellow-400 text-black rounded px-1 shadow-lg border-2 border-blue-500 font-bold" : ""}
              ${char.isCorrect === null && !char.isCurrent ? "text-gray-400" : ""}
            `}
          >
            {char.char}
            {char.isCurrent && (
              <span className="absolute -top-1 -bottom-1 left-0 w-full border-2 border-blue-500 rounded animate-pulse" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 p-8 bg-secondary rounded-lg">
        <ScrollArea ref={scrollAreaRef} className="h-96 w-full pr-4">
          {renderText()}
        </ScrollArea>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        {!isTestActive ? (
          "Type to start the test"
        ) : (
          "Test in progress..."
        )}
      </div>
    </>
  );
};

export default TypingTestDisplay;
