import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import { Twemoji } from '@teuteuf/react-emoji-render';
import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import { HowToModal } from './components/HowToModal';
import { NextRoundLink } from './components/NextRoundLink';
import { StatsModal } from './components/StatsModal';
import { Title, TitleBar, TitleBarDiv } from './components/Title';
import { MainGameRoute } from './routes/MainGameRoute/MainGameRoute';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReactComponent: AngleIcon } = require('./angle_favicon.svg');

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
        <TitleBar>
          <TitleBarDiv justify="flex-end">
            <HowToModal />
          </TitleBarDiv>
          <Title>
            FLAG<span>LE</span>
          </Title>
          <TitleBarDiv>
            <StatsModal />
          </TitleBarDiv>
        </TitleBar>

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
              <AngleIcon width="12" />
              &nbsp;
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

        <AdWrapperWrapper className="snigel-sidev">
          <AdWrapper>
            <div id="adngin-sidebar_left-0"></div>
          </AdWrapper>
        </AdWrapperWrapper>
      </CentreWrapper>
    </div>
  );
}

const AdWrapperWrapper = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
`;

const AdWrapper = styled('div')`
  position: sticky;
  padding: 20px 40px 20px 20px;
  pointer-events: all;
`;
