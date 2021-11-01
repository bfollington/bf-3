import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

// This works but doesn't include anything from the effects composer
export const useScreenshot = () => {
  const { gl, scene, camera } = useThree();

  const capture = useCallback(() => {
    console.log(gl);
    gl.render(scene, camera);
    // gl.toneMapping = THREE.ACESFilmicToneMapping;
    // gl.toneMappingExposure = 0.6;
    // gl.outputEncoding = THREE.sRGBEncoding;
    // (gl as any).preserveDrawingBuffer = true;
    gl.domElement.toBlob(
      function (blob) {
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "canvas.jpg";
        a.click();
        console.log("function is actually being used");
      },
      "image/jpg",
      1.0
    );
  }, [camera, gl, scene]);

  return capture;
};
