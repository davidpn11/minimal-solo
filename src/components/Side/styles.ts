import styled from 'styled-components';

export const Wrapper = styled.aside`
  align-items: center;
  background-color: ${props => props.theme.colors.blackShadow};
  box-shadow: ${props => props.theme.shadows.base};
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  width: 256px;
  padding: 16px 16px;
`;

export const Title = styled.h1`
  align-items: center;
  color: ${props => props.theme.colors.white};
  display: flex;
  font-size: 18px;
  font-weight: 500;
  justify-content: flex-start;
  line-height: 21px;
  margin-bottom: 8px;
  padding: 0 8px;
  width: 100%;
`;

export const PlayersWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 16px;
  width: 100%;

  & > div + div {
    margin-top: 8px;
  }
`;

export const HistoryWrapper = styled.div`
  padding: 0 8px;
  width: 100%;
  height: 100%;
`;

export const EventCount = styled.p`
  align-items: center;
  color: ${props => props.theme.colors.border};
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  line-height: 12px;
  width: 100%;
`;
