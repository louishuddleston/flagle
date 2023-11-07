import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export type Settings = {
  unit: 'miles' | 'km';
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    unit: 'km',
  });

  const changeSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setSettings],
  );

  return useMemo(
    () => [settings, changeSetting] as const,
    [settings, changeSetting],
  );
}
