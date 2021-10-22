export const DitherShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    tDither: { type: "t", value: null },
    tPalette: { type: "t", value: null },

    u_bit_depth: { type: "i", value: 32 },
    u_contrast: { value: 1 },
    u_offset: { value: 0 },
    u_dither_size: { type: "i", value: 2 },
  },
  vertexShader: /*glsl*/ `
    varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
  `,
  fragmentShader: /*glsl*/ `
    /* 
    This shader is under MIT license. Feel free to use, improve and 
    change this shader according to your needs and consider sharing 
    the modified result to godotshaders.com.
    */

    uniform sampler2D tDiffuse;
		varying vec2 vUv;

    uniform sampler2D tDither;
    uniform sampler2D tPalette;

    uniform int u_bit_depth;
    uniform float u_contrast;
    uniform float u_offset;
    uniform int u_dither_size;

    void main() 
    {
      // sample the screen texture at the desired output resolution (according to u_dither_size)
      // this will effectively pixelate the resulting output
      vec2 screen_size = vec2(textureSize(tDiffuse, 0)) / float(u_dither_size);
      vec2 screen_sample_uv = floor(vUv * screen_size) / screen_size;
      vec3 screen_col = texture(tDiffuse, screen_sample_uv).rgb;
      
      // calculate pixel luminosity (https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color)
      float lum = (screen_col.r * 0.299) + (screen_col.g * 0.587) + (screen_col.b * 0.114);
      
      // adjust with contrast and offset parameters
      float contrast = u_contrast;
      lum = (lum - 0.5 + u_offset) * contrast + 0.5;
      lum = clamp(lum, 0.0, 1.0);
      
      // reduce luminosity bit depth to give a more banded visual if desired	
      float bits = float(u_bit_depth);
      lum = floor(lum * bits) / bits;
      
      // to support multicolour palettes, we want to dither between the two colours on the palette
      // which are adjacent to the current pixel luminosity.
      // to do this, we need to determine which 'band' lum falls into, calculate the upper and lower
      // bound of that band, then later we will use the dither texture to pick either the upper or 
      // lower colour.
      
      // get the palette texture size mapped so it is 1px high (so the x value however many colour bands there are)
      ivec2 col_size = textureSize(tPalette, 0);
      ivec2 test = col_size;
      col_size /= col_size.y;
      
      float col_x = float(col_size.x) - 1.0; // colour boundaries is 1 less than the number of colour bands
      float col_texel_size = 1.0 / col_x; // the size of one colour boundary
      
      lum = max(lum - 0.00001, 0.0); // makes sure our floor calculation below behaves when lum == 1.0
      float lum_lower = floor(lum * col_x) * col_texel_size;
      float lum_upper = (floor(lum * col_x) + 1.0) * col_texel_size;
      float lum_scaled = lum * col_x - floor(lum * col_x); // calculates where lum lies between the upper and lower bound
      
      // map the dither texture onto the screen. there are better ways of doing this that makes the dither pattern 'stick'
      // with objects in the 3D world, instead of being mapped onto the screen. see lucas pope's details posts on how he 
      // achieved this in Obra Dinn: https://forums.tigsource.com/index.php?topic=40832.msg1363742#msg1363742
      ivec2 noise_size = textureSize(tDither, 0);
      vec2 inv_noise_size = vec2(1.0 / float(noise_size.x), 1.0 / float(noise_size.y));
      vec2 noise_uv = vUv * inv_noise_size * vec2(float(screen_size.x), float(screen_size.y));
      float threshold = texture(tDither, noise_uv).r;
      
      // adjust the dither slightly so min and max aren't quite at 0.0 and 1.0
      // otherwise we wouldn't get fullly dark and fully light dither patterns at lum 0.0 and 1.0
      threshold = threshold * 0.99 + 0.005;
      
      // the lower lum_scaled is, the fewer pixels will be below the dither threshold, and thus will use the lower bound colour,
      // and vice-versa
      float ramp_val = lum_scaled < threshold ? 0.0f : 1.0f;
      // sample at the lower bound colour if ramp_val is 0.0, upper bound colour if 1.0
      float col_sample = mix(lum_lower, lum_upper, ramp_val);
      vec3 final_col = texture(tDiffuse, vec2(col_sample, 0.5)).rgb;
      
      // return the final colour!
      gl_FragColor = vec4(final_col, 1.0);
    }
  `,
}
