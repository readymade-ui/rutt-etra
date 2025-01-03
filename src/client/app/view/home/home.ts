import { Component, CustomElement } from '@readymade/core';
import { RdSurface } from '@readymade/ui';
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
  channelName = 'synth';
  channel: BroadcastChannel = new BroadcastChannel(this.channelName);
  constructor() {
    super();
  }
  public connectedCallback() {
    const canvasContainer = this.shadowRoot.querySelector('#canvas');
    const videoElement = this.shadowRoot.querySelector(
      '#video',
    ) as HTMLVideoElement;

    const surface = this.shadowRoot?.querySelectorAll(
      'rd-surface',
    )[0] as RdSurface;
    const controlSurface = {
      style: {
        display: 'grid',
        gridTemplateRows: 'repeat(12, 12% [col-start])',
        columnGap: '12px',
        rowGap: '14px',
        paddingTop: '44px',
        paddingLeft: '20px',
        width: '100%',
        overflowX: 'hidden',
      },
      controls: [
        {
          label: 'Source',
          selector: 'rd-dropdown',
          channel: this.channelName,
          style: {
            width: '200px',
          },
          control: {
            name: 'video',
            currentValue: 'wavves.mp4',
            attributes: {
              options: ['wavves.mp4', 'palms.mp4', 'garage-on-fire.mp4'],
            },
          },
        },
        {
          label: 'Mode',
          selector: 'rd-dropdown',
          channel: this.channelName,
          style: {
            width: '200px',
          },
          control: {
            name: 'mode',
            currentValue: 'Scanline',
            attributes: {
              options: ['Scanline', 'Vector'],
            },
          },
        },
        {
          label: 'Displacement',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'displacement',
            currentValue: 10.0,
            attributes: {
              orient: 'is--hor',
              min: -100.0,
              max: 100.0,
            },
          },
        },
        {
          label: 'Multiplier',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'multiplier',
            currentValue: 100.0,
            attributes: {
              orient: 'is--hor',
              min: -200.0,
              max: 200.0,
            },
          },
        },
        {
          label: 'Origin (XY)',
          selector: 'rd-slider',
          channel: this.channelName,
          style: {
            gridRow: 'span 2',
            alignSelf: 'start',
          },
          control: {
            type: 'joystick',
            name: 'origin-xy',
            currentValue: [0, 0],
            attributes: {
              orient: 'is--joystick',
              min: [-2000.0, -2000.0],
              max: [2000.0, 2000.0],
            },
          },
        },
        {
          label: 'Origin (Z)',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'origin-z',
            currentValue: 2000.0,
            attributes: {
              orient: 'is--hor',
              min: -2000.0,
              max: 2000.0,
            },
          },
        },
        {
          label: 'Opacity',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'opacity',
            currentValue: 0.25,
            attributes: {
              orient: 'is--hor',
              min: 0.0,
              max: 1.0,
            },
          },
        },
        {
          label: 'Line Offset',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'line-offset',
            currentValue: 48.0,
            attributes: {
              orient: 'is--hor',
              min: 0.0,
              max: 128.0,
            },
          },
        },
        {
          label: 'Line Width',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'line-width',
            currentValue: 12.0,
            attributes: {
              orient: 'is--hor',
              min: 0.0,
              max: 128.0,
            },
          },
        },
        {
          label: 'Line Orientation',
          selector: 'rd-dropdown',
          channel: this.channelName,
          style: {
            width: '200px',
            gridRow: 'span 2',
          },
          control: {
            name: 'orientation',
            currentValue: 'Vertical',
            attributes: {
              options: ['Horizontal', 'Vertical'],
            },
          },
        },
      ],
    };

    const initialControlSurface = JSON.parse(JSON.stringify(controlSurface));

    setTimeout(() => {
      surface.setControlSurface(controlSurface);
      this.synth = new Synth(
        canvasContainer,
        videoElement,
        initialControlSurface,
      );
      console.log(this.synth);
    });

    this.channel.onmessage = this.onMessage.bind(this);
  }
  onMessage(event: MessageEvent) {
    if (event.data.name === 'video') {
      const videoElement = this.shadowRoot.querySelector(
        '#video',
      ) as HTMLVideoElement;
      videoElement.pause();
      this.synth.pause();
      videoElement.src = `${import.meta.env.BASE_URL}video/${event.data.currentValue}`;
      videoElement.play();
      this.synth.play();
    }
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

export {
  RdSlider,
  RdRadioGroup,
  RdDial,
  RdButtonPad,
  RdButton,
  RdDropdown,
  RdCheckBox,
  RdSwitch,
  RdInput,
  RdTextArea,
  RdSurface,
} from '@readymade/ui';

export { Synth, HomeComponent, render };
