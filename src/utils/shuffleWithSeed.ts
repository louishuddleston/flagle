import seedrandom from 'seedrandom';

export function shuffleWithSeed<T>(array: T[], seed: string) {
  const rng = seedrandom(seed);
  const shuffled = [];
  const keys = Array(array.length)
    .fill(null)
    .map((_, key) => key);

  for (let i = 0; i < array.length; i++) {
    const key = Math.floor(rng() * keys.length);

    shuffled.push(array[keys[key]]);
    keys.splice(key, 1);
  }

  return shuffled;
}
