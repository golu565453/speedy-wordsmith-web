
import React from "react";
import { CharacterState } from "@/types/typingTypes";

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
              ${char.isCorrect === true ? "bg-green-400 text-white rounded px-1" : ""}
              ${char.isCorrect === false ? "bg-red-400 text-white rounded px-1" : ""}
              ${char.isCurrent ? "bg-yellow-300 text-black rounded px-1 shadow-lg" : ""}
              ${char.isCorrect === null && !char.isCurrent ? "text-gray-600" : ""}
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
      <div className="mb-8 p-8 bg-secondary rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-hidden">
          {renderText()}
        </div>
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
