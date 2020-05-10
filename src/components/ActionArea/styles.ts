import styled from 'styled-components';
import { CardLower, CardUpper, CardValue, CardWrapper } from '../PlayingCard/styles';

export const AreaWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.gradients.blackGradient};
  border-radius: 8px;
  display: flex;
  grid-area: center;
  justify-content: space-evenly;
  margin: 20px;
  padding: 32px;

  svg {
    width: 200px;
  }
`;

export const SectionWrapper = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  height: 190px;
  padding: 8px;
  width: 150px;
  cursor: pointer;

  ${CardWrapper} {
    width: 120px;
    height: 170px;
    margin: auto;
    pointer-events: none;

    ${CardUpper} {
      top: 8px;
      left: 8px;
    }

    ${CardLower} {
      bottom: 8px;
      right: 8px;
    }

    ${CardUpper}, ${CardLower} {
      width: 24px;
      height: 24px;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    ${CardValue} {
      svg {
        width: 50px;
        height: 50px;
      }
    }
  }
`;

export const LogoWrapper = styled.div`
  padding: 0 16px;
`;
