import styled from 'styled-components';
import { HAND_HEIGHT } from '../../../../components/PlayerHand/styles';

export const TableWrapper = styled.div`
  background: ${props => props.theme.colors.blackShadow};
  height: calc(100vh - ${HAND_HEIGHT}px);
  max-width: 1168px;
  max-height: 640px;
  width: 100%;
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

  border-radius: ${props => props.theme.radius.board}px;
  flex: 1;
`;
