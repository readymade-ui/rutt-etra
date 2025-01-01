const RuttEtraShader = {
  name: 'RuttEtraShader',
  uniforms: {
    map: { value: null },
    multiplier: { value: 13.3 },
    displace: { value: 3.3 },
    opacity: { value: 1.0 },
    originX: { value: 0.0 },
    originY: { value: 0.0 },
    originZ: { value: 0.0 },
    lineSpacing: { value: 50.0 },
    lineWidth: { value: 10.0 },
    lineOrientation: { value: 0 }, // 0 for horizontal, 1 for vertical
    mode: { value: 0 }, // 0 with lines, 1 for wiithout
  },
  vertexShader: `
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
			float depth = multiplier * (color.r + color.g + color.b);
			vec4 pos = vec4(normalize(position - origin) * depth * vec3(1.0, 1.0, displace), 0.0) + vec4(position, 1.0);
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * pos;
		}
	`,
  fragmentShader: `
  		precision highp int;
		precision highp float;
		uniform sampler2D map;
		uniform float opacity;
		uniform float lineSpacing;
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
					? fract(vUv.y * lineSpacing)
					: fract(vUv.x * lineSpacing);
				if (pattern < lineWidth / lineSpacing) {
					gl_FragColor = vec4(color.r, color.g, color.b, opacity);
				} else {
					gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
				}
			}
		}
	`,
};

export { RuttEtraShader };
