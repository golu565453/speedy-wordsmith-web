
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
  // Render characters with styling
  const renderText = () => {
    return (
      <div className="text-xl leading-relaxed tracking-wide font-mono">
        {characters.map((char, index) => (
          <span
            key={index}
            className={`
              relative
              ${char.isCorrect === true ? "bg-green-200 text-green-800" : ""}
              ${char.isCorrect === false ? "bg-red-200 text-red-800" : ""}
              ${char.isCurrent ? "bg-blue-200" : ""}
            `}
          >
            {char.char}
            {char.isCurrent && (
              <span className="absolute top-0 left-0 w-full h-full border-l-2 border-blue-600 animate-pulse" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 p-6 bg-secondary rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
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
