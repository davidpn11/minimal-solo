import styled from 'styled-components';
import { CardWrapper } from '../../../../components/PlayingCard/styles';
import { HAND_HEIGHT } from '../../../../components/PlayerHand/styles';

export const TableWrapper = styled.div`
  background: #272627;
  height: calc(100vh - ${HAND_HEIGHT}px);

  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    'corner-1 player-4  player-5  player-6  corner-2'
    'player-3 center    center    center    player-7'
    'player-2 center    center    center    player-8'
    'coner-4  player-1  player-0  player-9  corner-3';
  padding: 12px 24px;

  border-radius: 6px;
  flex: 1;
`;

export const TableCenter = styled.div`
  background: linear-gradient(334.22deg, #363436 0%, #444144 100%);
  border-radius: 8px;
  grid-area: center;
  margin: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;

  svg {
    width: 200px;
  }
`;

export const CardPlaceholder = styled.div`
  background: #fff;
  padding: 8px;
  height: 190px;
  width: 150px;
  border-radius: 12px;
  padding-top: 8px;

  ${CardWrapper} {
    width: 120px;
    height: 170px;
    margin: auto;
  }
`;
