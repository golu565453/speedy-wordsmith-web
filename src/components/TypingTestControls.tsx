
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const pageOptions = [
  { value: 1, label: "1 page", lines: 25 },
  { value: 2, label: "2 pages", lines: 50 },
  { value: 3, label: "3 pages", lines: 75 },
  { value: 5, label: "5 pages", lines: 125 }
];

interface TypingTestControlsProps {
  pageCount: number;
  isTestActive: boolean;
  onPageChange: (value: string) => void;
  onReset: () => void;
}

const TypingTestControls: React.FC<TypingTestControlsProps> = ({
  pageCount,
  isTestActive,
  onPageChange,
  onReset
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Typing Test</h2>
      <div className="flex items-center space-x-2">
        <Select
          value={pageCount.toString()}
          onValueChange={onPageChange}
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
          onClick={onReset}
          disabled={isTestActive}
          title="New Quote"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TypingTestControls;
