// router
import { Router, routing } from './routing';

window['clientRouter'] = new Router('#root', routing);

export { Router, routing } from './routing';
// components

// views
export { Synth, HomeComponent } from './view/home';
