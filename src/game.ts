import Controller from './controller';
import { io, Socket } from 'socket.io-client';
import State from './state';
import CanvasHandler from './canvas-handler';
import Renderer from './renderer';
import UIHandler from './ui-handler';

export default class Game {
  constructor() {
    const serverURL = 'https://pop-io-server.herokuapp.com/'; //http://localhost:3000
    this.socket = io(serverURL);
    this.socket.connect();
    this.canvas = new CanvasHandler(this.socket);
    this.ui = new UIHandler(this.canvas, this.socket);
    this.renderer = new Renderer(this.canvas);

    //Set state for homepage canvas
    this.setInitialState();
    this.addSocketListeners();

    this.gameLoop();

    this.controller = new Controller(this.canvas, this.socket);

    window.onbeforeunload = () => {
      this.socket.emit('leave');
      this.socket.disconnect();
    };
  }

  private socket: Socket;
  private ui: UIHandler;
  private canvas: CanvasHandler;
  private renderer: Renderer;
  private controller: Controller;
  private state: State = new State();
  private addSocketListeners() {
    this.socket.on('start', this.start.bind(this));
    this.socket.on('update', this.updateState.bind(this));
    this.socket.on('xp', this.ui.updateLevelManager.bind(this.ui));
    this.socket.on('usePoint', this.ui.updateLevelManagerPoints.bind(this.ui));
    this.socket.on('kill', this.ui.notifyKill.bind(this.ui));
    this.socket.on('leaderboard', this.ui.updateLeaderboard.bind(this.ui));
    this.socket.on('die', this.die.bind(this));
  }

  private start(data: State) {
    this.state = data;
    this.controller.enable();
  }

  private gameLoop(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
    this.render();
  }

  private updateState(data: State) {
    this.state = data;
  }

  private render() {
    if (this.state.me)
      this.canvas.render(this.state.me.position.x, this.state.me.position.y);

    this.renderer.render(this.state);

    this.canvas.restore();
  }

  private die() {
    this.controller.disable();
    this.ui.die();
  }

  private setInitialState() {}
}
