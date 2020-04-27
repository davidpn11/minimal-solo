import styled from "styled-components";
import { rgba } from "polished";
import { ButtonWrapper } from "../../components/Button/styles";

export const Page = styled.main`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100vh;
`;

export const CardWrapper = styled.div`
  align-items: center;
  background: ${(props) => props.theme.backgrounds.base};
  border-radius: ${(props) => props.theme.radius.base}px;
  border: 2px solid ${(props) => props.theme.colors.redBase};
  display: flex;
  flex-flow: column nowrap;
  height: 560px;
  padding: ${(props) => props.theme.spacing.medium}px;
  width: 384px;
  box-shadow: ${(props) => props.theme.shadows.darker};

  svg {
    width: 144px;
    height: 144px;
    margin-bottom: ${(props) => props.theme.spacing.base}px;
  }

  ${ButtonWrapper} {
    width: 100%;
    margin-bottom: ${(props) => props.theme.spacing.medium}px;
  }

  .MuiFormLabel-root {
    color: ${(props) => rgba(props.theme.colors.white, 0.67)};
    font-family: ${(props) => props.theme.fonts.Ubuntu};

    &.Mui-focused {
      color: ${(props) => props.theme.colors.redBase};
    }
  }

  .MuiOutlinedInput-root {
    color: ${(props) => props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.Ubuntu};
    border-radius: ${(props) => props.theme.radius.base}px;
    margin-bottom: ${(props) => props.theme.spacing.medium}px;

    .MuiOutlinedInput-notchedOutline {
      border-color: ${(props) => rgba(props.theme.colors.white, 0.67)};
      border-width: 2px;
    }

    :hover {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.theme.colors.white};
      }
    }
  }

  && {
    .Mui-focused {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.theme.colors.redBase};
      }
    }
  }

  .MuiFormHelperText-root {
    color: ${(props) => props.theme.colors.redBase};
    font-family: ${(props) => props.theme.fonts.Ubuntu};
    font-weight: 600;
    margin-bottom: ${(props) => props.theme.spacing.small}px;
    margin: 0;
    padding: 0;
    position: relative;
    top: -12px;
  }
`;

export const Title = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  width: 100%;
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing.medium}px;
`;
