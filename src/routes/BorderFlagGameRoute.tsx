import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
import { NextRoundLink } from '../components/NextRoundLink';
import { ShareButton } from '../components/ShareButton';
import countryData from '../data/countries';
import { useBorderCountryNames } from '../hooks/useBorderCountryCodes';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useDailySeed } from '../hooks/useDailySeed';
import { useNearestCountryNames } from '../hooks/useNearestCountryNames';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
import { ChoiceStatus, useRoundState } from '../hooks/useRoundState';
import { shuffleWithSeed } from '../utils/shuffleWithSeed';

const MAX_ATTEMPTS = 3;
const CHOICES_COUNT = 8;

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
    correctAnswer,
  });

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      correctAnswer,
    }),
    [
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
      isRoundSuccess,
      attemptsLeft,
      correctAnswer,
    ],
  );
};

export function BorderFlagGameRoute() {
  const roundSeed = useDailySeed('second-bonus-round');

  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundComplete,
    isRoundSuccess,
    attemptsLeft,
    correctAnswer,
  } = useSecondBonusRound({
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
      <BonusRoundTitle>Pick the flag of a neighbouring country</BonusRoundTitle>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => {
          if (countryData[countryName]) {
          return (
          <CountryFlag
            key={countryName}
            countryName={countryName}
            countryCode={countryData[countryName].code.toUpperCase()}
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
        )} else {
            console.error(countryName);
          }})}
      </div>

      {!isRoundComplete && (
        <AttemptsLeft>You have {attemptsLeft} guesses remaining</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <NextRoundLink to="/bonus-round/3">
            Bonus Round - 3/3 - Population
          </NextRoundLink>

          <ShareButton />
        </>
      )}

      <AdnginEndMobile0 />
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
        border: '4px solid #CCC',
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
