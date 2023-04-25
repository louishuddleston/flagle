import { useMemo } from 'react';

import countryData from '../data/countries';
import { getBorderCountriesByCode } from '../domain/countries.borders';

export const useBorderCountryNames = (country: { code: string }) => {
  const borderCountryCodes = useMemo(
    () => getBorderCountriesByCode(country.code),
    [country.code],
  );

  return useMemo(
    () =>
      Object.keys(countryData).filter((name) =>
        borderCountryCodes.includes(countryData[name].code),
      ),
    [borderCountryCodes],
  );
};
