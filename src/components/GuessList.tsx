import { Twemoji } from '@teuteuf/react-emoji-render';
import styled from 'styled-components';

import { Guess } from '../hooks/useGuessHistory';
import { formatDistance, getDirectionEmoji } from '../utils/geography';

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(9, minmax(30px, 2.5rem));
  margin: 0px 2px 2px 2px;
`;

const CountryGuess = styled.div`
  display: flex;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 1 / span 6;
  margin-right: 2px;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2023;
    color: #dadada;
  }
`;

const DistanceBox = styled.div`
  display: flex;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 7 / span 2;
  font-weight: bold;
  margin-right: 2px;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2023;
    color: #dadada;
  }
`;

const ArrowBox = styled.div`
  display: flex;
  padding: 0.25rem;
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  grid-column: 9 / span 1;
  align-items: center;
  justify-content: center;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2023;
    color: #dadada;
  }
`;

export const GuessList: React.FC<{
  guesses: Guess[];
}> = ({ guesses }) => {
  return (
    <>
      {guesses.map((guess, index) => (
        <GuessLine key={index}>
          <CountryGuess>{guess.name}</CountryGuess>
          <DistanceBox>{formatDistance(guess.distance)} </DistanceBox>
          <ArrowBox>
            <Twemoji
              text={getDirectionEmoji(guess)}
              options={{ baseUrl: '//twemoji.maxcdn.com/' }}
            />
          </ArrowBox>
        </GuessLine>
      ))}
    </>
  );
};
