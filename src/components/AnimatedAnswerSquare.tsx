import styled, { css } from 'styled-components';

import { ChoiceStatus } from '../hooks/useRoundState';

export const AnimatedAnswerSquare = styled.button<{
  animationDuration: number;
  choiceStatus?: ChoiceStatus;
  selected?: boolean;
}>`
  display: flex;
  align-items: center;
  border: 4px solid #ccc;
  padding: 0.75rem;
  overflow: hidden;
  border-radius: 10px;
  transform: scale(1);

  ${(props) =>
    props.selected &&
    css`
      animation: vibrate ${props.animationDuration}ms 1;
      animation-direction: alternate;
      animation-timing-function: ease-in;
    `}

  ${(props) =>
    props.selected &&
    css`
      &::after {
        content: '';
        animation: scale ${props.animationDuration}ms 1;
        // 90% of the way through the animation
        animation-delay: ${props.animationDuration -
        (props.animationDuration * 10) / 100}ms;
        width: 100%;
        transform: scale(0);
        animation-fill-mode: forwards;
        background-color: ${props.choiceStatus === ChoiceStatus.CORRECT
          ? 'green'
          : props.choiceStatus === ChoiceStatus.INCORRECT
          ? 'red'
          : ''};
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        border-radius: 100%;
      }
    `}

  @keyframes scale {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(2);
    }
  }
  @keyframes vibrate {
    0%,
    100% {
      transform: rotate(0deg);
      transform-origin: 50% 50%;
    }

    10% {
      transform: rotate(8deg);
    }

    20%,
    40%,
    60% {
      transform: rotate(10deg);
    }

    30%,
    50%,
    70% {
      transform: rotate(-10deg);
    }

    80% {
      transform: rotate(8deg);
    }

    90% {
      transform: rotate(0deg);
    }
  }
`;
