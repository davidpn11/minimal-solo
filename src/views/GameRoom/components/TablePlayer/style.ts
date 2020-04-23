import styled from 'styled-components';
import { CardWrapper } from '../../../../components/PlayingCard/styles';

export const PlayerWrapper = styled.div`
  grid-area: player-1;
  display: flex;
  flex-direction: column;
  grid-gap: 4px;
  color: #fff;
`;
export const PlayerName = styled.h4`
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  margin: 0;
`;

export const PlayerCardsCount = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 4px;
`;
export const PlayerDeck = styled.div`
  border-radius: 6px;
  height: 100%;
  width: 100%;
  background: linear-gradient(333.05deg, #f2c94c 0.62%, #f4d167 100%);
  padding: 8px;
  display: flex;

  ${CardWrapper} {
    width: 70px;
    height: 120px;

    + ${CardWrapper} {
      margin-left: -60px;
    }
  }
`;
