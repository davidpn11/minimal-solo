import styled from 'styled-components';

export const GameWrapper = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
`;

export const Main = styled.main`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  flex-shrink: 1;
  background: ${props => props.theme.colors.blackLight};
  height: 100vh;
  align-items: center;
  justify-content: space-between;
`;

export const BoardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
