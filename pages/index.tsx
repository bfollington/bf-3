import { animated, useSpring } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";
import Effects from "../components/Effects";
import {
  ActionButton,
  AnimatedPanel,
  Panel,
  PanelList,
  Text,
} from "../components/hud";
import Ribbon from "../components/Ribbon";
import { entry } from "../components/sounds";
import pkg from "../package.json";
import { styled } from "../stitches";
import styles from "../styles/Home.module.css";

const Main = styled("main", {
  width: "100vw",
  height: "100vh",
  position: "fixed",
  margin: 0,
  padding: 0,
});

const VersionTag = styled("div", {
  position: "fixed",
  right: "$2",
  bottom: "$2",
  opacity: 0.3,
  color: "white",
  pointerEvents: "none",
});

const PlayWithArtPrompt = styled("div", {
  position: "fixed",
  right: "$2",
  left: "$2",
  bottom: "4%",
  textAlign: "center",
  opacity: 0.3,
  color: "white",
  pointerEvents: "none",
});

const Overlay = styled("div", {
  gridColumn: "1 / 5",
  gridRow: "1 / 5",
  paddingBottom: "$space$6",
  color: "white",
  overflowY: "auto",

  pointerEvents: "all",

  variants: {
    layout: {
      sm: {
        gridColumn: "1 / 5",
        gridRow: "1 / 5",
        maxWidth: "$sidebar$maxWidth",
        paddingBottom: "$space$6",
      },
      md: {
        gridColumn: "1 / 3",
        gridRow: "1 / 5",
        paddingBottom: "0",
      },
      lg: {
        gridColumn: "1 / 3",
        gridRow: "1 / 5",
        minWidth: "$sidebar$minWidth",
        maxWidth: "$sidebar$maxWidth",
        paddingBottom: "0",
      },
    },
  },
});

const Padding = styled("div", {
  padding: "$2",
  boxSizing: "border-box",
  variants: {
    layout: {
      sm: {
        padding: "$1",
      },
      md: {
        padding: "$2",
      },
      lg: {
        padding: "$3",
      },
    },
  },
});

const HudGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "25% 25% 25% 25%",
  gridTemplateRows: "25% 25% 25% 25%",

  position: "fixed",
  pointerEvents: "none",

  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
});

const OverlayRight = styled("div", {
  display: "none",
  color: "white",
  overflowY: "auto",

  pointerEvents: "all",

  variants: {
    layout: {
      sm: {
        display: "none",
      },
      md: {
        display: "block",
        gridColumn: "4 / 5",
        gridRow: "1 / 5",
      },
      lg: {
        justifySelf: "end",
        display: "block",
        gridColumn: "4 / 5",
        gridRow: "1 / 5",
        // minWidth: "$sidebar$minWidth",
        maxWidth: "$sidebar$maxWidth",
      },
    },
  },
});

const visit = (url: string, delay: number = 0) => {
  if (delay > 0) {
    setTimeout(() => {
      window.open(url, "_blank");
    }, delay);
  } else {
    window.open(url, "_blank");
  }
};

const DesktopOnly = () => {
  return (
    <Padding layout="md">
      <PanelList>
        <AnimatedPanel
          title="Social"
          expanded
          actions={[
            <ActionButton
              onActivate={() => visit("https://twitter.com/vivavolt", 300)}
              index={0}
              key={0}
              activationKey="T"
            >
              twitter
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit("https://shimmeringvoid.substack.com/", 300)
              }
              index={0}
              key={0}
              activationKey="K"
            >
              substack
            </ActionButton>,
            <ActionButton
              onActivate={() => visit("https://github.com/bfollington", 300)}
              index={1}
              key={1}
              activationKey="G"
            >
              github
            </ActionButton>,
            <ActionButton
              onActivate={() => visit("https://www.are.na/ben-follington", 300)}
              index={2}
              key={2}
              activationKey="A"
            >
              are.na
            </ActionButton>,
            <ActionButton
              onActivate={() => visit("https://twopm.itch.io/", 300)}
              index={3}
              key={3}
              activationKey="I"
            >
              itch.io
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit("https://www.shadertoy.com/user/vivavolt", 300)
              }
              index={4}
              key={4}
              activationKey="D"
            >
              shadertoy
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit("https://codesandbox.io/u/bfollington", 300)
              }
              index={5}
              key={5}
              activationKey="B"
            >
              codesandbox
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit(
                  "https://www.youtube.com/channel/UCDoPS90Bk_u5isrlSKWCJiA",
                  300
                )
              }
              index={6}
              key={6}
              activationKey="U"
            >
              youtube
            </ActionButton>,
            <ActionButton
              onActivate={() => visit("https://twitch.tv/vivavolt", 300)}
              index={7}
              key={7}
              activationKey="W"
            >
              twitch
            </ActionButton>,
          ]}
        ></AnimatedPanel>
        <AnimatedPanel
          title="Generative Art"
          actions={[
            <ActionButton
              onActivate={() =>
                visit(
                  "https://www.are.na/ben-follington/generative-art-xi7hppoqskq",
                  300
                )
              }
              index={0}
              key={0}
              activationKey="Y"
            >
              gallery
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit("https://www.fxhash.xyz/u/shimmeringvoid", 300)
              }
              index={1}
              key={1}
              activationKey="H"
            >
              fxhash
            </ActionButton>,
            <ActionButton
              onActivate={() =>
                visit("https://www.instagram.com/shimmeringvoid/", 300)
              }
              index={2}
              key={2}
              activationKey="M"
            >
              instagram
            </ActionButton>,
          ]}
        ></AnimatedPanel>
        <AnimatedPanel
          title="View Source"
          toggleable={false}
          actions={[
            <ActionButton
              onActivate={() =>
                visit("https://github.com/bfollington/bf-3", 300)
              }
              index={0}
              key={0}
              activationKey="Q"
            >
              view code
            </ActionButton>,
          ]}
        >
          <Text>
            View the code for this site on github, it&apos;s built with react,
            next.js, stitchesjs, react-three-fiber, react-spring, framer-motion,
            zzfx and love.
          </Text>
        </AnimatedPanel>
      </PanelList>
    </Padding>
  );
};

