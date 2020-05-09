import React from "react";
import { addDecorator } from "@storybook/react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { THEME } from "../src/theme";
import { GlobalStyles } from "../src/styles";

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

const StorybookContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  height: 100%;
  justify-content: center;
  width: 100%;
  overflow: hidden;
`;

const WrapperDecorator = (storyFn) => (
  <ThemeProvider theme={THEME}>
    <GlobalStyles />
    <Global />
    <StorybookContainer>{storyFn()}</StorybookContainer>
  </ThemeProvider>
);

addDecorator(WrapperDecorator);
