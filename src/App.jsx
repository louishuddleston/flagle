import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import { Twemoji } from '@teuteuf/react-emoji-render';
import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import angleIcon from './angle_favicon.svg';
import { NextRoundLink } from './components/NextRoundLink';
import { MainGameRoute } from './routes/MainGameRoute/MainGameRoute';

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
  margin-bottom: 10px;
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
  width: 10px;
  margin-right: 7px;
`;

const GameButton = styled(Button)`
  span {
    font-weight: bold;
    text-transform: none;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const LazyFirstBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "FirstBonusRoundRoute", webpackPreload: true */ './routes/FirstBonusRoundRoute'
  ).then((module) => ({
    default: module.FirstBonusRoundRoute,
  })),
);

const LazySecondBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "SecondBonusRoundRoute", webpackPreload: true */ './routes/SecondBonusRoundRoute'
  ).then((module) => ({
    default: module.SecondBonusRoundRoute,
  })),
);

const LazyThirdBonusRoundRoute = lazy(() =>
  import(
    /* webpackChunkName: "ThirdBonusRoundRoute", webpackPreload: true */ './routes/ThirdBonusRoundRoute/ThirdBonusRoundRoute'
  ).then((module) => ({
    default: module.ThirdBonusRoundRoute,
  })),
);

export function App() {
  return (
    <div className="App">
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
        <Suspense fallback="loading next bonus round…">
          <Switch>
            <Route exact path="/">
              <MainGameRoute />
            </Route>

            <Route exact path="/bonus-round/1">
              <LazyFirstBonusRoundRoute />
            </Route>

            <Route exact path="/bonus-round/2">
              <LazySecondBonusRoundRoute />
            </Route>

            <Route exact path="/bonus-round/3">
              <LazyThirdBonusRoundRoute />
            </Route>

            <Route>
              <NextRoundLink to="/">Home</NextRoundLink>
            </Route>
          </Switch>
        </Suspense>

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
              <Twemoji
                text="🌍"
                className="inline-block"
                options={{ baseUrl: '//twemoji.maxcdn.com/' }}
              />
              &nbsp;
              <span>WhereTaken</span>
            </GameButton>
          </GamesContainer>
        </AdContainer>

        <div
          className="absolute -translate-x-full left-0 top-0 h-full justify-start items-end snigel-sidev"
          style={{
            zIndex: 200,
          }}
        >
          <div
            className="sticky top-0 inline-flex "
            style={{
              zIndex: 10000,
              height: 'auto',
              padding: '20px 40px 20px 20px',
              pointerEvents: 'all',
            }}
          >
            <div id="adngin-sidebar_right-0"></div>
          </div>
        </div>
      </CentreWrapper>
    </div>
  );
}