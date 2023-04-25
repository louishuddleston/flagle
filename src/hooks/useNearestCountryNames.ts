import * as geolib from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import { useMemo } from 'react';

import { countries, Country } from '../domain/countries.position';

export const useNearestCountryNames = (refCountry: Country) => {
  const distances = useMemo(() => {
    const distances: {
      distance: number;
      targetCountry: GeolibInputCoordinates;
      country: Country;
      direction: ReturnType<(typeof geolib)['getCompassDirection']>;
    }[] = [];
    for (const currCountry of countries) {
      const distance = geolib.getDistance(refCountry, currCountry);
      distances.push({
        distance: distance / 1000,
        targetCountry: refCountry,
        country: currCountry,
        direction: geolib.getCompassDirection(
          refCountry,
          currCountry,
          (origin, dest) =>
            Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45,
        ),
      });
    }
    return distances;
  }, [refCountry]);

  return useMemo(
    () =>
      distances
        .sort((a, b) => {
          if (a.distance > b.distance) {
            return 1;
          }
          if (a.distance < b.distance) {
            return -1;
          }
          return 0;
        })
        .map((k) => {
          return k.country;
        })
        .map(({ name }) => name),
    [distances],
  );
};
