import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import seedrandom from 'seedrandom';

import countryData from '../data/countries';
import { useAllCountryNames } from './useAllCountryNames';
import { useDailySeed } from './useDailySeed';

export function useDailyCountryName(): string {
  const dailySeed = useDailySeed();
  const countryNames = useAllCountryNames();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get('code');

  return useMemo(() => {
    let todaysCountry =
      // countryNames[
      //   // Math.floor(seedrandom.alea(dailySeed)() * countryNames.length)
      //   // temporary use random instead of seedrandom
      //   // Math.floor(Math.random() * countryNames.length)
      //   country
      // ];
      countryNames[Math.floor(Math.random() * countryNames.length)];

    Object.entries(countryData).forEach(([key, val]) => {
      if (val.code === code) todaysCountry = key;
    });

    if (todaysCountry === 'Russia') {
      return 'Ukraine';
    }

    return todaysCountry;
  }, [dailySeed, countryNames, code]);
}
