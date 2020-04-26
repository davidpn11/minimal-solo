import styled from "styled-components";
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

  svg {
    width: 128px;
    height: 128px;
  }

  ${ButtonWrapper} {
    width: 100%;
    margin-bottom: ${(props) => props.theme.spacing.medium}px;
  }
`;

export const RoomInput = styled.input`
  background: none;
  border: none;
  border-bottom: 1px solid white;
  font-size: 20px;
  padding: 1rem 0;
  width: 100%;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  width: 100%;
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing.base}px;
`;
