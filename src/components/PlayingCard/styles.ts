import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { Color } from "../../model/Card";
import { WithMinimalSoloTheme } from "../../theme";

type CardWrapperProps = { color: Color };

function mapCards(
  props: WithMinimalSoloTheme & CardWrapperProps
): FlattenSimpleInterpolation {
  switch (props.color) {
    case "BLUE":
      return css`
        background: ${props.theme.gradients.blueGradient};
      `;
    case "GOLD":
      return css`
        background: ${props.theme.gradients.yellowGradient};
      `;
    case "GREEN":
      return css`
        background: ${props.theme.gradients.greenGradient};
      `;
    case "RED":
      return css`
        background: ${props.theme.gradients.redGradient};
      `;
    case "BLACK":
    default:
      return css`
        background: ${props.theme.gradients.blackGradient};
      `;
  }
}

export const CardWrapper = styled.div<CardWrapperProps>`
  align-items: center;
  border-radius: ${props => props.theme.radius.base}px;
  box-shadow: ${props => props.theme.shadows.base};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 180px;
  justify-content: space-between;
  max-height: 300px;
  max-width: 200px;
  padding: ${props => props.theme.spacing.medium}px;
  width: 120px;
  
  ${mapCards}

  > * {
    width: 100%;
  }
`;

export const CardValue = styled.h1`
  margin: 0;
  padding: 0;
  text-align: center;
`;

export const CardUpper = styled.span``;

export const CardLower = styled.span`
  transform: rotate(180deg);
`;
