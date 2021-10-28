import * as THREE from "three";
import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import SimplexNoise from "simplex-noise";
import { useFrame, useLoader } from "@react-three/fiber";
// import bg from "./resources/seamless8.png";
// import "./materials/ShinyMaterial";
import { Html, Tube } from "@react-three/drei";
import { Vector3, Curve } from "three";

var RIBBON_LEN = 100; //number of spine point

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

const noise = new SimplexNoise();

function getNoiseAngle(time, noiseId, zOffset) {
  // return noise.noise3d( noiseTime, noiseId, zOffset ) * Math.PI*2;
  // console.log(time, noiseId, zOffset)
  return noise.noise3D(time, noiseId, zOffset) * Math.PI * 2;
  // return Math.PI * 2 * (Math.sin(time) + 1)
}

export default function Ribbon({ id = 1, color = "red" }) {
  const material = useRef();
  const mesh = useRef();
  // //   const [texture] = useLoader(THREE.TextureLoader, [bg]);
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const up = new THREE.Vector3(1, 0, 0);
  const direction = useRef(new THREE.Vector3(0, 0, 0));
  const normal = useRef(new THREE.Vector3(0, 0, 0));

  const arm1 = useRef(new THREE.Vector3());
  const arm2 = useRef(new THREE.Vector3());
  const arm3 = useRef(new THREE.Vector3());

  const arm1T = useRef(new THREE.Vector3());
  const arm2T = useRef(new THREE.Vector3());
  const arm3T = useRef(new THREE.Vector3());

  const xAxis = new THREE.Vector3(1, 0, 0);
  const yAxis = new THREE.Vector3(0, 1, 0);
  const zAxis = new THREE.Vector3(0, 0, 1);

  const noiseId = useRef(-1);
  const ribbonWidth = useRef(-1);

  const head = useRef(new THREE.Vector3(0, 0, 0));
  const prev = useRef(new THREE.Vector3(0, 0, 0));

  const onInit = useCallback(() => {
    noiseId.current = id / 300;

    // generate thiccness
    ribbonWidth.current = Math.random() * 1.5 + 0.25;
    if (Math.random() < 0.2) {
      ribbonWidth.current = 4;
    }

    //head is the thing that moves, prev follows behind
    head.current = new THREE.Vector3(0, 0, 0);
    prev.current = new THREE.Vector3(0, 0, 0);

    //movement arm vectors
    var armLenFac = 1.7;
    arm1.current = new THREE.Vector3(8 * armLenFac, 0, 0);
    arm2.current = new THREE.Vector3(4 * armLenFac, 0, 0);
    arm3.current = new THREE.Vector3(1.5 * armLenFac, 0, 0);

    onReset();
  }, [id]);

  const onReset = () => {
    var i;

    //reset prev position
    prev.current.copy(head.current);
  };

  const pathHistory = useRef(
    [...Array(RIBBON_LEN + 1)].map((_) => new Vector3(0, 0, 0))
  );

  useFrame(({ clock }, delta) => {
    // material.current.time += delta + Math.sin(clock.elapsedTime / 10) / 1000
    mesh.current.rotation.x = Math.sin(clock.elapsedTime) * (Math.PI / 20);
    mesh.current.rotation.y = Math.cos(clock.elapsedTime) * (Math.PI / 20);
    mesh.current.scale.y = 0.9 + 0.1 * Math.sin(clock.elapsedTime);
    mesh.current.scale.x = 0.9 + 0.1 * Math.cos(clock.elapsedTime);

    prev.current.copy(head.current);

    //move arms
    arm1T.current.copy(arm1.current);
    arm2T.current.copy(arm2.current);
    arm3T.current.copy(arm3.current);

    const t = clock.elapsedTime / 5.0;

    arm1T.current.applyAxisAngle(zAxis, getNoiseAngle(t, noiseId.current, 0));
    arm1T.current.applyAxisAngle(yAxis, getNoiseAngle(t, noiseId.current, 20));

    arm2T.current.applyAxisAngle(zAxis, getNoiseAngle(t, noiseId.current, 50));
    arm2T.current.applyAxisAngle(xAxis, getNoiseAngle(t, noiseId.current, 70));

    arm3T.current.applyAxisAngle(xAxis, getNoiseAngle(t, noiseId.current, 100));
    arm3T.current.applyAxisAngle(yAxis, getNoiseAngle(t, noiseId.current, 150));

    //MOVE HEAD
    head.current.copy(arm1T.current).add(arm2T.current).add(arm3T.current);
    for (var i = RIBBON_LEN; i > 0; i--) {
      pathHistory.current[i].copy(pathHistory.current[i - 1]);
    }
    pathHistory.current[0] = head.current.clone();
  });

  useEffect(() => {
    onInit();
  }, [onInit]);

  const path = React.useMemo(() => {
    const curve = new Curve();
    curve.getPoint = (t) => {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;

      const step = Math.floor(t * RIBBON_LEN);

      // console.log(step < pathHistory.current.length - 1, step);
      console.log(pathHistory.current[step]);
      return new Vector3(0, 0, 0).copy(pathHistory.current[step]);
    };
    return curve;
  }, []);

  useFrame(() => {
    console.log(mesh.current);
  });

  return (
    <Tube ref={mesh} args={[path, 10, 2, 2]}>
      <meshPhongMaterial attach="material" color={color} />
    </Tube>
  );
}
