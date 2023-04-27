import styled from 'styled-components';

export const Attempts = styled(({ attempts, max, ...props }) => (
  <div {...props}>
    Attempts:{' '}
    <span>
      {attempts}/{max}
    </span>
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
