import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flip,ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import angleIcon from './angle_favicon.svg';
import { NextRoundLink } from './components/NextRoundLink';
import { FirstBonusRoundRoute } from './routes/FirstBonusRoundRoute';
import { MainGameRoute } from './routes/MainGameRoute';
import { SecondBonusRoundRoute } from './routes/SecondBonusRoundRoute';

const CentreWrapper = styled.div`
  margin: 0;
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
      color: #fff;
    }
  }
`;

const AdContainer = styled.div`
  width: 100%;
  margin-top: auto;
  bottom: 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const Icon = styled.img`
  width: 20px;
  margin-right: 10px;
`;

const GameButton = styled(Button)`
  span {
    font-weight: bold;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

export default function App() {
  return (
    <div className="App">
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
        <Switch>
          <Route exact path="/">
            <MainGameRoute />
          </Route>

          <Route exact path="/bonus-round/1">
            <FirstBonusRoundRoute />
          </Route>

          <Route exact path="/bonus-round/2">
            <SecondBonusRoundRoute />
          </Route>

          <Route>
            <NextRoundLink to="/">Home</NextRoundLink>
          </Route>
        </Switch>

        <AdContainer>
          <div style={{ marginTop: '5px' }}>Our other games:</div>
          <GamesContainer>
            <GameButton
              variant="outlined"
              onClick={() => {
                window.open('https://angle.wtf');
              }}
            >
              <Icon src={angleIcon} />
              <span>Angle</span>
            </GameButton>
            <GameButton
              variant="outlined"
              onClick={() => {
                window.open('https://wheretakenusa.teuteuf.fr');
              }}
            >
              <span>Where Taken</span>
            </GameButton>
          </GamesContainer>
          <a className="nn-cmp-show" href="#nogo">
            Manage Cookie Settings
          </a>
        </AdContainer>
      </CentreWrapper>
    </div>
  );
}
