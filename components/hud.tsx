import { styled } from "@stitches/react";

const HACKER_GREEN = (a = 1) => `rgba(32,194,14,${a})`;
const HACKER_ORANGE = (a = 1) => `rgba(232, 174, 59,${a})`;
const ACCENT = HACKER_ORANGE;

export const Panel = styled("fieldset", {
  // width: "28%",
  borderWidth: "2px",
  borderColor: ACCENT(0.5),
  borderStyle: "solid",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  padding: "8px",
  fontFamily: "'Space Mono', monospace",
  fontSize: "18px",
  color: ACCENT(),
  textAlign: "left",
  marginBottom: "8px",
  boxShadow: `
  0 1px 1px hsl(0deg 0% 0% / 0.175),
  0 2px 2px hsl(0deg 0% 0% / 0.175),
  0 4px 4px hsl(0deg 0% 0% / 0.175),
  0 8px 8px hsl(0deg 0% 0% / 0.175),
  0 16px 16px hsl(0deg 0% 0% / 0.175)`,
});

export const PanelLegend = styled("legend", {
  fontWeight: "bold",
  padding: "0px 5px",
  textTransform: "uppercase",
});

export const Button = styled("button", {
  borderWidth: "0px",
  borderColor: ACCENT(0.75),
  borderStyle: "solid",
  backgroundColor: "transparent",
  padding: "4px 4px",
  fontFamily: "'Space Mono', monospace",
  fontSize: "18px",
  fontWeight: "bold",
  color: ACCENT(),
  lineHeight: "16px",
  transition: "transform 0.2s ease-out",
  "&:hover": {
    "&::before": {
      content: ">",
    },
    backgroundColor: ACCENT(),
    color: "black",
    transform: "translateX(4px)",
    cursor: "pointer",
  },
});

export const Interface = styled("div", {
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  padding: "8px",
});

export const Text = styled("p", {
  margin: 0,
});
