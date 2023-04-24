import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export enum ChoiceStatus {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export const useDailyChoicesState = (
  seed: string,
  dailyChoicesOrder: string[],
) => {
  const initialState = useMemo(
    () =>
      dailyChoicesOrder.reduce<{ [key: string]: ChoiceStatus | undefined }>(
        (acc, curr) => {
          acc[curr] = undefined;
          return acc;
        },
        {},
      ),
    [dailyChoicesOrder],
  );

  return useLocalStorage(seed, initialState);
};
