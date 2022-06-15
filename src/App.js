import './App.css';
import { useState, useMemo, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './components/AnswerBox';
import { getDistance, getCompassDirection } from "geolib";
import seedrandom from 'seedrandom';
import { DateTime } from "luxon";
import { useGuesses } from './hooks/useGuesses';
import { ToastContainer, Flip } from "react-toastify";
import { StatsModal } from "./components/StatsModal";
import { HowToModal } from './components/HowToModal';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { FlagGrid } from './components/FlagGrid';
import { Guesses } from './components/Guesses';
import GoogleAds from './components/GoogleAd';

const CentreWrapper = styled.div`
  margin: 0;
  position: absolute;
  overflow: auto;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column; 

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
}
`;

const Attempts = styled(({ score, attempts, max, ...props }) => (
  <div {...props}>
    Attempts: <span>{attempts}/{max}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  margin-bottom: 1rem;
  span {
    font-weight: bold;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
}
`;

const Footer = styled.div`
  display: block;
  font-size: 1rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  span {
    color: #1a76d2;
  }
  p {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
    a {
      color: #fff
    }
  }
`;

const AdContainer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: center;
`;

const TitleBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
`;

const TitleBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  span {
    color: #1a76d2;
  }
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

const getDayString = () => {
  const date = DateTime.now().toFormat("yyyy-MM-dd");
  return `${date}-${DateTime.now().weekday}`;
};

function App(props) {
  const [countryNames, setFlagNames] = useState(() => Object.keys(props.countryData));
  const [score, setScore] = useState("DNF");
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCountry = useMemo(() => {
    return countryNames[Math.floor(seedrandom.alea(dayString)() * countryNames.length)];
  }, [dayString, countryNames]);

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    if (guesses.length >= props.attempts || guesses[guesses.length - 1]?.distance === 0) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].distance === 0) {
        toast(`🎉 ${trueCountry} 🎉`);
        setScore(guesses.lenght);
      } else {
        toast(`🤔 ${trueCountry} 🤔`);
        setScore("DNF");
      }
    } 
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };
  
  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map(guess => guess.tile);
    for (const i of [0,1,2,3,4,5]) {
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

  const onGuess = guess => {
    const tileNum = revealRandomTile();
    const {code:guessCode, ...guessGeo} = props.countryData[guess];
    const {code:answerCode, ...answerGeo} = props.countryData[trueCountry];
    addGuess({name: guess,
              distance: getDistance(guessGeo, answerGeo),
              direction: getCompassDirection(guessGeo, answerGeo),
              tile: tileNum});
  };

  const countryInfo = useMemo(() => props.countryData[trueCountry], [trueCountry]);

  return (
    <div className='App'>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
        <TitleBar>
          <TitleBarDiv justify="flex-end">
            <HowToModal>
            </HowToModal>
          </TitleBarDiv>
          <Title>FLAG<span>LE</span></Title>
          <TitleBarDiv>
            <StatsModal end={end}
              score={score}
              guesses={guesses}
              maxAttempts={props.attempts}
              dayString={dayString}
              countryInfo={countryInfo}
              trueCountry={trueCountry}
            >
            </StatsModal>
          </TitleBarDiv>
        </TitleBar>
        <FlagGrid
          end={end}
          countryInfo={countryInfo}
          flippedArray={flippedArray}
        >
        </FlagGrid>
        <AnswerBox
          answer={trueCountry}
          onCorrect={() => { }}
          onIncorrect={onIncorrect}
          disabled={end}
          countries={Object.keys(props.countryData)}
          onGuess={onGuess}
        />
        <Attempts score={score} attempts={guesses.length} max={props.attempts} />
        <Guesses
          guesses={guesses}
        />
      </CentreWrapper>
        <AdContainer>
          <GoogleAds slot="6074082390"></GoogleAds>
        </AdContainer>
    </div>
  );
}

export default App;
