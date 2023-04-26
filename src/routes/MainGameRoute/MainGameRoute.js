import { getCompassDirection, getDistance } from 'geolib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { FlagGrid } from '../../components/FlagGrid';
import { Guesses } from '../../components/Guesses';
import { HowToModal } from '../../components/HowToModal';
import { NextRoundLink } from '../../components/NextRoundLink';
import { Title, TitleBar, TitleBarDiv } from '../../components/Title';
import countryData from '../../data/countries';
import { useAllCountryNames } from '../../hooks/useAllCountryNames';
import { useConfettiThrower } from '../../hooks/useConfettiThrower';
import { useDailyCountryName } from '../../hooks/useDailyCountryName';
import { useGuesses } from '../../hooks/useGuesses';
import { getDayString } from '../../utils/getDayString';
import AnswerBox from './components/AnswerBox';
import { Attempts } from './components/Attempts';
import { StatsModal } from './components/StatsModal';

const MAX_ATTEMPTS = 6;

const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

export function MainGameRoute() {
  const [score, setScore] = useState('DNF');
  const [flippedArray, setFlippedArray] = useState(
    useMemo(() => [false, false, false, false, false, false], []),
  );
  const [randomOrder, setRandomOrder] = useState(() =>
    shuffle([0, 1, 2, 3, 4, 5]),
  );
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCountry = useDailyCountryName();
  const allCountryNames = useAllCountryNames();

  const revealRandomTile = useCallback(() => {
    const [tile] = randomOrder;
    setRandomOrder(
      randomOrder.length > 1
        ? randomOrder.slice(1)
        : shuffle([0, 1, 2, 3, 4, 5]),
    );
    setFlippedArray((currArray) => {
      const newFlipped = [...currArray];
      newFlipped[tile] = true;
      return newFlipped;
    });
    return tile;
  }, [setFlippedArray, randomOrder]);

  const getRemainingTiles = useCallback(() => {
    const remainingTiles = [];
    const usedTiles = guesses.map((guess) => guess.tile);
    for (const i of [0, 1, 2, 3, 4, 5]) {
      if (!usedTiles.includes(i)) {
        remainingTiles.push(i);
      }
    }
    setRandomOrder(shuffle(remainingTiles));
    return remainingTiles;
  }, [guesses]);

  const revealTiles = useCallback(() => {
    setFlippedArray((currFlipped) => {
      const newFlipped = [...currFlipped];
      for (const guess of guesses) {
        newFlipped[guess.tile] = true;
      }

      return newFlipped;
    });
  }, [setFlippedArray, guesses]);

  const throwConfetti = useConfettiThrower();

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    const lastGuess = guesses[guesses.length - 1];
    if (guesses.length >= MAX_ATTEMPTS || lastGuess?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`);
        throwConfetti();
        setScore(guesses.lenght);
      } else {
        toast(`🤔 ${trueCountry} 🤔`);
        setScore('DNF');
      }
    }
  }, [guesses, trueCountry, getRemainingTiles, revealTiles, throwConfetti]);

  const onIncorrect = useCallback(() => {
    revealRandomTile();
  }, [revealRandomTile]);

  const onGuess = useCallback(
    (guess) => {
      const tileNum = revealRandomTile();
      const { code: guessCode, ...guessGeo } = countryData[guess];
      const { code: answerCode, ...answerGeo } = countryData[trueCountry];
      addGuess({
        name: guess,
        distance: getDistance(guessGeo, answerGeo),
        direction: getCompassDirection(guessGeo, answerGeo),
        tile: tileNum,
      });
    },
    [addGuess, revealRandomTile, trueCountry],
  );

  const countryInfo = useMemo(() => countryData[trueCountry], [trueCountry]);

  return (
    <>
      <TitleBar>
        <TitleBarDiv justify="flex-end">
          <HowToModal />
        </TitleBarDiv>
        <Title>
          FLAG<span>LE</span>
        </Title>
        <TitleBarDiv>
          <StatsModal
            end={end}
            score={score}
            guesses={guesses}
            maxAttempts={MAX_ATTEMPTS}
            dayString={dayString}
            countryInfo={countryInfo}
            trueCountry={trueCountry}
          />
        </TitleBarDiv>
      </TitleBar>

      <FlagGrid
        end={end}
        countryInfo={countryInfo}
        flippedArray={flippedArray}
      ></FlagGrid>
      <AnswerBox
        answer={trueCountry}
        onCorrect={() => void 0}
        onIncorrect={onIncorrect}
        disabled={end}
        countries={allCountryNames}
        onGuess={onGuess}
      />
      <Attempts score={score} attempts={guesses.length} max={MAX_ATTEMPTS} />
      <Guesses guesses={guesses} />

      {false && end && (
        <NextRoundLink to="/bonus-round/1">
          Bonus Round - 1/3 - Pick the country shape
        </NextRoundLink>
      )}
    </>
  );
}
