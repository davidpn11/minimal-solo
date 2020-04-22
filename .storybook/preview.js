import React from "react";
import { addDecorator } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { THEME } from "../src/theme";

const WrapperDecorator = (storyFn) => (
  <ThemeProvider theme={THEME}>{storyFn()}</ThemeProvider>
);

addDecorator(WrapperDecorator);
