import seedrandom from 'seedrandom';

import { getDayString } from '../hooks/useDailySeed';
import countryData from './data/countries';

const countryNames = Object.keys(countryData);
const distribution = countryNames.reduce((acc, name) => {
  acc[name] = { occurenceCount: 0 };
  return acc;
}, {});
const ONE_DAY = 24 * 60 * 60 * 1_000;
const THREE_MONTHS = 30 * ONE_DAY;

let tooCloseCount = 0;

for (let i = 0; i <= 1_000_000; i++) {
  const timestamp = i * ONE_DAY;
  const date = new Date(timestamp);
  const dailySeed = getDayString(date);
  const todaysCountry =
    countryNames[
      Math.floor(seedrandom.alea(dailySeed)() * countryNames.length)
    ];
  const { lastOccurence } = distribution[todaysCountry];

  if (lastOccurence != null && lastOccurence + THREE_MONTHS >= i * ONE_DAY) {
    tooCloseCount++;
  }

  distribution[todaysCountry].occurenceCount++;
  distribution[todaysCountry].lastOccurence = timestamp;
}

console.log({ distribution, tooCloseCount });
