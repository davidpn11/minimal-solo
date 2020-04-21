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
  border-radius: ${(props) => props.theme.radius.base}px;
  box-shadow: ${(props) => props.theme.shadows.base};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 300px;
  justify-content: space-between;
  max-height: 300px;
  max-width: 200px;
  padding: ${(props) => props.theme.spacing.medium}px;
  position: relative;
  width: 200px;

  ${mapCards}

  > * {
    width: 100%;
  }
`;

export const CardValue = styled.span`
  align-items: center;
  display: flex;
  height: 128px;
  justify-content: center;
  left: calc(50% - 64px);
  margin: 0;
  padding: 0;
  position: absolute;
  top: calc(50% - 64px);
  width: 128px;

  svg {
    max-width: 96px;
    max-height: 96px;
  }
`;

export const CardUpper = styled.span`
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: center;
  left: 16px;
  position: absolute;
  top: 16px;
  width: 32px;

  svg {
    max-width: 16px;
    max-height: 16px;
  }
`;

export const CardLower = styled.span`
  align-items: center;
  bottom: 16px;
  display: flex;
  height: 32px;
  justify-content: center;
  position: absolute;
  right: 16px;
  transform: rotate(180deg);
  width: 32px;

  svg {
    max-width: 16px;
    max-height: 16px;
  }
`;
