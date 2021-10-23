import * as THREE from "three";
import React, { useRef, useMemo, useEffect, useState } from "react";
import SimplexNoise from "simplex-noise";
import { useFrame, useLoader } from "@react-three/fiber";
// import bg from "./resources/seamless8.png";
// import "./materials/ShinyMaterial";
import { Html } from "@react-three/drei";

var RIBBON_LEN = 100; //number of spine point

function createRibbonGeom() {
  //make geometry, faces & colors for a ribbon
  var i;

  const positions = [];
  const normals = [];
  const uvs = [];
  const vertexColors = [];

  //create verts + colors
  for (i = 0; i < RIBBON_LEN; i++) {
    positions.push(new THREE.Vector3(i, i, 0));
    positions.push(new THREE.Vector3(i, i + 10, 0));
    vertexColors.push(new THREE.Color());
    vertexColors.push(new THREE.Color());
  }

  const indices = [];

  //create faces
  for (i = 0; i < RIBBON_LEN - 1; i++) {
    // geom.faces.push(new THREE.Face3(i * 2, i * 2 + 1, i * 2 + 2))
    // geom.faces.push(new THREE.Face3(i * 2 + 1, i * 2 + 3, i * 2 + 2))

    indices.push(i * 2);
    indices.push(i * 2 + 1);
    indices.push(i * 2 + 2);

    indices.push(i * 2 + 1);
    indices.push(i * 2 + 3);
    indices.push(i * 2 + 2);
  }

  return { positions, indices };
}

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

  const geometry = useRef();

  const [debug, setDebug] = useState("");

  const onInit = () => {
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
  };

  const onReset = () => {
    var i;

    //reset prev position
    prev.current.copy(head.current);

    //reset mesh geom
    for (i = 0; i < RIBBON_LEN; i++) {
      geometry.current.attributes.position.array[i * 6] = head.current.x;
      geometry.current.attributes.position.array[i * 6 + 1] = head.current.y;
      geometry.current.attributes.position.array[i * 6 + 2] = head.current.z;
      geometry.current.attributes.position.array[i * 6 + 3] = head.current.x;
      geometry.current.attributes.position.array[i * 6 + 4] = head.current.y;
      geometry.current.attributes.position.array[i * 6 + 5] = head.current.z;
    }

    //init colors for this ribbon
    //hue is set by noiseId
    let hue1 = (noiseId + Math.random() * 0.01) % 2;
    let hue2 = (noiseId + Math.random() * 0.01) % 2;

    if (Math.random() < 0.1) {
      hue1 = Math.random();
    }
    if (Math.random() < 0.1) {
      hue2 = Math.random();
    }

    var sat = Math.random() * 0.4 + 0.6;
    var lightness = Math.random() * 0.4 + 0.2;

    var col = new THREE.Color();

    // TODO: fix this so the ribbons change colour along their length
    for (i = 0; i < RIBBON_LEN - 1; i++) {
      //add lightness gradient based on spine position
      col.setHSL(lerp(hue1, hue2, i / RIBBON_LEN), sat, lightness);

      // this.meshGeom.faces[i*2].color.copy(col);
      // this.meshGeom.faces[i*2+1].color.copy(col);
    }

    geometry.current.verticesNeedUpdate = true;
    geometry.current.colorsNeedUpdate = true;
  };

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

    //calc new L + R edge positions from direction between head and prev
    direction.current.subVectors(head.current, prev.current).normalize();
    normal.current.crossVectors(direction.current, up).normalize();
    normal.current.multiplyScalar(ribbonWidth.current);

    //shift each 2 verts down one posn
    //e.g. copy verts (0,1) -> (2,3)
    const verts = geometry.current.attributes.position.array;
    for (var i = RIBBON_LEN - 1; i > 0; i--) {
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

    if (geometry.current) {
      geometry.current.attributes.position.needsUpdate = true;
      //   geometry.current.computeFaceNormals();
      geometry.current.computeVertexNormals();
    }

    // setDebug(`${head.current.x}, ${head.current.y}, ${head.current.z}`)
  });

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <>
      <mesh position={[0, 0, 0]} ref={mesh}>
        {/* <shinyMaterial ref={material} attach="material" noiseTexture={texture} /> */}
        <meshStandardMaterial
          attach="material"
          color={color}
          side={THREE.DoubleSide}
        />
        <bufferGeometry attach="geometry" ref={geometry} />
        {/* <meshPhongMaterial
          attach="material"
          side={THREE.DoubleSide}
          vertexColors={THREE.FaceColors}
          color={"#FFFFFF"}
          shininess={30}
          specular={0x50473b}
          frustumCulled={false}
        /> */}
      </mesh>
      {/* <Html>
        <p>{debug}</p>
      </Html> */}
    </>
  );
}
