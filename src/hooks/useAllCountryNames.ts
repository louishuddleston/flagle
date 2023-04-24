import { useMemo } from "react";

import countryData from "../data/countries";

export function useAllCountryNames() {
  return useMemo(() => Object.keys(countryData), []);
}
