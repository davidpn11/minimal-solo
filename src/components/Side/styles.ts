import styled from 'styled-components';

export const Wrapper = styled.aside`
  align-items: center;
  background-color: ${props => props.theme.colors.blackShadow};
  box-shadow: ${props => props.theme.shadows.base};
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  padding: 16px 8px;
  width: 240px;
`;

export const Title = styled.h1`
  align-items: center;
  color: ${props => props.theme.colors.white};
  display: flex;
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  padding: 0 8px;
`;

export const HistoryWrapper = styled.div`
  padding: 0 8px;
  width: 100%;
`;

export const EventCount = styled.p``;
