import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { useStats } from '../hooks/useStats';
import { BaseModal } from './BaseModal';

const StatNumber = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const StatText = styled.div`
  text-align: center;
`;

const StyledTile = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const StatsTile = ({ stat, text }: { stat: number; text: string }) => (
  <StyledTile>
    <StatNumber>{stat}</StatNumber>
    <StatText>{text}</StatText>
  </StyledTile>
);

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(3.8rem, 8rem));
  grid-template-rows: auto 1fr;
`;

const StatsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const DistBar = styled.div<{ count: number; maxDistribution: number }>`
  flex: 0 1
    ${(props) => Math.round((props.count / props.maxDistribution) * 100)}%;
  background-color: #ddd;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 0.5rem;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const LeaderboardIconStyled = styled(LeaderboardIcon)`
  color: black;
  margin: 3px;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const Type = styled(Typography)`
  font-family: Courier, monospace !important;
  margin-top: 5px !important;
`;

export function StatsModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const { played, winRatio, currentStreak, maxStreak, guessDistribution } =
    useStats();
  const maxDistribution = Math.max(...guessDistribution);

  return (
    <div>
      <StatsButton onClick={handleOpen}>
        <LeaderboardIconStyled />
      </StatsButton>
      <BaseModal open={open} onClose={handleClose} title="Statistics">
        <Grid>
          <StatsTile stat={Math.round(winRatio * 100)} text="Win %" />
          <StatsTile stat={played} text="Played" />
          <StatsTile stat={currentStreak} text="Streak" />
          <StatsTile stat={maxStreak} text="Max Streak" />
        </Grid>
        <Type id="modal-modal-title" variant="h6">
          Guess Distribution:
        </Type>
        <List>
          {guessDistribution.map((count, index) => (
            <ListItem sx={{ paddingBottom: 0 }} key={index}>
              <div>{index + 1}</div>
              <DistBar count={count} maxDistribution={maxDistribution}>
                {count}
              </DistBar>
            </ListItem>
          ))}
        </List>
        <Type id="modal-modal-description" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              window.open('https://crisisrelief.un.org/t/ukraine');
            }}
          >
            🇺🇦 Donate to Ukraine ❤️
          </Button>
        </Type>
      </BaseModal>
    </div>
  );
}
