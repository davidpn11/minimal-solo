import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { Color, CardStatus } from "../../model/Card";
import { WithMinimalSoloTheme } from "../../theme";

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

type CardWrapperProps = { color: Color; status: CardStatus };

function mapCards(
  props: WithMinimalSoloTheme & CardWrapperProps
): FlattenSimpleInterpolation {
  if (props.status === "DECK") {
    return css`
      background: ${props.theme.gradients.blackestGradient};
      border-color: ${props.theme.colors.blackBase};
      padding: ${props.theme.spacing.base}px;

      ${CardValue} {
        left: 0;
        width: 100%;
      }

      svg {
        max-width: 80%;
        max-height: 144px;
      }
    `;
  } else if (props.status === "GAME") {
    return css`
      display: none;
    `;
  }
  switch (props.color) {
    case "BLUE":
      return css`
        background: ${props.theme.gradients.blueGradient};
        border-color: ${props.theme.colors.blueShadow};
      `;
    case "GOLD":
      return css`
        background: ${props.theme.gradients.yellowGradient};
        border-color: ${props.theme.colors.yellowShadow};
      `;
    case "GREEN":
      return css`
        background: ${props.theme.gradients.greenGradient};
        border-color: ${props.theme.colors.greenShadow};
      `;
    case "RED":
      return css`
        background: ${props.theme.gradients.redGradient};
        border-color: ${props.theme.colors.redShadow};
      `;
    case "BLACK":
    default:
      return css`
        background: ${props.theme.gradients.blackGradient};
        border-color: ${props.theme.colors.blackShadow};
      `;
  }
}

export const CardWrapper = styled.div<CardWrapperProps>`
  align-items: center;
  border: 1px solid;
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
`;
