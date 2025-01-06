import { Component, CustomElement } from '@readymade/core';
import { RdControlSurface, RdSurface } from '@readymade/ui';
import { Synth } from './../../../../modules/rutt-etra/src';
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
    const controlSurface: RdControlSurface = {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingTop: '24px',
        paddingRight: '24px',
        paddingBottom: '64px',
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
          displayValue: true,
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
          displayValue: true,
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
          displayValue: true,
        },
        {
          label: 'Line Offset',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'line-offset',
            currentValue: 38.857142857142854,
            attributes: {
              orient: 'is--hor',
              min: 0.0,
              max: 128.0,
            },
          },
          displayValue: true,
        },
        {
          label: 'Line Width',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'line-width',
            currentValue: 7.619047619047619,
            attributes: {
              orient: 'is--hor',
              min: 0.0,
              max: 128.0,
            },
          },
          displayValue: true,
        },
        {
          label: 'Line Orientation',
          selector: 'rd-dropdown',
          channel: this.channelName,
          style: {
            width: '200px',
          },
          control: {
            name: 'orientation',
            currentValue: 'Vertical',
            attributes: {
              options: ['Horizontal', 'Vertical'],
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
          displayValue: true,
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
          displayValue: true,
        },
        {
          label: 'Camera (XY)',
          selector: 'rd-slider',
          channel: this.channelName,
          style: {
            gridRow: 'span 2',
            alignSelf: 'start',
          },
          control: {
            type: 'joystick',
            name: 'camera-xy',
            currentValue: [0.0, -1130.0],
            attributes: {
              orient: 'is--joystick',
              min: [-5000.0, -5000.0],
              max: [5000.0, 5000.0],
            },
          },
          displayValue: true,
        },
        {
          label: 'Camera (Z)',
          selector: 'rd-slider',
          channel: this.channelName,
          control: {
            type: 'hor',
            name: 'camera-z',
            currentValue: 4680.0,
            attributes: {
              orient: 'is--hor',
              min: -5000.0,
              max: 5000.0,
            },
          },
          displayValue: true,
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
    window.onkeydown = this.onKeyDown.bind(this);
  }
  onMessage(event: MessageEvent) {
    if (event.data.name === 'video') {
      const videoElement = this.shadowRoot.querySelector(
        '#video',
      ) as HTMLVideoElement;
      videoElement.pause();
      this.synth.pause();
      videoElement.src = `video/${event.data.currentValue}`;
      videoElement.play();
      this.synth.play();
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'c') {
      const controls = this.shadowRoot.querySelector('.controls');
      controls.classList.toggle('hidden');
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
