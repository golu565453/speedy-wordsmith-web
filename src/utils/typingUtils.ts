
// Calculate Words Per Minute (WPM)
export const calculateWPM = (
  correctChars: number,
  timeInSeconds: number
): number => {
  // Standard word length is 5 characters
  const standardWordLength = 5;
  // Calculate words typed based on correct characters
  const wordsTyped = correctChars / standardWordLength;
  // Calculate minutes elapsed
  const minutesElapsed = timeInSeconds / 60;
  // Return WPM, handling edge case division by zero
  return minutesElapsed > 0 ? Math.round(wordsTyped / minutesElapsed) : 0;
};

// Calculate typing accuracy
export const calculateAccuracy = (
  correctChars: number,
  totalChars: number
): number => {
  return totalChars > 0
    ? Math.round((correctChars / totalChars) * 100)
    : 100;
};

// Random quotes for typing practice
export const getRandomQuote = (): string => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Sample quotes for typing test
const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Life is what happens when you're busy making other plans.",
  "In the end, we will remember not the words of our enemies, but the silence of our friends.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "Whoever is happy will make others happy too.",
  "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
  "The only impossible journey is the one you never begin."
];
