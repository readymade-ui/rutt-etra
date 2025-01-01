import { Component, CustomElement } from '@readymade/core';
import { Synth } from '../../../../lib/src';
import template from './home.html?raw';
import style from './home.css?raw';

@Component({
  selector: 'app-home',
  style,
  template,
})
class HomeComponent extends CustomElement {
  synth: Synth;
  shadowRoot: ShadowRoot;
  constructor() {
    super();
  }
  public connectedCallback() {
    // this.synth = new Synth(this.shadowRoot, true, true, [
    //   {
    //     camera: '0.0,-1130.0,1680.0',
    //     shape: 'plane',
    //     detail: 480,
    //     scale: 10.0,
    //     wireframe: true,
    //     multiplier: 15.0,
    //     displace: 3.3,
    //     origin: '0,0,-2000.0',
    //     opacity: 1.0,
    //     hue: 0,
    //     saturation: 0.7,
    //     bgColor: '#000',
    //   },
    // ]);
    const canvasContainer = this.shadowRoot.querySelector('#canvas');
    const videoElement = this.shadowRoot.querySelector(
      '#video',
    ) as HTMLVideoElement;
    const synth = new Synth(canvasContainer, videoElement);
    console.log(synth);

    // this.synth.fetchDefaults();
    // this.animateIn();
  }
  public animateIn() {
    // if (!this.shadowRoot.querySelector) return;
    // this.shadowRoot.querySelector('.app__icon').animate(
    //   [
    //     { opacity: '0', transform: 'translateZ(-1000px)' },
    //     { opacity: '1', transform: 'translateZ(0px)' },
    //   ],
    //   {
    //     duration: 2000,
    //     easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    //     fill: 'forwards',
    //   }
    // );
  }
}

const render = () => `
<app-home>
  <template shadowroot="open">
  <style>
  ${style}
  </style>
  ${template}
  </template>
</app-home>
`;

export { HomeComponent, render };
