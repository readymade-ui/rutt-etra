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
    const canvasContainer = this.shadowRoot.querySelector('#canvas');
    const videoElement = this.shadowRoot.querySelector(
      '#video',
    ) as HTMLVideoElement;
    const synth = new Synth(canvasContainer, videoElement);
    console.log(synth);
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
