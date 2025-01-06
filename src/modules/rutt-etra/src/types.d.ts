import { ShaderMaterialParameters, Texture, Vector3 } from 'three';

export interface Input {
  width: number;
  height: number;
}

export interface VideoInput extends Input {
  element: HTMLVideoElement;
  src: string;
}

export interface Inputs {
  [key: string]: VideoInput;
}

export interface Output {
  width: number;
  height: number;
}

export interface CanvasOutput extends Output {
  element: HTMLVideoElement;
}

export interface Outputs {
  [key: string]: CanvasOutput;
}

export interface StageElements {
  geometry?: {
    [key: string]: {
      element: PlaneGeometry | BufferGeometry;
      step?: (element: PlaneGeometry | BufferGeometry) => typeof element;
    };
  };
  material?: {
    [key: string]: {
      element: Partial<ShaderMaterialParameters>;
      step?: (element: Partial<ShaderMaterialParameters>) => typeof element;
    };
  };
  texture?: {
    [key: string]: {
      element: Partial<VideoTexture | Texture>;
      step?: (element: Partial<VideoTexture | Texture>) => typeof element;
    };
  };
  mesh?: {
    [key: string]: {
      geometry: string;
      material?: string;
      position?: Vector3;
      step?: (element: Partial<Mesh>) => typeof element;
    };
  };
}

export interface StageEquipment {
  camera?: {
    [key: string]: {
      element: OrthographicCamera | PerspectiveCamera;
      step?: (
        element: OrthographicCamera | PerspectiveCamera,
      ) => typeof element;
    };
  };
  light?: {
    [key: string]: {
      element: AmbientLight | SpotLight;
      step?: (element: AmbientLight | SpotLight) => typeof element;
    };
  };
}

export interface Processor {
  renderer: WebGLRenderer;
}

export interface PostProcessor {
  composer: EffectComposer;
  pass: {
    [key: string]: {
      index: number;
      pass: RenderPass | ShaderPass | UnrealBloomPass | OutputPass;
      step?: (
        pass: RenderPass | ShaderPass | UnrealBloomPass | OutputPass,
        composer?: EffectComposer,
      ) => typeof pass;
    };
  };
}

export interface Scene {
  index: number;
  scene: Scene;
  element: StageElements;
  equipment: StageEquipment;
  processor: Processor;
  postProcessor: PostProcessor;
  inputs: Inputs;
  outputs: Outputs;
}

export interface Act {
  index: number;
  map: Map<string, Stage>;
}

export interface Sequence {
  index: number;
  map: Map<string, Act>;
}

export interface Timeline {
  index: number;
  map: Map<string, Sequence>;
}
