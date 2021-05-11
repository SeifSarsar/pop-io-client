import { Blob, Globe, Splash, Wall } from './models';

export default class State {
  constructor() {}
  me: Globe;
  globes: Globe[] = [];
  bullets: Blob[] = [];
  energies: Blob[] = [];
  walls: Wall[] = [];
  splashes: Splash[] = [];
  setState(data: State) {
    this.me = data.me;
    this.globes = data.globes;
    this.bullets = data.bullets;
    this.energies = data.energies;
    this.walls = data.walls;
  }
}
