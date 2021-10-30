import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  media: {
    bp1: "(min-width: 768px)",
    bp2: "(min-width: 1024px)",
    bp3: "(min-width: 1280px)",
  },
  theme: {
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
    },
  },
});
