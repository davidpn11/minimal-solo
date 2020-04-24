import styled from 'styled-components';
import { CardWrapper } from '../../../../components/PlayingCard/styles';

export const DeckWrapper = styled.div`
  display: grid;
  overflow-x: auto;
  padding-top: 20px;
  grid-template-columns: repeat( 16, minmax(80px, 1fr) );
  grid-template-rows: 1fr;


  > * {
    margin: 6px;
  }

  ${CardWrapper} {
    transition: 0.15s ease-in;
    &:hover {
      transform: translateY(-8px) scale(1.05);
    }
  }
`;
