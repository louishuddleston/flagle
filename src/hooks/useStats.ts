import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { useGuessHistory } from './useGuessHistory';

const MAX_ATTEMPTS = 6;

export function useStats() {
  const [guessHistory] = useGuessHistory();

  return useMemo(() => {
    const allGuessesEntries = Object.entries(guessHistory);
    const played = allGuessesEntries.length;

    const guessDistribution = Array(MAX_ATTEMPTS).fill(0);

    let currentStreak = 0;
    let maxStreak = 0;
    let previousDate = null;
    for (const [dayString, guesses] of allGuessesEntries) {
      const trueDayString = dayString.substring(0, dayString.length - 2);
      const currentDate = DateTime.fromFormat(trueDayString, 'yyyy-MM-dd');
      const winIndex = guesses.findIndex((guess) => guess.distance === 0);
      const won = winIndex >= 0;
      if (won) {
        const tryCount = winIndex + 1;
        guessDistribution[tryCount]++;

        if (
          previousDate == null ||
          previousDate.plus({ days: 1 }).hasSame(currentDate, 'day')
        ) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 0;
      }

      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      previousDate = currentDate;
    }

    const winCount = Object.values(guessDistribution).reduce(
      (total, tries) => total + tries,
    );

    return {
      currentStreak: currentStreak,
      maxStreak: maxStreak,
      played,
      winRatio: winCount / (played || 1),
      guessDistribution: guessDistribution,
    };
  }, [guessHistory]);
}