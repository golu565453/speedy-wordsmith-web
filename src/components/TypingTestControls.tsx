
import React from "react";
import { TimerOption } from "@/types/typingTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const timerOptions: TimerOption[] = [
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 300, label: "5 minutes" }
];

const pageOptions = [
  { value: 1, label: "1 page", lines: 25 },
  { value: 2, label: "2 pages", lines: 50 },
  { value: 3, label: "3 pages", lines: 75 },
  { value: 5, label: "5 pages", lines: 125 }
];

interface TypingTestControlsProps {
  timerDuration: number;
  pageCount: number;
  isTestActive: boolean;
  onTimerChange: (value: string) => void;
  onPageChange: (value: string) => void;
  onReset: () => void;
}

const TypingTestControls: React.FC<TypingTestControlsProps> = ({
  timerDuration,
  pageCount,
  isTestActive,
  onTimerChange,
  onPageChange,
  onReset
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Typing Test</h2>
      <div className="flex items-center space-x-2">
        <Select
          value={timerDuration.toString()}
          onValueChange={onTimerChange}
          disabled={isTestActive}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timerOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
