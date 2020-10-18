import styled, { keyframes } from 'styled-components';

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

const animation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const InfiniteProgress = styled.div`
  background-color: ${props => props.theme.colors.blueBase};
  background-image: linear-gradient(
    90deg,
    ${props => props.theme.colors.blueBase},
    ${props => props.theme.colors.blueLight},
    ${props => props.theme.colors.blueBase}
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  height: 4px;
  transition: width 500ms ease;
  width: 100%;
  animation: ${animation} ease-in-out infinite 1s;
`;
