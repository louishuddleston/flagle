import { Twemoji } from '@teuteuf/react-emoji-render';
import React, { useEffect, useMemo, useRef } from 'react';
import { MobileView } from 'react-device-detect';
import styled from 'styled-components';

import { HowToModal } from '../components/HowToModal';
import { NextRoundLink } from '../components/NextRoundLink';
import { Title, TitleBar, TitleBarDiv } from '../components/Title';
import countryData from '../data/countries';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useDailySeed } from '../hooks/useDailySeed';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
import { refreshCompleteAd } from '../utils/ads';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';

const MAX_ATTEMPTS = 3;
const CHOICES_COUNT = 4;

const useFirstBonusRound = ({
  roundSeed,
  choicesCount,
  maxAttempts,
}: {
  roundSeed: string;
  choicesCount: number;
  maxAttempts: number;
}) => {
  const dailyCountryName = useDailyCountryName();
  const blackList = useMemo(() => [dailyCountryName], [dailyCountryName]);
  const randomCountryNames = useRandomCountryNames({
    seed: roundSeed,
    blackList,
  });
  const dailyChoicesOrder = useMemo(
    () =>
      shuffleWithSeed(
        [...randomCountryNames.slice(0, choicesCount - 1), dailyCountryName],
        roundSeed,
      ),
    [randomCountryNames, dailyCountryName, roundSeed, choicesCount],
  );
  const { dailyChoices, isRoundComplete, onSelectCountry, attemptsLeft } =
    useRoundState({
      seed: roundSeed,
      dailyChoicesOrder,
      maxAttempts,
      correctAnswer: dailyCountryName,
    });

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      attemptsLeft,
      correctAnswer: dailyCountryName,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      attemptsLeft,
      dailyCountryName,
    ],
  );
};

export const FirstBonusRoundRoute: React.FC = () => {
  const roundSeed = useDailySeed('first-bonus-round');
  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    attemptsLeft,
    correctAnswer,
  } = useFirstBonusRound({
    roundSeed,
    choicesCount: CHOICES_COUNT,
    maxAttempts: MAX_ATTEMPTS,
  });
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshCompleteAd();
  }, []);

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
        <b>Pick the correct shape for this country</b>
      </p>

      <div className="flex gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => (
          <CountryShape
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
            Bonus Round - 2/3 - Pick the flag of a neighbouring country
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

      <MobileView className="w-full flex flex-col">
        <div
          ref={adRef}
          style={{ minHeight: 200, maxHeight: 250 }}
          className="w-full flex justify-center items-center my-4"
        >
          <div id="adngin-end_mobile-0"></div>
        </div>
      </MobileView>
    </>
  );
};

const AttemptsLeft = styled('div')`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #888;
`;

const CountryShape: React.FC<{
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
      style={{
        border: '4px solid #CCC',
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
      }}
      className="rounded-md p-3 relative"
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
        src={`/images/countries/${countryCode.toLowerCase()}/vector.svg`}
        width="70"
        height="70"
        alt=""
      />
    </button>
  );
};
