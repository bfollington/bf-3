import { styled } from "../stitches";

const childWithGap = "> * + *";

// yoinked from https://codesandbox.io/s/stitches-stack-demo-lr2nj
export const Stack = styled("div", {
  display: "flex",
  $$gap: "initial",
  variants: {
    justify: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
    },
    spacing: {
      sm: {
        $$gap: "$space$2",
      },
      md: {
        $$gap: "$space$3",
      },
      lg: {
        $$gap: "$space$4",
      },
    },
    direction: {
      column: {
        flexDirection: "column",
        [childWithGap]: { margin: "$$gap 0 0 0" },
      },
      row: {
        flexDirection: "row",
        [childWithGap]: { margin: "0 0 0 $$gap" },
      },
      "row-reverse": {
        flexDirection: "row-reverse",
        [childWithGap]: { margin: "0 $$gap 0 0" },
      },
      "column-reverse": {
        flexDirection: "column-reverse",
        [childWithGap]: { margin: "0 0 $$gap 0" },
      },
    },
  },
  defaultVariants: {
    direction: "row",
    spacing: "md",
    justify: "start",
  },
});
