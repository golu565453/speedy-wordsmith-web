
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const pageOptions = [
  { value: 1, label: "1 page", lines: 25 },
  { value: 2, label: "2 pages", lines: 50 },
  { value: 3, label: "3 pages", lines: 75 },
  { value: 5, label: "5 pages", lines: 125 }
];

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

interface TypingTestControlsProps {
  pageCount: number;
  difficulty: string;
  isTestActive: boolean;
  onPageChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onReset: () => void;
}

const TypingTestControls: React.FC<TypingTestControlsProps> = ({
  pageCount,
  difficulty,
  isTestActive,
  onPageChange,
  onDifficultyChange,
  onReset
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Typing Test</h2>
      <div className="flex items-center space-x-2">
        <Select
          value={difficulty}
          onValueChange={onDifficultyChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={pageCount.toString()}
          onValueChange={onPageChange}
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
        
        <Link to="/practice">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Practice Mode
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TypingTestControls;
