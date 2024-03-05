import { ImageQuiz } from '@louishuddleston/image-quiz';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { AdnginEndMobile0 } from '../components/AdnginEndMobile0';
import { BackButton } from '../components/BackButton';
import { BonusRoundTitle } from '../components/BonusRoundTitle';
import { CorrectAnswers } from '../components/CorrectAnswers';
import { NextRoundLink } from '../components/NextRoundLink';
import { ShareButton } from '../components/ShareButton';
import countryData from '../data/countries';
import { useBorderCountryNames } from '../hooks/useBorderCountryCodes';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useDailySeed } from '../hooks/useDailySeed';
import { useNearestCountryNames } from '../hooks/useNearestCountryNames';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
import { useRoundState } from '../hooks/useRoundState';
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
  const dailyCountryName = useDailyCountryName();

  const {
    dailyChoicesOrder,
    dailyChoices,
    onSelectCountry,
    isRoundSuccess,
    isRoundComplete,
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

  const answerOptions = useMemo(() => {
    return dailyChoicesOrder
      .map((countryName) => {
        if (countryData[countryName]) {
          return {
            name: countryName,
            image: `https://flagcdn.com/w320/${countryData[
              countryName
            ].code.toLowerCase()}.png`,
          };
        } else return null;
      })
      .filter(
        (country): country is { name: string; image: string } =>
          country !== null,
      );
  }, [dailyChoicesOrder]);

  const startingGuesses = useMemo(
    () =>
      Object.entries(dailyChoices)
        .map(([k, v]) => {
          return typeof v !== 'undefined' ? k : null;
        })
        .filter((g) => g) as string[],
    [dailyChoices],
  );

  const handleGuess = ({ guess }: { guess: string }) => {
    onSelectCountry({} as never, guess);
  };

  return (
    <>
      <BackButtonContainer>
        <BackButton />
      </BackButtonContainer>
      <BonusRoundTitle>
        Pick the flag of a country that neighbours {dailyCountryName}
      </BonusRoundTitle>

      <div className="max-w-lg">
        <ImageQuiz
          answerOptions={answerOptions}
          correctAnswer={correctAnswer}
          maxTryCount={MAX_ATTEMPTS}
          onGuess={handleGuess}
          startingGuesses={startingGuesses}
        />
      </div>

      {!isRoundComplete && (
        <AttemptsLeft>You have {attemptsLeft} guesses remaining</AttemptsLeft>
      )}

      {isRoundComplete && (
        <>
          <CorrectAnswers answers={[correctAnswer]} />
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

const BackButtonContainer = styled.div`
  display: flex;
  max-width: 376px;
  padding: 0.4rem;
  margin-bottom: 1rem;
  width: 100%;
`;
