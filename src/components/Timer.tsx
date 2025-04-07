
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils/typingUtils";

interface TimerProps {
  duration: number;
  isActive: boolean;
  onTimeUp: () => void;
  onTick: (remainingSeconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  isActive, 
  onTimeUp, 
  onTick 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);
        onTick(newTimeLeft);
        
        if (newTimeLeft === 0) {
          onTimeUp();
          clearInterval(interval);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp, onTick]);

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
