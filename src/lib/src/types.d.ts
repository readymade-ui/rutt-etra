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
      callback?: (element: PlaneGeometry | BufferGeometry) => typeof element;
    };
  };
  material?: {
    [key: string]: {
      element: Partial<ShaderMaterialParameters>;
      callback?: (element: Partial<ShaderMaterialParameters>) => typeof element;
    };
  };
  texture?: {
    [key: string]: {
      element: Partial<VideoTexture | Texture>;
      callback?: (element: Partial<VideoTexture | Texture>) => typeof element;
    };
  };
  mesh?: {
    [key: string]: {
      geometry: string;
      material?: string;
      position?: Vector3;
      callback?: (element: Partial<Mesh>) => typeof element;
    };
  };
}

export interface StageEquipment {
  camera?: {
    [key: string]: {
      element: OrthographicCamera | PerspectiveCamera;
      position?: Vector3;
    };
  };
  light?: {
    [key: string]: {
      element: AmbientLight | SpotLight;
      position?: Vector3;
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
      pass: RenderPass | ShaderPass | BloomPass | OutputPass;
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
