import { createGlobalStyle } from 'styled-components';
import { rgba } from 'polished';

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
  background: ${props => props.theme.backgrounds.base};
  font-family: ${props => props.theme.fonts.Ubuntu};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  .MuiFormLabel-root {
      color: ${props => rgba(props.theme.colors.white, 0.67)};
      font-family: ${props => props.theme.fonts.Ubuntu};

      &.Mui-focused {
        color: ${props => props.theme.colors.redBase};
      }

      &.Mui-disabled {
        color: ${props => rgba(props.theme.colors.white, 0.24)};
      }
    }

    .MuiOutlinedInput-root {
      color: ${props => props.theme.colors.white};
      font-family: ${props => props.theme.fonts.Ubuntu};
      border-radius: ${props => props.theme.radius.base}px;
      margin-bottom: ${props => props.theme.spacing.medium}px;

      .MuiOutlinedInput-notchedOutline {
        border-color: ${props => rgba(props.theme.colors.white, 0.67)};
        border-width: 2px;
      }

      :hover {
        .MuiOutlinedInput-notchedOutline {
          border-color: ${props => props.theme.colors.white};
        }
      }

      &.Mui-disabled {
        color: ${props => rgba(props.theme.colors.white, 0.24)};

        .MuiOutlinedInput-notchedOutline {
          border-color: ${props => rgba(props.theme.colors.white, 0.24)};
        }
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme.colors.redBase} !important;
      }
    }

    .MuiFormHelperText-root {
      color: ${props => props.theme.colors.redBase};
      font-family: ${props => props.theme.fonts.Ubuntu};
      font-weight: 600;
      margin-bottom: ${props => props.theme.spacing.small}px;
      margin: 0;
      padding: 0;
      position: relative;
      top: -12px;
    }
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
  font-family: ${props => props.theme.fonts.Ubuntu};
  margin: 0;
  padding: 0;
}
`;
