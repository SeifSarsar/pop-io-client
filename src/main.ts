import Game from './game';
class Main {
  constructor() {}
  public setup(): void {
    new Game();
  }
}

window.onload = () => {
  let main = new Main();
  main.setup();
  document.addEventListener('contextmenu', (event) => event.preventDefault());
};
