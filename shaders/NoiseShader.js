export const NoiseShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    amount: { value: 0.08 },
    speed: { value: 0.5 },
    time: { value: 0 },
  },
  vertexShader: /*glsl*/ `
    varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
  `,
  fragmentShader: /*glsl*/ `
    uniform sampler2D tDiffuse;
		uniform float amount;
		uniform float speed;
		uniform float time;

		varying vec2 vUv;


		float random(vec2 n, float offset ){
			return .5 - fract(sin(dot(n.xy + vec2( offset, 0. ), vec2(12.9898, 78.233)))* 43758.5453);
		}

		void main() {
			vec3 color = texture2D(tDiffuse, vUv).rgb;
			color += vec3( amount * random( vUv, .0001 * speed * time ) );
			gl_FragColor = vec4(color,1.0);
		}
  `,
}
