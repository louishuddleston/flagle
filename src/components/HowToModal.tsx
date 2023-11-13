import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import { getCompassDirection, getDistance } from 'geolib';
import { useState } from 'react';
import styled from 'styled-components';

import countryData from '../data/countries';
import { BaseModal } from './BaseModal';
import { FlagGrid } from './FlagGrid';
import { GuessList } from './GuessList';

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
`;

const CenterDiv = styled.div<{ display: string }>`
  display: ${(props) => props.display};
  justify-content: center;
`;

const HelpIcon = styled(HelpOutlineIcon)`
  color: black;
  margin: 3px;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export function HowToModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const exampleGuesses = ['Mexico', 'Haiti', 'Peru', 'Chile'];
  const exampleTarget = 'Chile';
  const { code: answerCode, ...answerGeo } = countryData[exampleTarget];
  const guesses = exampleGuesses.map((name) => {
    const { ...guessGeo } = countryData[name];
    return {
      name: name,
      distance: getDistance(guessGeo, answerGeo),
      direction: getCompassDirection(guessGeo, answerGeo),
      tile: 0,
    };
  });

  return (
    <div>
      <Button onClick={handleOpen}>
        <HelpIcon />
      </Button>
      <BaseModal open={open} onClose={handleClose} title="How to play!">
        <Typography id="modal-modal-paragraph" component="p">
          Guess the flag in 6 guesses or less!
        </Typography>
        <Typography id="modal-modal-paragraph" component="p">
          Each time you make a guess it will reveal another portion of the flag
          and give you a geographical hint.
        </Typography>
        <br />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Example:
        </Typography>
        <CenterDiv display="flex">
          <FlagGrid
            end={false}
            flippedArray={[true, true, false, false, true, false]}
            countryInfo={{ code: answerCode }}
          ></FlagGrid>
        </CenterDiv>
        <CenterDiv display="grid">
          <GuessList guesses={guesses.slice(0, -1)} />
        </CenterDiv>
        <br />
        <Typography id="modal-modal-paragraph" component="p">
          The hint tells you how far away your guess was and the arrow points
          towards the target country.
        </Typography>
        <Typography id="modal-modal-paragraph" component="p">
          The answer in this case was:
        </Typography>
        <br />
        <CenterDiv display="grid">
          <GuessList guesses={guesses.slice(-1)} />
        </CenterDiv>
        <br />
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Frequently Asked Questions
        </Typography>
        <Typography
          id="modal-modal-paragraph"
          component="p"
          sx={{ textDecoration: 'underline' }}
        >
          <a href="/about.html" target="_blank" rel="noreferrer">
            About Flagle and Teuteuf Games
          </a>
        </Typography>
        <Typography
          id="modal-modal-paragraph"
          component="p"
          sx={{ textDecoration: 'underline' }}
        >
          <a href="/privacy-policy/" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </Typography>
        <br />
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Any Suggestion?
        </Typography>
        <Typography
          id="modal-modal-paragraph"
          component="p"
          sx={{ textDecoration: 'underline' }}
        >
          <a
            href="https://docs.google.com/forms/d/1rqb1jsmC_RMkX5CUY8pZQrjFrQaloC4zw9ZM5ZquAWw"
            target="_blank"
            rel="noreferrer"
          >
            Share your feedback!
          </a>
        </Typography>
      </BaseModal>
    </div>
  );
}
