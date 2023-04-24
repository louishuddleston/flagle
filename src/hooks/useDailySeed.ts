import { useMemo } from 'react';

import { getDayString } from '../utils/getDayString';

export function useDailySeed(roundName = ''): string {
  return useMemo(
    () => `${getDayString()}${roundName ? `-${roundName}` : ''}`,
    [roundName],
  );
}
