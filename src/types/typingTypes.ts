
export interface CharacterState {
  char: string;
  isCorrect: boolean | null;
  isCurrent: boolean;
}

export interface TimerOption {
  value: number;
  label: string;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}
