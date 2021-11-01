import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";

/**
 * Everything in this file is based on https://www.airtightinteractive.com/splash/projects/ribbons/,
 * I chopped and changed a lot porting it to r3f.
 * 
 * If there's an issue using this code as a base for my own work please let me know ASAP. 
 * 
 * @author bfollington / https://bf.wtf
 *
 * Original credits: 
 * RIBBON

 * Move Ribbons using joints
 * phong material

 * @author felixturner / http://airtight.cc/
 */

const RIBBON_LEN = 100; //number of spine point

function createRibbonGeom() {
  const positions = [];
  const vertexColors = [];

  //create verts + colors
  for (let i = 0; i < RIBBON_LEN; i++) {
    positions.push(new THREE.Vector3(i, i, 0));
    positions.push(new THREE.Vector3(i, i + 10, 0));
    vertexColors.push(new THREE.Color());
    vertexColors.push(new THREE.Color());
  }

  const indices = [];

  //create faces
  for (let i = 0; i < RIBBON_LEN - 1; i++) {
    indices.push(i * 2);
    indices.push(i * 2 + 1);
    indices.push(i * 2 + 2);

    indices.push(i * 2 + 1);
    indices.push(i * 2 + 3);
    indices.push(i * 2 + 2);
  }

  return { positions, indices };
}

const noise = new SimplexNoise();

function getNoiseAngle(time: number, noiseId: number, zOffset: number) {
  return noise.noise3D(time, noiseId, zOffset) * Math.PI * 2;
}

export default function Ribbon({ id = 1, color = "red" }) {
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

  const geometry = useRef<THREE.BufferGeometry>();
  const mesh = useRef<THREE.Mesh>();

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

    // construct mesh
    const geo = createRibbonGeom();
    if (geometry.current) {
      geometry.current.setFromPoints(geo.positions);
      geometry.current.setIndex(geo.indices);
      geometry.current.computeVertexNormals();
    }

    //movement arm vectors
    var armLenFac = 1.7;
    arm1.current = new THREE.Vector3(8 * armLenFac, 0, 0);
    arm2.current = new THREE.Vector3(4 * armLenFac, 0, 0);
    arm3.current = new THREE.Vector3(1.5 * armLenFac, 0, 0);

    onReset();
  }, [id]);

  const onReset = () => {
    //reset prev position
    prev.current.copy(head.current);

    for (let i = 0; i < RIBBON_LEN; i++) {
      // This typecast is offputting...
      const positions = geometry.current?.attributes.position.array as
        | undefined
        | Array<number>;
      if (positions) {
        positions[i * 6] = head.current.x;
        positions[i * 6 + 1] = head.current.y;
        positions[i * 6 + 2] = head.current.z;
        positions[i * 6 + 3] = head.current.x;
        positions[i * 6 + 4] = head.current.y;
        positions[i * 6 + 5] = head.current.z;
      }
    }

    if (geometry.current) {
      geometry.current.attributes.position.needsUpdate = true;
    }
  };

  useFrame(({ clock }, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(clock.elapsedTime) * (Math.PI / 20);
      mesh.current.rotation.y = Math.cos(clock.elapsedTime) * (Math.PI / 20);
      mesh.current.scale.y = 0.9 + 0.1 * Math.sin(clock.elapsedTime);
      mesh.current.scale.x = 0.9 + 0.1 * Math.cos(clock.elapsedTime);
    }

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

    //calc new L + R edge positions from direction between head and prev
    direction.current.subVectors(head.current, prev.current).normalize();
    normal.current.crossVectors(direction.current, up).normalize();
    normal.current.multiplyScalar(ribbonWidth.current);

    //shift each 2 verts down one posn
    //e.g. copy verts (0,1) -> (2,3)
    const verts = geometry.current?.attributes.position.array as
      | undefined
      | Array<number>;

    if (verts) {
      for (let i = RIBBON_LEN - 1; i > 0; i--) {
        verts[i * 6] = verts[(i - 1) * 6];
        verts[i * 6 + 1] = verts[(i - 1) * 6 + 1];
        verts[i * 6 + 2] = verts[(i - 1) * 6 + 2];
        verts[i * 6 + 3] = verts[(i - 1) * 6 + 3];
        verts[i * 6 + 4] = verts[(i - 1) * 6 + 4];
        verts[i * 6 + 5] = verts[(i - 1) * 6 + 5];
      }

      //populate 1st 2 verts with left and right normalHelper
      const v0 = new THREE.Vector3().copy(head.current).add(normal.current);
      verts[0] = v0.x;
      verts[1] = v0.y;
      verts[2] = v0.z;
      const v1 = new THREE.Vector3().copy(head.current).sub(normal.current);
      verts[3] = v1.x;
      verts[4] = v1.y;
      verts[5] = v1.z;
    }

    if (geometry.current) {
      geometry.current.attributes.position.needsUpdate = true;
      geometry.current.computeVertexNormals();
    }
  });

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <>
      <mesh position={[0, 0, 0]} ref={mesh}>
        <meshStandardMaterial
          attach="material"
          color={color}
          side={THREE.DoubleSide}
        />
        <bufferGeometry attach="geometry" ref={geometry} />
      </mesh>
    </>
  );
}
