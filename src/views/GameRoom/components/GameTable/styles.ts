import styled from 'styled-components';

export const TableWrapper = styled.div`
  background: #cfd8dc;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    'blank player player player blank'
    'player blank active deck player'
    'player blank blank blank player'
    'blank player you player blank';
  padding: 8px;

  border-radius: 6px;
  margin: 8px 0;
  flex: 1;
`;
