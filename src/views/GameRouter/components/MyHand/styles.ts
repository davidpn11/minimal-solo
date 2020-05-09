import styled from 'styled-components';
import { CardWrapper } from '../../../../components/PlayingCard/styles';

export const DeckWrapper = styled.div`
  overflow-x: auto;
  padding-top: 20px;

  > * {
    margin: 6px;
  }

  ${CardWrapper} {
  }
`;

export const HandCardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HandCardWrapper = styled.div`
  overflow: hidden;
  &:last-child,
  &:hover {
    overflow: visible;
  }

  &:hover {
    transition: 0.15s ease-in;
    &:hover {
      transform: translateY(-12px) scale(1.05);
      z-index: 6;
    }
  }
`;
