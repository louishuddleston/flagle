import { useMemo } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const normalise = (value) => value.toUpperCase();
const StyledSelect = styled(Select)`
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  color: #000;
  :hover {
    border-color: #123456;
  }
`;

const Container = styled.div`
  width: 100%;
  padding: 0 8px;
  max-width: 376px;
`;

export const AnswerBox = ({
  answer,
  onCorrect,
  onIncorrect,
  disabled,
  countries,
  onGuess,
}) => {
  const handleSubmit = (guess) => {
    normalise(guess.value) === normalise(answer) ? onCorrect() : onIncorrect();
    onGuess(guess.value);
  };

  const sortedCountries = useMemo(
    () => countries.sort().map((val) => ({ label: val, value: val })),
    [countries],
  );

  return (
    <Container>
      <StyledSelect
        options={sortedCountries}
        onChange={handleSubmit}
        placeholder="Guess the flag!"
        isOptionDisabled={() => disabled}
      />
    </Container>
  );
};
