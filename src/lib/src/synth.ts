import {
  PerspectiveCamera,
  Scene,
  Color,
  PlaneGeometry,
  ShaderMaterial,
  DoubleSide,
  Mesh,
  WebGLRenderer,
  VideoTexture,
  LinearFilter,
  WebGLRenderTarget,
  NearestFilter,
  AmbientLight,
  SpotLight,
  SRGBColorSpace,
  BufferGeometry,
  AdditiveBlending,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass';
import { HueSaturationShader } from 'three/addons/shaders/HueSaturationShader';
import { FXAAShader } from 'three/addons/shaders/FXAAShader';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
import { OutputPass } from 'three/addons/postprocessing/OutputPass';

import { RuttEtraShader } from './shaders/RuttEtraShader';
import { PostProcessor, Processor, StageEquipment } from './types';

// parses and sorts post processing passes
export function postProcess(processor: PostProcessor) {
  const sorted = Object.values(processor.pass).sort(
    (a, b) => a.index - b.index,
  );
  for (const entry of sorted) {
    processor.composer.addPass(entry.pass);
    if (typeof entry.step === 'function') {
      entry.step(entry.pass, processor.composer);
    }
  }
}

// parses and constructs equipment
export function construct(equipment: StageEquipment, scene: Scene) {
  for (const groupKey in equipment) {
    for (const itemKey in equipment[groupKey]) {
      const item = equipment[groupKey][itemKey];
      if (typeof item.step === 'function') item.step(item.element);
      if (item.element) scene.add(item.element);
    }
  }
}

export class Synth {
  // elements
  container: Element;
  // inputs
  videoInput: HTMLVideoElement;
  width = 640;
  height = 480;
  scene: Scene;
  geometry: PlaneGeometry | BufferGeometry;
  material: ShaderMaterial;
  texture: VideoTexture;
  mesh: Mesh;
  equipment: StageEquipment;
  processor: Processor;
  postProcessor: PostProcessor;

  constructor(container: Element, videoInput: HTMLVideoElement) {
    // set dom elements for canvas and video
    this.container = container;
    this.videoInput = videoInput;

    // initialize scene
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
    // initialize geometry
    this.geometry = new PlaneGeometry(
      this.width,
      this.height,
      this.width,
      this.height,
    );
    // initialize mesh (this gets removed when video is loaded)
    this.mesh = new Mesh(this.geometry);
    this.scene.add(this.mesh);

    this.equipment = {
      camera: {
        main: {
          element: new PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            10000,
          ),
          step: (camera) => {
            camera.position.x = 0;
            camera.position.y = -1130;
            camera.position.z = 4680;
            camera.lookAt(this.mesh.position);
            return camera;
          },
        },
      },
      light: {
        fill: {
          element: new AmbientLight(0x707070),
          step: (light) => {
            light.intensity = 0.25;
            return light;
          },
        },
        key: {
          element: new SpotLight(0xffffff),
          step: (light) => {
            light.position.set(0, 0, 150).normalize();
            light.intensity = 10;
            light.castShadow = true;
            return light;
          },
        },
        back: {
          element: new SpotLight(0xffffff),
          step: (light) => {
            light.position.set(0, 0, -500).normalize();
            light.intensity = 100;
            light.castShadow = true;
            return light;
          },
        },
      },
    };

    construct(this.equipment, this.scene);

    // initialize post processing composition and renderer
    const renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: LinearFilter, magFilter: NearestFilter },
    );

    this.processor = {
      renderer: new WebGLRenderer({
        antialias: true,
      }),
    };

    this.processor.renderer.setRenderTarget(renderTarget);
    this.processor.renderer.setPixelRatio(window.devicePixelRatio);
    this.processor.renderer.setSize(window.innerWidth, window.innerHeight);
    this.processor.renderer.setAnimationLoop(this.animate.bind(this));
    this.processor.renderer
      .getRenderTarget()
      .setSize(window.innerWidth, window.innerHeight);

    // this.renderModel = new RenderPass(this.scene, this.camera);

    this.postProcessor = {
      composer: new EffectComposer(this.processor.renderer),
      pass: {
        renderModel: {
          index: 0,
          pass: new RenderPass(this.scene, this.equipment.camera.main.element),
        },
        bloom: {
          index: 1,
          pass: new UnrealBloomPass(0.25, 0.25, 0.25),
        },
        fxxa: {
          index: 2,
          pass: new ShaderPass(FXAAShader),
          step: (pass) => {
            pass.uniforms['resolution'].value.set(
              1 / window.innerWidth,
              1 / window.innerHeight,
            );
          },
        },
        hue: {
          index: 3,
          pass: new ShaderPass(HueSaturationShader),
        },
        output: {
          index: 4,
          pass: new OutputPass(),
        },
      },
    };

    postProcess(this.postProcessor);

    // start video and listen for loaded data
    this.videoInput.addEventListener('loadeddata', this.load.bind(this));
    this.videoInput.load();
    this.videoInput.loop = true;

    // handle window events
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // handle window events
    this.container.appendChild(this.processor.renderer.domElement);
  }
  // load video texture and update material with shader and mesh
  load() {
    this.scene.remove(this.mesh);
    this.texture = new VideoTexture(this.videoInput);
    this.texture.minFilter = NearestFilter;
    this.texture.magFilter = LinearFilter;
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.generateMipmaps = false;
    this.material = new ShaderMaterial({
      uniforms: {
        map: { value: this.texture },
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
      blending: AdditiveBlending,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  // animate on every requestAnimationFrame
  animate() {
    const time = performance.now();
    if (this.texture) this.texture.needsUpdate = true;
    if (this.material) this.material.needsUpdate = true;
    if (this.material) this.material.wireframe = true;
    this.mesh.scale.x = this.mesh.scale.y = 10.0;
    this.equipment.camera.main.element.lookAt(this.mesh.position);
    this.equipment.light.key.element.target = this.mesh;
    this.equipment.light.back.element.target = this.mesh;
    this.postProcessor.composer.render(time);
  }
  // handle window resize
  onWindowResize() {
    this.equipment.camera.main.element.updateProjectionMatrix();
    this.processor.renderer.setSize(window.innerWidth, window.innerHeight);
    this.postProcessor.composer.setSize(window.innerWidth, window.innerHeight);
    this.processor.renderer
      .getRenderTarget()
      .setSize(window.innerWidth, window.innerHeight);
  }
}
