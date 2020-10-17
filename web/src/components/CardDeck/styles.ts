import styled from 'styled-components';
import { CardValueElement, CardWrapper } from '../PlayingCard/styles';

export const CardsWrapper = styled.div`
  margin-top: -40px;

  ${CardWrapper} {
    position: relative;
    margin: auto;
    margin-bottom: -165px;

    ${CardValueElement} {
      svg {
        width: 64px;
        height: 64px;
      }
    }

    &:nth-child(1) {
      z-index: 8;
    }
    &:nth-child(2) {
      z-index: 7;
    }
    &:nth-child(3) {
      z-index: 6;
    }
    &:nth-child(4) {
      z-index: 5;
    }
    &:nth-child(5) {
      z-index: 4;
    }
    &:nth-child(6) {
      z-index: 3;
    }
    &:nth-child(7) {
      z-index: 2;
    }

    &:nth-child(n + 8) {
      margin-bottom: -170px;
      z-index: 1;
    }
  }
`;
