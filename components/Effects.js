import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { extend, useThree, useFrame, useLoader } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { TiltShiftShader } from "../shaders/TiltShiftShader";
import { NoiseShader } from "../shaders/NoiseShader";
import { DitherShader } from "../shaders/DitherShader";
import { SpaceShader } from "../shaders/SpaceShader";
import { RGBShiftShader } from "../shaders/RGBShiftShader";

/**
 * Apologies for this one, I drag this effects chain from project to project.
 * It contains a bunch of effects I've collected and massaged into a compatible form.
 *
 * Start here: https://threejs.org/docs/#examples/en/postprocessing/EffectComposer
 */

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  AfterimagePass,
  GlitchPass,
});

export default function Effects() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(512, 512), []);
  const noisePass = useRef();
  const spacePass = useRef();
  const ditherPass = useRef();

  // const [paletteTex, ditherTex] = useLoader(THREE.TextureLoader, [
  //   palette,
  //   dither,
  // ]);
  // ditherTex.wrapS = ditherTex.wrapT = THREE.RepeatWrapping;
  // console.log(paletteTex.image.width, paletteTex.image.height);
  // console.log(ditherTex.image.width, ditherTex.image.height);

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(({ clock }) => {
    // noisePass.current.uniforms.time.value = clock.elapsedTime
    // spacePass.current.uniforms.time.value = clock.elapsedTime
    // ditherPass.current.uniforms.tDither.value = ditherTex;
    // ditherPass.current.uniforms.tPalette.value = paletteTex;
    composer.current.render();
  }, 1);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[aspect, 0.1, 0.5, 0]} />
      <afterimagePass
        attachArray="passes"
        args={[0.97]}
        scene={scene}
        camera={camera}
      />

      {/* <glitchPass
        attachArray="passes"
        args={[0.1]}
        scene={scene}
        camera={camera}
      /> */}

      <shaderPass
        attachArray="passes"
        args={[TiltShiftShader]}
        scene={scene}
        camera={camera}
      />
      <shaderPass
        ref={noisePass}
        attachArray="passes"
        args={[NoiseShader]}
        scene={scene}
        camera={camera}
      />
      <shaderPass
        ref={spacePass}
        attachArray="passes"
        args={[SpaceShader]}
        scene={scene}
        camera={camera}
      />
      {/* <shaderPass attachArray="passes" args={[RGBShiftShader]} scene={scene} camera={camera} /> */}
      {/* <shaderPass
        ref={ditherPass}
        attachArray="passes"
        args={[DitherShader]}
        scene={scene}
        camera={camera}
      /> */}

      {/* <shaderPass attachArray="passes" args={[CrtShader]} scene={scene} camera={camera} /> */}
    </effectComposer>
  );
}

// const blendPass = new THREE.ShaderPass(THREE.BlendShader, "tDiffuse1");
// blendPass.uniforms["tDiffuse2"].value = savePass.renderTarget.texture;
// blendPass.uniforms["mixRatio"].value = 0.8;
