import { styled, keyframes } from "@stitches/react";
import { blip, select } from "./sounds";
import {
  MutableRefObject,
  ReactNode,
  ReactNodeArray,
  RefObject,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";

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

const panelListVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const PanelList = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div initial="closed" animate="open" variants={panelListVariants}>
      {children}
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
    y: -50,
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
              <PanelLegendExpandButton onClick={() => setOpen(!open)}>
                [{open ? "-" : "+"}]
              </PanelLegendExpandButton>{" "}
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
  padding: "0px 5px",
  textTransform: "uppercase",
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
  fontSize: "18px",
  fontWeight: "bold",
  color: ACCENT(),
  lineHeight: "16px",
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
  paddingLeft: 0,
  paddingRight: 0,
  border: "none",
  "&:hover": {
    "&::before": {
      content: "",
    },
    backgroundColor: ACCENT(),
    color: "black",
    transform: "translateX(0px)",
    cursor: "pointer",
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
    y: -50,
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
});
