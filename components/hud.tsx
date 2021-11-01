import { keyframes } from "@stitches/react";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  ReactNodeArray,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { styled } from "../stitches";
import { blip, closePanel, mount, openPanel, select } from "./sounds";
import { Stack } from "./Stack";

let useKeyDown = (...meh: any[]) => {};

if (process.browser) {
  useKeyDown = require("use-control/lib/keyStream").useKeyDown;
}

const HACKER_GREEN = (a = 1) => `rgba(32,194,14,${a})`;
const HACKER_ORANGE = (a = 1) => `rgba(232, 174, 59,${a})`;
const ACCENT = HACKER_ORANGE;

export const Panel = styled("fieldset", {
  // width: "28%",
  borderWidth: "2px",
  borderColor: ACCENT(0.5),
  borderStyle: "solid",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  padding: "8px",
  margin: 0,
  fontFamily: "'Space Mono', monospace",
  fontSize: "17px",
  lineHeight: "22px",
  color: ACCENT(),
  textAlign: "left",
  boxShadow: `
  0 1px 1px hsl(0deg 0% 0% / 0.175),
  0 2px 2px hsl(0deg 0% 0% / 0.175),
  0 4px 4px hsl(0deg 0% 0% / 0.175),
  0 8px 8px hsl(0deg 0% 0% / 0.175),
  0 16px 16px hsl(0deg 0% 0% / 0.175)`,

  "& + &": {
    marginTop: "$space$2",
  },
});

const panelListVariants = {
  open: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const PanelList = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    React.Children.forEach(children, (c, i) => {
      setTimeout(openPanel, i * 100 + 500);
    });
  }, [children]);

  return (
    <motion.div initial="closed" animate="open" variants={panelListVariants}>
      <Stack direction="column">{children}</Stack>
    </motion.div>
  );
};

const animatedPanelVariants = {
  open: {
    y: 0,
    opacity: 1,
    // transition: {
    //   y: { stiffness: 1000, velocity: -100 },
    // },
  },
  closed: {
    y: 48,
    opacity: 0,
    // transition: {
    //   y: { stiffness: 1000 },
    // },
  },
};

export const AnimatedPanel = ({
  title,
  children,
  expanded = true,
  toggleable = true,
  actions,
}: {
  title?: string;
  children?: ReactNode;
  expanded?: boolean;
  toggleable?: boolean;
  actions?: ReactNodeArray;
}) => {
  const [open, setOpen] = useState(expanded);

  return (
    <motion.div variants={animatedPanelVariants}>
      <Panel>
        <PanelLegend>
          {toggleable && (
            <>
              <PanelLegendExpandButton
                onClick={() => {
                  setOpen(!open);
                  open ? closePanel() : openPanel();
                }}
              >
                [{open ? "-" : "+"}]
              </PanelLegendExpandButton>
            </>
          )}
          {title}
        </PanelLegend>
        {children}
        {actions && actions.length > 0 && children && <br />}
        <ActionButtonList open={open}>
          <AnimatePresence>{open && actions}</AnimatePresence>
        </ActionButtonList>
      </Panel>
    </motion.div>
  );
};

export const PanelLegend = styled("legend", {
  fontWeight: "bold",
  padding: "0px $1",
  textTransform: "uppercase",
  textShadow: `-1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000`,
});

const flicker = keyframes({
  "0%": { opacity: 1 },
  "25%": { opacity: 0 },
  "50%": { opacity: 1 },
  "75%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const Button = styled("button", {
  borderWidth: "0px",
  borderColor: ACCENT(0.75),
  borderStyle: "solid",
  backgroundColor: "transparent",
  padding: "4px 4px",
  fontFamily: "'Space Mono', monospace",
  fontSize: "17px",
  fontWeight: "bold",
  color: ACCENT(),
  lineHeight: "15px",
  outline: "none",
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
  variants: {
    active: {
      yes: {
        animation: `${flicker} 300ms`,
        "&::before": {
          content: ">",
        },
        backgroundColor: ACCENT(),
        color: "black",
        transform: "translateX(4px)",
        cursor: "pointer",
      },
      no: {
        animation: "none",
      },
    },
  },
});

export const PanelLegendExpandButton = styled(Button, {
  background: "none",
  padding: "$1 0",
  marginRight: "$1",
  border: "none",
  textShadow: `-1px -1px 0 #000,  
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000`,
  "&:hover": {
    "&::before": {
      content: "",
    },
    backgroundColor: ACCENT(),
    color: "black",
    transform: "translateX(0px)",
    cursor: "pointer",
    textShadow: "none",
  },
});

type ActionButtonProps = {
  children: string;
  index?: number;
  activationKey: string;
  onActivate?: () => void;
};

const actionButtonListVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    visibility: "visible" as const,
    height: "auto",
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    visibility: "hidden" as const,
    height: 0,
  },
};

export const ActionButtonList = ({
  children,
  open,
}: {
  open: boolean;
  children: ReactNode;
}) => {
  return (
    <motion.div
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={actionButtonListVariants}
      custom={open}
    >
      {children}
    </motion.div>
  );
};

const actionButtonVariants = {
  open: {
    y: 0,
    opacity: 1,
    // transition: {
    //   y: { stiffness: 1000, velocity: -100 },
    // },
  },
  closed: {
    y: 25,
    opacity: 0,
    // transition: {
    //   y: { stiffness: 1000 },
    // },
  },
};

export const ActionButton = ({
  children,
  index = 0,
  activationKey,
  onActivate,
}: ActionButtonProps) => {
  const el: RefObject<HTMLButtonElement> = useRef(null);
  const [active, setActive] = useState(false);
  const onEnter = () => blip(index);
  const onClick = () => {
    select();
    onActivate && onActivate();
    setActive(true);
    el.current?.focus();
    setTimeout(() => setActive(false), 500);
  };

  useKeyDown(activationKey.charCodeAt(0), () => {
    onClick();
  });

  return (
    <motion.div variants={actionButtonVariants}>
      <Button
        ref={el}
        onClick={onClick}
        onMouseEnter={onEnter}
        active={active ? "yes" : "no"}
      >
        <code>[{activationKey}]</code> {children}
      </Button>
    </motion.div>
  );
};

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
  fontFamily: "'Space Mono', monospace",
  fontSize: "17px",
});
