import styled from 'styled-components';

export const PlayersWrapper = styled.div`
  margin-top: ${props => props.theme.spacing.medium}px;
  display: grid;
  grid-template-columns: 300px 300px;
  //TODO Mobile column size
  /* grid-template-columns: 150px 150px; */
  grid-template-rows: repeat(6, 1fr);
  gap: 5px;
  grid-template-areas: 'AdminPlayer CurrentPlayer';
`;

export const AdminPlayer = styled.div`
  grid-area: AdminPlayer;
`;

export const CurrentPlayer = styled.div`
  grid-area: CurrentPlayer;
`;
