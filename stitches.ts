import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  media: {
    bp1: "(min-width: 768px)",
    bp2: "(min-width: 1024px)",
    bp3: "(min-width: 1280px)",
    bp4: "(min-width: 1920px)",
  },
  theme: {
    font: {
      size: "17px",
      lineHeight: "22px",
      fontFamily: "'Space Mono', monospace",
    },
    panel: {
      border: "2px",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
    },
    sidebar: {
      minWidth: "480px",
      maxWidth: "512px",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
      5: "64px",
      6: "128px",
    },
  },
});
