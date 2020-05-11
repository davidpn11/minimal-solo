import styled from 'styled-components';
import { CardLower, CardUpper, CardValue, CardWrapper } from '../PlayingCard/styles';
import { rgba } from 'polished';

export const HAND_HEIGHT = 248;

export const HandWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colors.blackBase};
  display: flex;
  flex-flow: row nowrap;
  height: ${HAND_HEIGHT}px;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: visible;
  padding: 0 32px;
  width: 100%;
  z-index: 5;
`;

export const HandCardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  height: 100%;
  margin: 0 16px;
  scrollbar-color: ${props => rgba(props.theme.colors.blueBase, 0.5)} transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: ${props => rgba(props.theme.colors.blueBase, 0.5)};
  }

  ${CardWrapper} {
    max-width: 104px;
    max-height: 156px;
    position: relative;

    &:not(:first-of-type) {
      margin-left: calc(-104px / 4);
    }

    :hover {
      z-index: 100;
      top: -16px;
    }
  }

  ${CardUpper} {
    top: 8px;
    left: 8px;
  }

  ${CardLower} {
    bottom: 8px;
    right: 8px;
  }

  ${CardUpper}, ${CardLower} {
    width: 16px;
    height: 16px;

    svg {
      width: 8px;
      height: 8px;
    }
  }

  ${CardValue} {
    svg {
      width: 50px;
      height: 50px;
    }
  }
`;
