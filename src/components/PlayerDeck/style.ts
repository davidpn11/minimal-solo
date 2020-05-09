import styled from 'styled-components';
import { CardWrapper } from '../PlayingCard/styles';
import { ThemeColors, ThemeGradients } from '../../theme';

export const PlayerName = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 2px;
`;

export const PlayerCardsCount = styled.h3`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  margin-bottom: 8px;
`;
export const PlayerDeck = styled.div`
  align-items: center;
  border-radius: 6px;
  display: flex;
  height: 100%;
  padding: 8px;
  width: 100%;

  ${CardWrapper} {
    height: 120px;
    width: 70px;

    svg {
      height: 40px;
      width: 40px;
    }

    + ${CardWrapper} {
      margin-left: -60px;
    }
  }
`;

type PlayerDeckProps = { position: number; textColor: ThemeColors; gradientColor: ThemeGradients };
export const PlayerDeckWrapper = styled.section<PlayerDeckProps>`
  color: ${props => props.theme.colors[props.textColor]};
  display: flex;
  flex-direction: column;
  grid-area: ${props => `player-${props.position}`};
  grid-gap: 4px;

  ${PlayerDeck} {
    background: ${props => props.theme.gradients[props.gradientColor]};
  }
`;
