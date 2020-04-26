import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400&display=swap");

* {
  box-sizing: border-box;
}

@font-face {
  font-family: "Simplifica";
  src: url("/fonts/simplifica.woff2") format("woff2"),
       url("/fonts/simplifica.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

body {
  margin: 0;
  background: ${(props) => props.theme.backgrounds.base};
  font-family: ${(props) => props.theme.fonts.Ubuntu};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  font-family: ${(props) => props.theme.fonts.Ubuntu};
  margin: 0;
  padding: 0;
}


`;
