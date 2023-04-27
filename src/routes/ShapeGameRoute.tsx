import { Twemoji } from '@teuteuf/react-emoji-render';
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
import { NextRoundLink } from '../components/NextRoundLink';
import { ShareButton } from '../components/ShareButton';
import countryData from '../data/countries';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useDailySeed } from '../hooks/useDailySeed';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';
import { toast } from 'react-toastify';

const MAX_ATTEMPTS = 2;
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
  const {
    dailyChoices,
    isRoundComplete,
    isRoundSuccess,
    onSelectCountry,
    attemptsLeft,
  } = useRoundState({
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
      isRoundSuccess,
      attemptsLeft,
      correctAnswer: dailyCountryName,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      dailyCountryName,
    ],
  );
};

export const ShapeGameRoute: React.FC = () => {
  const roundSeed = useDailySeed('first-bonus-round');
  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useFirstBonusRound({
    roundSeed,
    choicesCount: CHOICES_COUNT,
    maxAttempts: MAX_ATTEMPTS,
  });

  useEffect(() => {
    if (!isRoundComplete) {
      return;
    }

    toast(
      isRoundSuccess ? `🎉 ${correctAnswer} 🎉` : `🤔 ${correctAnswer} 🤔`,
      { autoClose: 3000 },
    );
  }, [isRoundComplete, isRoundSuccess, correctAnswer]);

  return (
    <>
      <BonusRoundTitle>Pick the correct shape for this country</BonusRoundTitle>

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

          <ShareButton />

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

      <AdnginEndMobile0 />
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
    <StyledButton
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      style={{
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
      }}
    >
      <IndexShadow>{index}.</IndexShadow>
      <Index>{index}.</Index>
      <CountrySVG
        src={`/images/countries/${countryCode.toLowerCase()}/vector.svg`}
        width="70"
        height="70"
        alt=""
      />
    </StyledButton>
  );
};

const StyledButton = styled('button')`
  position: relative;
  padding: 0.75rem;
  border: 4px solid #ccc;
  border-radius: 0.375rem;
`;

const Index = styled('div')`
  position: absolute;
  top: 3px;
  left: 7px;
  font-weight: bold;
  color: #000;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const IndexShadow = styled('div')`
  position: absolute;
  top: 4px;
  left: 8px;
  font-weight: bold;
  color: #fff;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const CountrySVG = styled('img')`
  @media (prefers-color-scheme: dark) {
    filter: invert(1);
  }
`;
