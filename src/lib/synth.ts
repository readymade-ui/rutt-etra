import {
  OrthographicCamera,
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
  Vector3,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
import { BloomPass } from 'three/addons/postprocessing/BloomPass';
import { HueSaturationShader } from 'three/addons/shaders/HueSaturationShader';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
import { OutputPass } from 'three/addons/postprocessing/OutputPass';

import { RuttEtraShader } from './src/shaders/RuttEtraShader';

// TODO: refactor so less properties are public, reduce controllable aspects to an interface?
export class Synth {
  // elements
  container: Element;
  // inputs
  videoInput: HTMLVideoElement;
  width = 640;
  height = 480;

  // three
  // stage
  scene: Scene;
  // props
  geometry: PlaneGeometry | BufferGeometry;
  material: ShaderMaterial;
  texture: VideoTexture;
  mesh: Mesh;
  // equipment
  camera: OrthographicCamera | PerspectiveCamera;
  focus: Vector3;
  fill: AmbientLight;
  key: SpotLight;
  back: SpotLight;
  // processing
  renderer: WebGLRenderer;
  // post-processing
  composer: EffectComposer;
  renderModel: RenderPass;
  effectBloom: BloomPass;
  effectHue: ShaderPass;
  outputPass: OutputPass;

  constructor(container: Element, videoInput: HTMLVideoElement) {
    // set dom elements for canvas and video
    this.container = container;
    this.videoInput = videoInput;

    // initialize camera
    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    this.camera.position.x = 0;
    this.camera.position.y = -1130;
    this.camera.position.z = 3680;

    // initialize focus, unused but could be handy
    this.focus = new Vector3();
    this.focus.z = -2000;

    // initialize scene
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    // initialize geometry
    this.geometry = new PlaneGeometry(640, 480, 640, 480);

    // initialize mesh (this gets removed when video is loaded)
    this.mesh = new Mesh(this.geometry);
    this.scene.add(this.mesh);

    // initialize lights
    this.fill = new AmbientLight(0x707070); // soft white light
    this.scene.add(this.fill);

    this.key = new SpotLight(0xffffff);
    this.key.position.set(0, 0, 150).normalize();
    this.key.target = this.mesh;

    this.key.intensity = 10;
    this.key.castShadow = true;
    this.scene.add(this.key);

    this.back = new SpotLight(0xffffff);
    this.back.position.set(0, 0, -500).normalize();
    this.back.target = this.mesh;

    this.back.intensity = 100;
    this.back.castShadow = true;
    this.scene.add(this.back);

    // initialize post processing composition and renderer
    const renderTarget = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: LinearFilter, magFilter: NearestFilter },
    );

    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.setRenderTarget(renderTarget);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this));

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.renderer
      .getRenderTarget()
      .setSize(window.innerWidth, window.innerHeight);

    this.renderModel = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderModel);

    this.effectBloom = new BloomPass(3.5, 4.5, 1.1);
    this.composer.addPass(this.effectBloom);

    this.effectHue = new ShaderPass(HueSaturationShader);
    this.composer.addPass(this.effectHue);

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);

    // start video and listen for loaded data
    this.videoInput.addEventListener('loadeddata', this.load.bind(this));
    this.videoInput.load();
    this.videoInput.loop = true;

    // handle window events
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // handle window events
    this.container.appendChild(this.renderer.domElement);
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
        originX: { value: 0.0 },
        originY: { value: 0.0 },
        originZ: { value: 2000.0 },
        opacity: { value: 0.95 },
        multiplier: { value: 130.3 },
        displace: { value: 7.3 },
        mode: { value: 0 },
        lineSpacing: { value: 50.0 },
        lineWidth: { value: 10.0 },
        lineOrientation: { value: 1 },
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
    this.texture && (this.texture.needsUpdate = true);
    this.material && (this.material.needsUpdate = true);
    this.material && (this.material.wireframe = true);
    this.mesh.scale.x = this.mesh.scale.y = 10.0;
    this.camera.lookAt(this.mesh.position);
    this.key.target = this.mesh;
    this.back.target = this.mesh;
    this.composer.render(time);
  }
  // handle window resize
  onWindowResize() {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.renderer
      .getRenderTarget()
      .setSize(window.innerWidth, window.innerHeight);
  }
}
