import styled from 'styled-components';

export const TitleBarDiv = styled.div<{ justify?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${({ justify = 'initial' }) => justify};
`;

export const TitleBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

export const Title = styled.div`
  display: block;
  font-size: 4rem;
  span {
    color: #1a76d2;
  }
`;
