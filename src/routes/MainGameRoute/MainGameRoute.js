import { getCompassDirection, getDistance } from 'geolib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { AdnginEndMobile0 } from '../../components/AdnginEndMobile0';
import { CorrectAnswers } from '../../components/CorrectAnswers';
import { FlagGrid } from '../../components/FlagGrid';
import { GuessList } from '../../components/GuessList';
import { NextRoundLink } from '../../components/NextRoundLink';
import { ShareButton } from '../../components/ShareButton';
import countryData from '../../data/countries';
import { useAllCountryNames } from '../../hooks/useAllCountryNames';
import { useConfettiThrower } from '../../hooks/useConfettiThrower';
import { useDailyCountryName } from '../../hooks/useDailyCountryName';
import { useDailySeed } from '../../hooks/useDailySeed';
import { useGuessHistory } from '../../hooks/useGuessHistory';
import { shuffleWithSeed } from '../../utils/shuffleWithSeed';
import { AnswerBox } from './components/AnswerBox';
import { Attempts } from './components/Attempts';

const MAX_ATTEMPTS = 5;
const TILE_INDICES = [0, 1, 2, 3, 4, 5];

export function MainGameRoute() {
  const [score, setScore] = useState('DNF');
  const [flippedArray, setFlippedArray] = useState(Array(6).fill(false));
  const dayString = useDailySeed();
  const [randomOrder, setRandomOrder] = useState(() =>
    shuffleWithSeed(TILE_INDICES, dayString),
  );
  const [end, setEnd] = useState(false);
  const [guessHistory, addGuess] = useGuessHistory();
  const guesses = useMemo(
    () => guessHistory[dayString] || [],
    [guessHistory, dayString],
  );

  const trueCountry = useDailyCountryName();
  const allCountryNames = useAllCountryNames();

  const revealRandomTile = useCallback(() => {
    const [tile] = randomOrder;
    setRandomOrder(
      randomOrder.length > 1
        ? randomOrder.slice(1)
        : shuffleWithSeed(TILE_INDICES, dayString),
    );
    setFlippedArray((currArray) => {
      const newFlipped = [...currArray];
      newFlipped[tile] = true;
      return newFlipped;
    });
    return tile;
  }, [setFlippedArray, randomOrder, dayString]);

  const getRemainingTiles = useCallback(() => {
    const remainingTiles = [];
    const usedTiles = guesses.map((guess) => guess.tile);
    for (const i of TILE_INDICES) {
      if (!usedTiles.includes(i)) {
        remainingTiles.push(i);
      }
    }
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
    if (end) return;
    revealTiles();
    getRemainingTiles();
    const lastGuess = guesses[guesses.length - 1];
    if (guesses.length >= MAX_ATTEMPTS || lastGuess?.distance === 0) {
      setEnd(true);
      setFlippedArray(Array(6).fill(true));
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`, { autoClose: 3000 });
        throwConfetti();
        setScore(guesses.length);
      } else {
        toast(`🤔 ${trueCountry} 🤔`, { autoClose: 3000 });
        setScore('DNF');
      }
    }
  }, [
    guesses,
    trueCountry,
    getRemainingTiles,
    revealTiles,
    throwConfetti,
    end,
  ]);

  // reveal the first tile when the game starts
  useEffect(() => {
    if (randomOrder.length < 6) return;

    setFlippedArray((prev) => {
      const newFlippedArray = [...prev];
      newFlippedArray[randomOrder[0]] = true;
      return newFlippedArray;
    });

    setRandomOrder((randomOrder) => randomOrder.slice(1));
  }, [setFlippedArray, setRandomOrder, randomOrder]);

  const onGuess = useCallback(
    (guess) => {
      if (guesses.findIndex((g) => g.name === guess) !== -1) {
        return toast(`You have already guessed ${guess}`, { autoClose: 3000 });
      }
      const tileNum = revealRandomTile();
      const { ...guessGeo } = countryData[guess];
      const { ...answerGeo } = countryData[trueCountry];
      addGuess({
        name: guess,
        distance: getDistance(guessGeo, answerGeo),
        direction: getCompassDirection(guessGeo, answerGeo),
        tile: tileNum,
      });
    },
    [addGuess, revealRandomTile, trueCountry, guesses],
  );

  const countryInfo = useMemo(() => countryData[trueCountry], [trueCountry]);

  return (
    <>
      <FlagGrid
        end={end}
        countryInfo={countryInfo}
        flippedArray={flippedArray}
      ></FlagGrid>
      <AnswerBox disabled={end} countries={allCountryNames} onGuess={onGuess} />
      <Attempts score={score} attempts={guesses.length} max={MAX_ATTEMPTS} />
      <GuessList guesses={guesses} />

      {end && (
        <>
          <CorrectAnswers answers={[trueCountry]} />
          <NextRoundLink to="/bonus-round/1">
            Bonus Round - 1/3 - Pick the country shape
          </NextRoundLink>

          <ShareButton />
        </>
      )}

      <AdnginEndMobile0 />
    </>
  );
}
