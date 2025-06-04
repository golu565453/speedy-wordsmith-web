
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
    <>
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
    </>
  );
};

export default TypingTestDisplay;
