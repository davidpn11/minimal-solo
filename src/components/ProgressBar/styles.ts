import styled from 'styled-components';

export const ProgressWrapper = styled.div`
  background: transparent;
  height: 4px;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  pointer-events: none;
  z-index: 1000;
`;

export const Progress = styled.div<{ progress: number }>`
  height: 4px;
  width: ${props => props.progress}%;
  background: ${props => props.theme.gradients.blueGradient};
  transition: width 500ms ease;
`;
