import { css } from "@emotion/core";

const GlobalCSS = css`
  [disabled] {
    pointer-events: none;
  }
  html,
  body {
    cursor: unset;
    height: 100%;
    width: 100%;
    background-color: #edf1f5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Open Sans', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;

export default GlobalCSS;
