import { Twemoji } from '@teuteuf/react-emoji-render';
import styled from 'styled-components';

import { useDailyCountryName } from '../hooks/useDailyCountryName';

export const WikipediaAndMapsLinks = () => {
  const dailyCountryName = useDailyCountryName();

  return (
    <LinksWrapper>
      <a
        className="underline text-center block mt-4 whitespace-nowrap"
        href={`https://www.google.com/maps?q=${dailyCountryName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twemoji
          text="👀"
          className="inline-block"
          options={{ baseUrl: '//twemoji.maxcdn.com/' }}
        />{' '}
        on Google Maps
      </a>
      <a
        className="underline text-center block mt-4 whitespace-nowrap"
        href={`https://en.wikipedia.org/wiki/${dailyCountryName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twemoji
          text="📚"
          className="inline-block"
          options={{ baseUrl: '//twemoji.maxcdn.com/' }}
        />{' '}
        on Wikipedia
      </a>
    </LinksWrapper>
  );
};

const LinksWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;
