import { Tube } from "@react-three/drei";
import React from "react";
import * as THREE from "three";
import { Curve, Vector, Vector3 } from "three";

export const RibbonRedux = () => {
  const path = React.useMemo(() => {
    const curve = new Curve<Vector3>();
    curve.getPoint = (t: number) => {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;

      return new THREE.Vector3(tx, ty, tz);
    };
    return curve;
  }, []);

  return (
    <Tube args={[path as any, 10, 2, 2]}>
      <meshPhongMaterial attach="material" color="#f3f3f3" />
    </Tube>
  );
};
