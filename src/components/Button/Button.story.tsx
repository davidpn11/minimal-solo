import styled, { createGlobalStyle } from "styled-components";
import React from "react";
import { Button } from "./index";

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  height: 100%;
  justify-content: center;
  width: 100%;
  overflow: hidden;
`;

const Global = createGlobalStyle`
  #root {
    box-sizing: border-box;
    max-width: calc(100vw - 16px);
    height: calc(100vh - 16px);
    padding: 0;
    display: flex;
    flex-flow: column nowrap; 
  }
`;

export function ButtonStory() {
  return (
    <Container>
      <Global />
      <Button>START A NEW ROOM</Button>
    </Container>
  );
}

export default {
  title: "MinimalSolo/Components/Button",
  component: ButtonStory,
  decorators: [],
};
