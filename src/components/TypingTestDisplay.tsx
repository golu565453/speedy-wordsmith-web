
import React from "react";
import { CharacterState } from "@/types/typingTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TypingTestDisplayProps {
  characters: CharacterState[];
  isTestActive: boolean;
}

const TypingTestDisplay: React.FC<TypingTestDisplayProps> = ({
  characters,
  isTestActive
}) => {
  // Render characters with better styling and colors
  const renderText = () => {
    return (
      <div className="text-2xl leading-relaxed tracking-wide font-mono select-none">
        {characters.map((char, index) => (
          <span
            key={index}
            className={`
              relative transition-all duration-150
              ${char.isCorrect === true ? "bg-green-500 text-white rounded px-1" : ""}
              ${char.isCorrect === false ? "bg-red-500 text-white rounded px-1" : ""}
              ${char.isCurrent ? "bg-blue-500 text-white rounded px-1 shadow-lg border-2 border-yellow-400" : ""}
              ${char.isCorrect === null && !char.isCurrent ? "text-gray-400" : ""}
            `}
          >
            {char.char}
            {char.isCurrent && (
              <span className="absolute -top-1 -bottom-1 left-0 w-full border-2 border-yellow-400 rounded animate-pulse" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 p-8 bg-secondary rounded-lg">
        <ScrollArea className="h-96 w-full pr-4">
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
