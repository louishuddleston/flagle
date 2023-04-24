import { useMemo } from 'react';

import { shuffleWithSeed } from '../utils/shuffleWithSeed';
import { useAllCountryNames } from './useAllCountryNames';

export const useRandomCountryNames = ({
  seed,
  blackList = [],
}: {
  seed: string;
  blackList?: string[];
}): string[] => {
  const allCountryNames = useAllCountryNames();
  const allButDailyCountryNames = useMemo(
    () => allCountryNames.filter((name) => !blackList.includes(name)),
    [allCountryNames, blackList],
  );

  return useMemo(
    () => shuffleWithSeed(allButDailyCountryNames, seed),
    [allButDailyCountryNames, seed],
  );
};
