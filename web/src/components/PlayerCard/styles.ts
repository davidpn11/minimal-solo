import styled from 'styled-components';

export const CardWrapper = styled.div`
  align-items: center;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.radius.base}px;
  box-shadow: ${props => props.theme.shadows.base};
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
  color: ${props => props.theme.colors.blackest};
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
`;

export const PlayerStatus = styled.h5`
  color: ${props => props.theme.colors.blackLight};
  margin-top: 2px;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
`;
