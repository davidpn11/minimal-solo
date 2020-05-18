import styled from 'styled-components';
import { rgba } from 'polished';

export const ModalWrapper = styled.main`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 900;
`;

export const Backdrop = styled.div`
  background: ${props => rgba(props.theme.colors.blackest, 0.5)};
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 990;
`;

export const ModalCard = styled.div`
  background: ${props => props.theme.colors.blackBase};
  border: 2px solid ${props => props.theme.colors.redBase};
  border-radius: ${props => props.theme.radius.base}px;
  box-shadow: ${props => props.theme.shadows.darker};
  left: 50%;
  position: relative;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  z-index: 1000;
`;

export const ModalTitle = styled.h2`
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  margin: 0;
  padding: ${props => props.theme.spacing.medium}px;
  color: ${props => props.theme.colors.white};
`;

export const ModalContent = styled.section`
  padding: ${props => props.theme.spacing.medium}px;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.medium}px ${props => props.theme.spacing.medium}px;

  button {
    padding: ${props => props.theme.spacing.base}px ${props => props.theme.spacing.huge}px;
    width: 170px;
  }
`;
