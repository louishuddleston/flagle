import React, { useMemo } from "react";
import Select from 'react-select';
import styled from "styled-components";
import { useState } from "react";

const normalise = value => value.toUpperCase();
const StyledSelect = styled(Select)`
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  min-width: 200px;
  color: #000;
  :hover{
    border-color: #123456;
  }
`;

const AnswerBox = ({ answer, onCorrect, onIncorrect, disabled, countries, onGuess, ...props }) => {
  const [test, setTest] = useState(0);

  const handleSubmit = guess => {
      normalise(guess.value) === normalise(answer) ? onCorrect() : onIncorrect();
      onGuess(guess.value);
  };

  const sortedCountries = useMemo(() => countries.sort().map(val => ({label: val, value: val}))
  ,[countries]);

  function hideKeyboard(element) {
    var field = document.createElement('input');
    field.setAttribute('type', 'text');
    document.body.appendChild(field);
    setTimeout(function() {
        field.focus();
        setTimeout(function() {
            field.setAttribute('style', 'display:none;');
        }, 50);
    }, 50);
  }

  return (
    <StyledSelect
      options={sortedCountries} 
      onChange={handleSubmit}
      placeholder="Guess the flag!"
      isOptionDisabled={() => disabled}
      onMenuClose={() => setTest(test => test)}
    />
  );
};

export default AnswerBox;