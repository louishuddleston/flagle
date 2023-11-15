import { useMemo, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
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
  disabled,
  countries,
  onGuess,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (guess) => {
    onGuess(guess.value);
    setSelectedOption(null);
  };

  const sortedCountries = useMemo(
    () => countries.sort().map((val) => ({ label: val, value: val })),
    [countries],
  );

  return (
    <Container>
      <StyledSelect
        value={selectedOption}
        options={sortedCountries}
        onChange={handleSubmit}
        placeholder="Guess the flag!"
        isOptionDisabled={() => disabled}
      />
    </Container>
  );
};
