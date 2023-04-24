import { useState, useMemo, useEffect } from 'react';
import { getDistance, getCompassDirection } from 'geolib';
import { toast } from 'react-toastify';

import { useGuesses } from '../hooks/useGuesses';
import AnswerBox from '../components/AnswerBox';
import { StatsModal } from '../components/StatsModal';
import { HowToModal } from '../components/HowToModal';
import { FlagGrid } from '../components/FlagGrid';
import { Guesses } from '../components/Guesses';
import { Attempts } from '../components/Attempts';
import { Title, TitleBar, TitleBarDiv } from '../components/Title';
import { NextRoundLink } from '../components/NextRoundLink';
import countryData from '../data/countries';
import { getDayString } from '../utils/getDayString';
import { useDailyCountryName } from '../hooks/useDailyCountryName';
import { useAllCountryNames } from '../hooks/useAllCountryNames';

const MAX_ATTEMPTS = 6;

const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

export function MainGameRoute() {
  const [score, setScore] = useState('DNF');
  const [flippedArray, setFlippedArray] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [randomOrder, setRandomOrder] = useState(() =>
    shuffle([0, 1, 2, 3, 4, 5]),
  );
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCountry = useDailyCountryName();
  const allCountryNames = useAllCountryNames();

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    const lastGuess = guesses[guesses.length - 1];
    if (guesses.length >= MAX_ATTEMPTS || lastGuess?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`);
        setScore(guesses.lenght);
      } else {
        toast(`🤔 ${trueCountry} 🤔`);
        setScore('DNF');
      }
    }
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(
      randomOrder.length > 1
        ? randomOrder.slice(1)
        : shuffle([0, 1, 2, 3, 4, 5]),
    );
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };

  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map((guess) => guess.tile);
    for (const i of [0, 1, 2, 3, 4, 5]) {
      if (!usedTiles.includes(i)) {
        remainingTiles.push(i);
      }
    }
    setRandomOrder(shuffle(remainingTiles));
    return remainingTiles;
  };

  const revealTiles = () => {
    const newFlipped = flippedArray.slice();
    for (const guess of guesses) {
      newFlipped[guess.tile] = true;
      setFlippedArray(newFlipped);
    }
  };

  const onGuess = (guess) => {
    const tileNum = revealRandomTile();
    const { code: guessCode, ...guessGeo } = countryData[guess];
    const { code: answerCode, ...answerGeo } = countryData[trueCountry];
    addGuess({
      name: guess,
      distance: getDistance(guessGeo, answerGeo),
      direction: getCompassDirection(guessGeo, answerGeo),
      tile: tileNum,
    });
  };

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
        onCorrect={() => {}}
        onIncorrect={onIncorrect}
        disabled={end}
        countries={allCountryNames}
        onGuess={onGuess}
      />
      <Attempts score={score} attempts={guesses.length} max={MAX_ATTEMPTS} />
      <Guesses guesses={guesses} />

      {end && (
        <NextRoundLink to="/bonus-round/1">
          Bonus Round - 1/3 - Pick the country shape
        </NextRoundLink>
      )}
    </>
  );
}
