import styled from 'styled-components';
import { CardLower, CardUpper, CardValue, CardWrapper } from '../PlayingCard/styles';

export const HAND_HEIGHT = 188;

export const HandWrapper = styled.section`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: ${HAND_HEIGHT}px;
  overflow: hidden;
  padding: 16px 32px;
`;

export const HandCardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${CardWrapper} {
    max-width: 104px;
    max-height: 156px;
    margin-left: calc(-104px / 4);

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
