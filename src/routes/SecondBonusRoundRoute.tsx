import { Twemoji } from '@teuteuf/react-emoji-render';
import * as geolib from 'geolib';
import type { GeolibInputCoordinates } from 'geolib/es/types';
import { useMemo } from 'react';
import styled from 'styled-components';

import { HowToModal } from '../components/HowToModal';
import { NextRoundLink } from '../components/NextRoundLink';
import { Title, TitleBar, TitleBarDiv } from '../components/Title';
import countryData from '../data/countries';
import { getBorderCountriesByCode } from '../domain/countries.borders';
import { countries, Country } from '../domain/countries.position';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useDailySeed } from '../hooks/useDailySeed';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';

const MAX_ATTEMPTS = 3;
const CHOICES_COUNT = 8;

const useBorderCountryNames = (country: { code: string }) => {
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

const useNearestCountryNames = (refCountry: Country) => {
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

const useSecondBonusRound = ({
  roundSeed,
  choicesCount,
  maxAttempts,
}: {
  roundSeed: string;
  choicesCount: number;
  maxAttempts: number;
}) => {
  const dailyCountryName = useDailyCountryName();
  const borderCountryNames = useBorderCountryNames(
    countryData[dailyCountryName],
  );
  const randomBorderCountry = useMemo(
    () => shuffleWithSeed(borderCountryNames, roundSeed).pop(),
    [borderCountryNames, roundSeed],
  );
  const nearestCountryName = useNearestCountryNames({
    name: dailyCountryName,
    ...countryData[dailyCountryName],
  })[1];
  const correctAnswer = randomBorderCountry || nearestCountryName;
  const blackList = useMemo(
    () => [dailyCountryName, correctAnswer].filter(Boolean),
    [dailyCountryName, correctAnswer],
  );
  const randomCountryNames = useRandomCountryNames({
    seed: roundSeed,
    blackList,
  });
  const dailyChoicesOrder = useMemo(
    () =>
      shuffleWithSeed(
        [...randomCountryNames.slice(0, choicesCount - 1), correctAnswer],
        roundSeed,
      ),
    [randomCountryNames, choicesCount, correctAnswer, roundSeed],
  );
  const { dailyChoices, isRoundComplete, onSelectCountry, attemptsLeft } =
    useRoundState({
      seed: roundSeed,
      dailyChoicesOrder,
      maxAttempts,
      correctAnswer,
    });

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      attemptsLeft,
      correctAnswer,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      attemptsLeft,
      correctAnswer,
    ],
  );
};

export function SecondBonusRoundRoute() {
  const roundSeed = useDailySeed('second-bonus-round');
  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    attemptsLeft,
    correctAnswer,
  } = useSecondBonusRound({
    roundSeed,
    choicesCount: CHOICES_COUNT,
    maxAttempts: MAX_ATTEMPTS,
  });

  return (
    <>
      <TitleBar>
        <TitleBarDiv justify="flex-end">
          <HowToModal />
        </TitleBarDiv>
        <Title>
          FLAG<span>LE</span>
        </Title>
      </TitleBar>

      <p>
        <b>Pick the flag of a neighbouring country</b>
      </p>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => (
          <CountryFlag
            key={countryName}
            countryName={countryName}
            countryCode={countryData[countryName].code}
            index={index + 1}
            choiceStatus={
              dailyChoices[countryName] ||
              (isRoundComplete && countryName === correctAnswer
                ? ChoiceStatus.CORRECT
                : undefined)
            }
            disabled={
              isRoundComplete || dailyChoices[countryName] !== undefined
            }
            onSelect={onSelectCountry}
          />
        ))}
      </div>

      {!isRoundComplete && (
        <AttemptsLeft>You have {attemptsLeft} guesses remaining</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <NextRoundLink to="/bonus-round/2">
            Bonus Round - 3/3 - Population and Capital
          </NextRoundLink>

          <a
            className="underline text-center block mt-4 whitespace-nowrap"
            href={`https://en.wikipedia.org/wiki/${correctAnswer}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twemoji
              text="📚"
              className="inline-block"
              options={{ baseUrl: '//twemoji.maxcdn.com/' }}
            />{' '}
            on Wikipedia
          </a>
        </>
      )}
    </>
  );
}

const AttemptsLeft = styled('div')`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #888;
`;

const CountryFlag: React.FC<{
  countryName: string;
  countryCode: string;
  index: number;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  disabled: boolean;
  choiceStatus: ChoiceStatus | undefined;
}> = ({
  countryName,
  countryCode = '',
  index = 0,
  onSelect,
  disabled = false,
  choiceStatus,
}) => {
  return (
    <button
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      className="rounded-md p-3 relative"
      style={{
        border: '2px solid #CCC',
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
        paddingTop: '24px',
        paddingBottom: '24px',
      }}
    >
      <div
        className="font-bold absolute"
        style={{ top: '4px', left: '8px', color: '#fff' }}
      >
        {index}.
      </div>
      <div className="font-bold absolute" style={{ top: '3px', left: '7px' }}>
        {index}.
      </div>
      <img
        src={`https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`}
        width="70"
        height="70"
        alt=""
        style={{ border: '1px solid #CCC' }}
      />
    </button>
  );
};
