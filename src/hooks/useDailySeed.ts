import { useMemo } from 'react';

export function getDayString(date = new Date()): string {
  return `${date.toISOString().split('T')[0]}-${date.getDay()}`;
}

export function useDailySeed(roundName = ''): string {
  return useMemo(
    () => `${getDayString()}${roundName ? `-${roundName}` : ''}`,
    [roundName],
  );
}
