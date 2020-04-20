import styled, { css } from "styled-components";

const cardColors = {
  green: css`
    background: #4caf50;
    color: #fff;
  `,

  yellow: css`
    background: #ffc107;
    color: #3e2723;
  `,

  blue: css`
    background: #2196f3;
    color: #fff;
  `,

  red: css`
    background: #f44336;
    color: #fff;
  `,
  neutral: css`
    background: #37474f;
    color: #fff;
  `,
};

export type Colors = "green" | "red" | "blue" | "yellow" | "neutral";

export const CardWrapper = styled.div<{ color: Colors }>`
  width: 120px;
  height: 200px;
  background: #fff;
  flex-shrink: 0;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props) => cardColors[props.color]}

  > * {
    width: 100%;
  }
`;

export const CardValue = styled.h1`
  margin: 0;
  padding: 0;
  text-align: center;
`;

export const CardUpper = styled.span``;

export const CardLower = styled.span`
  transform: rotate(180deg);
`;
