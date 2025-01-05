/**
 * Rutt/Etra video synthesizer emulation written in GLSL
 * https://github.com/readymade-ui/rutt-etra
 * Ported to run in web browsers from Vade's Quartz Composer plugin found here https://v002.info/plugins/v002-rutt-etra/
 * The original Rutt/Etra video synthesizer was developed by Steve Rutt and Bill Etra in the 1970s.
 * Several video artists have used the Rutt/Etra video synthesizer to create video art, including Nam June Paik, Gary Hill, Woody Vasulka, and Steina Vasulka.
 * This shader is designed to be used with Three.js and is based on the legacy of the Rutt/Etra video synthesizer.
 * For the full effect, combine this shader with a video texture and effects composer using BloomPass and FXAA.
 *
 * Uniforms:
 * map: texture (sampler2D)
 * displace: displacement factor (float)
 * multiplier: displacement multiplier (float)
 * originX: x coordinate of the origin (float)
 * originY: y coordinate of the origin (float)
 * originZ: z coordinate of the origin (float)
 * lineOffset: offset between lines (float)
 * lineWidth: thickness of the lines (float)
 * opacity: overall alpha of the lines (float)
 * lineOrientation: 0 for horizontal, 1 for vertical
 * mode: 0 for scanline emulation, 1 for no lines
 */

const RuttEtraShader = {
  name: 'RuttEtraShader',
  uniforms: {
    map: { value: null },
    displace: { value: 10.0 },
    multiplier: { value: 100.0 },
    originX: { value: 0.0 },
    originY: { value: 0.0 },
    originZ: { value: 2000.0 },
    opacity: { value: 0.25 },
    lineOffset: { value: 48.0 },
    lineWidth: { value: 12.0 },
    lineOrientation: { value: 1 },
    mode: { value: 0 },
  },
  vertexShader: /* glsl */ `
		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		uniform float displace;
		uniform float multiplier;
		uniform float originX;
		uniform float originY;
		uniform float originZ;

		void main() {
			vec3 origin = vec3(originX, originY, originZ);
			vec4 color = texture2D(map, uv);
			vUv = uv;
			float depth = multiplier * (color.r + color.g + color.b);
			vec4 pos = vec4(normalize(position - origin) * depth * vec3(1.0, 1.0, displace), 0.0) + vec4(position, 1.0);
			gl_Position = projectionMatrix * modelViewMatrix * pos;
		}
	`,
  fragmentShader: /* glsl */ `
  		precision highp int;
		precision highp float;
		uniform sampler2D map;
		uniform float opacity;
		uniform float lineOffset;
		uniform float lineWidth;
		uniform int lineOrientation;
		uniform int mode;
		varying vec2 vUv;

		void main() {
			vec4 color = texture2D(map, vUv);
			if (mode == 1) {
				gl_FragColor = vec4(color.r, color.g, color.b, opacity);
			} else if (mode == 0) {
				float pattern = (lineOrientation == 0)
					? fract(vUv.y * lineOffset)
					: fract(vUv.x * lineOffset);
				if (pattern < lineWidth / lineOffset) {
					gl_FragColor = vec4(color.r, color.g, color.b, opacity);
				} else {
					gl_FragColor = vec4(color.r, color.g, color.b, 0.0);
				}
			}
		}
	`,
};

export { RuttEtraShader };
