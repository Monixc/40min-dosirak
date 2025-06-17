import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;
