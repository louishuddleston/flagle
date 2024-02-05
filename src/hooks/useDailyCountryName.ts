import { useMemo } from 'react';

import { getTodaysCountry } from '../utils/countryDateUtils';

export function useDailyCountryName(): string {
  return useMemo(() => {
    const todaysCountry = getTodaysCountry(new Date().toISOString());

    if (todaysCountry.name === 'Russia') {
      return 'Ukraine';
    }

    return todaysCountry.name;
  }, []);
}
