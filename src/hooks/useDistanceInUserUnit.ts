import { useMemo } from 'react';

import { useSettings } from './useSettings';

export function useDistanceInUserUnit() {
  const [settings] = useSettings();

  const unit = settings?.unit;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(navigator.language || 'en-US', {
        unit: unit === 'miles' ? 'mile' : 'kilometer',
        style: 'unit',
        unitDisplay: 'narrow',
        maximumFractionDigits: 0,
      }),
    [unit],
  );

  return {
    formatDistance: (distance: number) =>
      formatter.format(distance / 1000 / (unit === 'miles' ? 1.6093 : 1)),
  };
}
