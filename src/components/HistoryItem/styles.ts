import styled from 'styled-components';

export const CardWrapper = styled.div`
  align-items: center;
  background: transparent;
  display: flex;
  flex-flow: row nowrap;
  padding: ${props => props.theme.spacing.base}px;
  width: 100%;
`;

export const PlayerInfo = styled.div`
  margin-left: ${props => props.theme.spacing.base}px;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
`;

export const PlayerName = styled.h4`
  color: ${props => props.theme.colors.white};
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
`;

export const PlayerStatus = styled.h5`
  color: ${props => props.theme.colors.border};
  margin-top: 2px;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  text-transform: lowercase;
`;
