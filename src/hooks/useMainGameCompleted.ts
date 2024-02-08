import { useMemo } from 'react';

import { useDailySeed } from './useDailySeed';
import { useGuessHistory } from './useGuessHistory';

const MAX_ATTEMPTS = 5;

/**
 *
 * @returns {boolean} Whether the main game has been completed
 */
export const useMainGameCompleted = () => {
  const dayString = useDailySeed();
  const [guessHistory] = useGuessHistory();

  const mainGameCompleted = useMemo(
    () =>
      guessHistory[dayString]?.some((guess) => guess.distance === 0) ||
      guessHistory[dayString]?.length === MAX_ATTEMPTS,
    [guessHistory, dayString],
  );

  return mainGameCompleted;
};
