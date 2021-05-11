import { Blob, Globe, Splash, Wall } from './models';

export default class State {
  constructor() {}
  me: Globe;
  globes: Globe[] = [];
  bullets: Blob[] = [];
  energies: Blob[] = [];
  walls: Wall[] = [];
  splashes: Splash[] = [];
}
