
import React from "react";
import { TypingStats } from "@/types/typingTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/utils/typingUtils";

interface ResultsProps {
  stats: TypingStats & { completionTime: number };
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart }) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Test Completed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center p-6 bg-primary/10 rounded-lg border-2 border-primary">
          <span className="text-4xl font-bold text-primary">{stats.wpm}</span>
          <span className="text-lg font-medium text-primary">Words Per Minute</span>
          <span className="text-sm text-muted-foreground mt-1">Your Typing Speed</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
            <span className="text-2xl font-bold text-green-600">{stats.accuracy}%</span>
            <span className="text-sm text-muted-foreground">Accuracy</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
            <span className="text-2xl font-bold text-blue-600">{formatTime(stats.completionTime)}</span>
            <span className="text-sm text-muted-foreground">Time Taken</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Correct characters:</span>
            <span className="font-medium text-green-600">{stats.correctChars}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Incorrect characters:</span>
            <span className="font-medium text-red-600">{stats.incorrectChars}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total characters:</span>
            <span className="font-medium">{stats.totalChars}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onRestart} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Start New Test
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Results;
