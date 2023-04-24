import React, { useCallback, useMemo } from 'react';

import { HowToModal } from '../components/HowToModal';
import { Title, TitleBar, TitleBarDiv } from '../components/Title';
import { NextRoundLink } from '../components/NextRoundLink';
import countryData from '../data/countries';
import {
  ChoiceStatus,
  useDailyChoicesState,
} from '../hooks/useDailyChoicesState';
import { useDailySeed } from '../hooks/useDailySeed';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useRandomCountryNames } from '../hooks/useRandomCountryNames';
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

  const [dailyChoices, setDailyChoices] = useDailyChoicesState(
    roundSeed,
    dailyChoicesOrder,
  );
  const isRoundComplete = useMemo(() => {
    if (Object.values(dailyChoices).includes(ChoiceStatus.CORRECT)) {
      return true;
    }

    const nbAnswers = Object.values(dailyChoices).filter(
      (val) => val !== undefined,
    ).length;
    if (nbAnswers >= maxAttempts) {
      return true;
    }
  }, [dailyChoices, maxAttempts]);

  const onSelectCountry = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const countryName =
        e.currentTarget.closest('button')?.dataset?.countryName;

      if (!countryName) {
        return;
      }

      setDailyChoices((propositions) => {
        const nextPropositions = {
          ...propositions,
          [countryName]:
            countryName === dailyCountryName
              ? ChoiceStatus.CORRECT
              : ChoiceStatus.INCORRECT,
        };

        return nextPropositions;
      });
    },
    [setDailyChoices, dailyCountryName],
  );

  return useMemo(
    () => ({
      dailyChoicesOrder,
      dailyChoices,
      onSelectCountry,
      isRoundComplete,
    }),
    [dailyChoicesOrder, dailyChoices, onSelectCountry, isRoundComplete],
  );
};

export const FirstBonusRoundRoute: React.FC = () => {
  const roundSeed = useDailySeed('first-bonus-round');
  const { dailyChoicesOrder, dailyChoices, onSelectCountry, isRoundComplete } =
    useFirstBonusRound({
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
        <b>Pick the correct shape for this country</b>
      </p>

      <div className="flex gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => (
          <CountryShape
            key={countryName}
            countryName={countryName}
            countryCode={countryData[countryName].code}
            index={index + 1}
            choiceStatus={dailyChoices[countryName]}
            disabled={
              isRoundComplete || dailyChoices[countryName] !== undefined
            }
            onSelect={onSelectCountry}
          />
        ))}
      </div>

      {isRoundComplete && (
        <NextRoundLink to="/bonus-round/2">
          Bonus Round - 2/3 - Pick the flag of a neighbouring country
        </NextRoundLink>
      )}
    </>
  );
};

const CountryShape = ({
  countryName,
  countryCode = '',
  index = 0,
  onSelect,
  disabled = false,
  choiceStatus,
}: {
  countryName: string;
  countryCode: string;
  index: number;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
  disabled: boolean;
  choiceStatus: ChoiceStatus | undefined;
}) => {
  return (
    <button
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      style={{
        border: '2px solid #DDD',
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
      }}
      className="rounded-md p-2 relative"
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
