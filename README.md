# Rutt/Etra GLSL Shader

This project includes a GLSL shader that emulates the behavior of the analog Rutt/Etra video synthesizer. The original Rutt/Etra video synthesizer was developed by Steve Rutt and Bill Etra in the 1970s. Several video artists have used the Rutt/Etra video synthesizer to create video art, including Nam June Paik, Gary Hill, Woody Vasulka, and Steina Vasulka.

This shader is designed to be used with Three.js and is based on the legacy of the Rutt/Etra video synthesizer. For the full effect, combine this shader with a video texture and effects composer using BloomPass and FXAA. An example is provided in the source code.

Play with the Rutt/Etra GLSL shader at [https://readymade-ui.github.io/rutt-etra/](https://readymade-ui.github.io/rutt-etra/).

## Install

```
npm install @readymade/rutt-etra
```

## Getting Started

The shader works with JavaScript that accepts GLSL. three.js allows you to apply third party shaders with a `ShaderMaterial`. In the example below, we import all the necessary parts from three, along with `RuttEtraShader`.

```
import { VideoTexture, ShaderMaterial, DoubleSide, AdditiveBlending } from 'three';
import { RuttEtraShader } from '@readymade/rutt-etra';
```

The Rutt/Etra GLSL Shader can be applied with custom uniforms like in the below example that also accepts a video as a texture.

```
const videoElement = this.querySelector('#video');
const texture = new VideoTexture(videoElement);
const material = new ShaderMaterial({
      uniforms: {
        map: { value: texture },
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
      vertexShader: RuttEtraShader.vertexShader,
      fragmentShader: RuttEtraShader.fragmentShader,
      depthWrite: true,
      depthTest: true,
      wireframe: true,
      transparent: true,
      side: DoubleSide,
      blending: AdditiveBlending
    });
```

## Uniforms

| Uniform         | Type      | Description                              |
| --------------- | --------- | ---------------------------------------- |
| map             | sampler2D | Texture                                  |
| mode            | int       | 0 for scanline emulation, 1 for no lines |
| displace        | float     | Displacement factor                      |
| multiplier      | float     | Displacement multiplier                  |
| opacity         | float     | Overall alpha of the lines               |
| originX         | float     | X coordinate of the displacement origin  |
| originY         | float     | Y coordinate of the displacement origin  |
| originZ         | float     | Z coordinate of the displacement origin  |
| lineOffset      | float     | Offset between lines                     |
| lineWidth       | float     | Thickness of the lines                   |
| lineOrientation | int       | 0 for horizontal, 1 for vertical         |

## Synth

If all you need is the GLSL shader manipulating a video, the package also exports `Synth`, a `class` that instantiates a three.js `Scene` automatically. All you need is a container `HTMLElement` for `Synth` to inject a `HTMLCanvasElement` and `HTMLVideoElement`. An example of how `Synth` can be setup is available in the repository.

```
new Synth(canvasContainer, videoElement);
```

A live version of Synth that uses Readymade Controls can be viewed at [https://readymade-ui.github.io/rutt-etra/](https://readymade-ui.github.io/rutt-etra/).

## Getting Started with Development

This project was generated with starter code for developing Readymade projects built with Vite.

Developing projects with Web Components can seem daunting without sophisticated tooling.

Vite brings the following to developing Web Components with Readymade.

- code splitting and lazyloading
- fast build times with caching and hot module replacement
- import component style and template from separate files
- css and html pre / postprocessing
- typescript compilation

This repository adds some features too

- server side rendering with @lit-labs/ssr
- client side routing

### Installation

To get started, fork and clone the repo. Install dependencies with yarn. This project currently works with yarn v4.

`yarn`

### Development

`yarn start` starts up a local development server with code splitting, hot module replacement enabled by default. The first build takes longer. After the cache is populated the "hello world" project loads in ~1 second. Use `yarn start:client` instead for purely client-side projects.

The project is viewable at `http://localhost:4443`.

### Source

The default project is split into two directories found in the `src` directory: `client` and `server`. The server portion is only used in the production build and included middleware for server-side rendering custom elements with Declarative Shadow DOM.

### Production

`yarn build` builds the project for production. Found in the `dist` directory, the production build optimizes the html, css and javascript and prepares whitelisted components for server side rendering.

Run `yarn preview` to check the production build locally at `http://localhost:4444`.