const Visibility = styled("div", {
  variants: {
    visiblity: {
      visible: {
        display: "block",
      },
      hidden: {
        display: "none",
      },
    },
  },
});

const Greetings = styled("div", {
  gridColumn: "2 / 3",
  gridRow: "2 / 3",
  pointerEvents: "all",
  variants: {
    size: {
      small: {
        gridColumn: "1 / 5",
        gridRow: "2 / 4",
      },
      regular: {
        gridColumn: "2 / 3",
        gridRow: "2 / 3",
      },
    },
  },
});

const Maximised = styled("div", {
  gridColumn: "1 / 4",
  gridRow: "1 / 1",
  pointerEvents: "all",
  variants: {
    layout: {
      small: {
        gridColumn: "1 / 5",
        gridRow: "1 / 1",

        maxWidth: "$sidebar$maxWidth",
      },
      large: {
        gridColumn: "1 / 3",
        gridRow: "1 / 1",
        maxWidth: "$sidebar$maxWidth",
      },
    },
  },
});

const Home: NextPage = () => {
  const showBg = true;

  const [view, setView] = useState<"initial" | "active" | "maximised">(
    "initial"
  );
  const { scale } = useSpring({
    scale: view === "initial" ? 0.1 : 1,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Ben Follington - generalist designer, programmer and artist
        </title>
        <meta
          name="description"
          content="Ben Follington: generalist designer, programmer and artist making cool stuff with computers."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {showBg && (
          <Canvas camera={{ position: [15, 15, 15] }}>
            <color attach="background" args={["black"]} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <pointLight position={[30, 0, 0]} color="blue" intensity={10} />
              <pointLight position={[0, -30, 0]} color="pink" intensity={5} />
              <pointLight position={[0, 0, 30]} color="purple" intensity={5} />
              <animated.group scale={scale}>
                <Ribbon id={1} color="#7b505c" />
                <Ribbon id={64} color="#E8AE3B" />
                <Ribbon id={256} color="#E8AE3B" />
                <Ribbon id={512} color="#E8AE3B" />
                <Ribbon id={128} color="#e4d6cf" />
              </animated.group>
              <Effects />
            </Suspense>
            <OrbitControls
              minPolarAngle={Math.PI / 10}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        )}
      </Main>

      <VersionTag>
        <Text>
          bf.wtf
          {" " + pkg.version}
        </Text>
      </VersionTag>
      <HudGrid className="hud">
        {view === "maximised" && (
          <Maximised layout={{ "@initial": "small", "@bp2": "large" }}>
            <Padding layout="md">
              <PanelList>
                <AnimatedPanel
                  title="Go Back"
                  actions={[
                    <ActionButton
                      onActivate={() => {
                        setTimeout(entry, 100);
                        setTimeout(() => {
                          setView("active");
                        }, 300);
                      }}
                      index={0}
                      key={0}
                      activationKey="B"
                    >
                      back to site
                    </ActionButton>,
                  ]}
                >
                  <Text>Use the mouse or touch to pan, zoom and rotate.</Text>
                </AnimatedPanel>
              </PanelList>
            </Padding>
          </Maximised>
        )}
        {view === "initial" && (
          <Greetings size={{ "@initial": "small", "@bp1": "regular" }}>
            <Padding layout="md">
              <PanelList>
                <Panel title="BF.WTF">
                  <Text>Welcome.</Text>
                  <br />
                  <ActionButton
                    onActivate={() => {
                      setTimeout(entry, 100);
                      setTimeout(() => {
                        setView("active");
                      }, 300);
                    }}
                    index={0}
                    key={0}
                    activationKey="A"
                  >
                    activate
                  </ActionButton>
                </Panel>
              </PanelList>
            </Padding>
          </Greetings>
        )}
        {view === "active" && (
          <>
            <Visibility visiblity={{ "@initial": "hidden", "@bp4": "visible" }}>
              <PlayWithArtPrompt>
                <Text>click + drag + scroll</Text>
              </PlayWithArtPrompt>
            </Visibility>
            <Overlay
              layout={{
                "@initial": "sm",
                "@bp1": "sm",
                "@bp2": "md",
                "@bp3": "lg",
              }}
            >
              <Padding layout="md">
                <PanelList>
                  <AnimatedPanel title="Welcome">
                    <Text>
                      Hi, I&apos;m Ben Follington. I&apos;m a generalist
                      designer, programmer and artist living in Brisbane,
                      Australia. I make, think and write about cool user
                      interfaces, video games, the nature of reality and 
                      whatever else interests me.
                    </Text>
                    <br />

                    <Text>
                      My work combines elegant user-focused design with technical
                      sophistication while exploring the frontiers of
                      human-computer interaction. I strive for straightforward
                      code, delightful UX, clear communication, strategic
                      planning, rapid progress and microscopic attention to
                      detail. But, at the end of the day, I mostly want to use
                      technology to make people happy.
                    </Text>
                  </AnimatedPanel>

                  <AnimatedPanel
                    title="Work"
                    actions={[
                      <ActionButton
                        onActivate={() => visit("https://cv.bf.wtf", 300)}
                        index={0}
                        key={0}
                        activationKey="C"
                      >
                        cv
                      </ActionButton>,
                      <ActionButton
                        onActivate={() =>
                          visit("https://github.com/bfollington", 300)
                        }
                        index={1}
                        key={1}
                        activationKey="G"
                      >
                        github
                      </ActionButton>,
                      <ActionButton
                        onActivate={() => visit("mailto:work@bf.wtf", 300)}
                        index={1}
                        key={1}
                        activationKey="E"
                      >
                        email me
                      </ActionButton>,
                    ]}
                  >
                    <Text>
                      I will be open for freelance and contract work in Q3 2022.
                    </Text>
                    <br />
                    <Text>
                      I have extensive experience with UI/UX engineering, design
                      systems, gamedev, software architecture, API design, web
                      app architecture, interactive visuals (Unity, Godot, webgl
                      &amp; canvas) and mentoring enthusiastic developers.
                    </Text>
                  </AnimatedPanel>
                  <AnimatedPanel
                    title="Projects"
                    actions={[
                      <ActionButton
                        onActivate={() =>
                          visit(
                            "https://store.steampowered.com/app/1274210/The_Song_of_the_Fae/",
                            300
                          )
                        }
                        index={0}
                        key={0}
                        activationKey="S"
                      >
                        the song of the fae
                      </ActionButton>,
                      <ActionButton
                        onActivate={() => visit("https://fundamental.sh", 300)}
                        index={1}
                        key={1}
                        activationKey="F"
                      >
                        fundamental.sh
                      </ActionButton>,
                      <ActionButton
                        onActivate={() =>
                          visit("https://shimmeringvoid.substack.com/", 300)
                        }
                        index={2}
                        key={2}
                        activationKey="V"
                      >
                        shimmeringvoid
                      </ActionButton>,
                      <ActionButton
                        onActivate={() => visit("https://twopm.studio", 300)}
                        index={3}
                        key={3}
                        activationKey="P"
                      >
                        twopm studios
                      </ActionButton>,
                      <ActionButton
                        onActivate={() =>
                          visit(
                            "https://www.are.na/ben-follington/soundtrack-to-my-life",
                            300
                          )
                        }
                        index={4}
                        key={4}
                        activationKey="L"
                      >
                        soundtrack to my life
                      </ActionButton>,
                    ]}
                  >
                    <Text>
                      In my own time I develop commercial and free games,
                      release OSS, blog about programming and get sentimental
                      about art, life, philosophy and meditation.
                    </Text>
                  </AnimatedPanel>

                  <AnimatedPanel
                    title="Support Me"
                    toggleable={false}
                    actions={[
                      <ActionButton
                        onActivate={() =>
                          visit(
                            "https://www.blockchain.com/eth/address/0x981e493b795A7a28c43Bf8d7a8E125C419435Fa7",
                            300
                          )
                        }
                        index={0}
                        key={0}
                        activationKey="3"
                      >
                        donate ETH
                      </ActionButton>,
                      <ActionButton
                        onActivate={() =>
                          visit("https://ko-fi.com/vivavolt", 300)
                        }
                        index={1}
                        key={1}
                        activationKey="4"
                      >
                        donate $
                      </ActionButton>,
                    ]}
                  ></AnimatedPanel>

                  <AnimatedPanel
                    title="Explore Mode"
                    toggleable={false}
                    actions={[
                      <ActionButton
                        onActivate={() =>
                          setTimeout(() => setView("maximised"), 300)
                        }
                        index={0}
                        key={0}
                        activationKey="X"
                      >
                        maximise art
                      </ActionButton>,
                    ]}
                  ></AnimatedPanel>
                </PanelList>
              </Padding>
            </Overlay>
          </>
        )}
        {view === "active" && (
          <OverlayRight
            layout={{
              "@initial": "sm",
              "@bp1": "sm",
              "@bp2": "md",
              "@bp3": "lg",
            }}
            className="source-panel"
          >
            <DesktopOnly />
          </OverlayRight>
        )}
      </HudGrid>
    </div>
  );
};

export default Home;
