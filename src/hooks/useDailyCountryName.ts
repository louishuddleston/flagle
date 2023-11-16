import { useMemo } from 'react';
import seedrandom from 'seedrandom';

import { useAllCountryNames } from './useAllCountryNames';
import { useDailySeed } from './useDailySeed';

export function useDailyCountryName(): string {
  const dailySeed = useDailySeed();
  const countryNames = useAllCountryNames();

  return useMemo(() => {
    const todaysCountry =
      countryNames[
        Math.floor(seedrandom.alea(dailySeed)() * countryNames.length)
      ];

    if (todaysCountry === 'Russia') {
      return 'Ukraine';
    }

    return todaysCountry;
  }, [dailySeed, countryNames]);
}
