import Controller from './controller';
import { io, Socket } from 'socket.io-client';
import State from './state';
import CanvasHandler from './canvas-handler';
import Renderer from './renderer';
import UIHandler from './ui/ui-handler';

export default class Game {
  constructor() {
    const serverURL = 'https://pop-io-server.herokuapp.com/';
    //const serverURL = 'http://localhost:3000';
    this.socket = io(serverURL);
    this.socket.connect();
    this.canvas = new CanvasHandler(this.socket);
    this.ui = new UIHandler(this.socket);
    this.renderer = new Renderer(this.canvas);

    this.addSocketListeners();

    this.controller = new Controller(this.canvas, this.socket);

    window.onbeforeunload = () => {
      this.socket.emit('leave', this.roomId);
      this.socket.disconnect();
    };
  }

  private socket: Socket;
  private ui: UIHandler;
  private canvas: CanvasHandler;
  private renderer: Renderer;
  private controller: Controller;
  private state: State = new State();
  private roomId: string;
  private addSocketListeners() {
    this.socket.on('start', this.start.bind(this));
    this.socket.on('update', this.updateState.bind(this));
    this.socket.on('die', this.die.bind(this));
  }

  private start(roomId: string, data: State) {
    this.roomId = roomId;
    this.state = data;
    this.gameLoop();
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

  private die(xp: number, kills: number, username?: string) {
    this.controller.disable();
    this.ui.die(xp, kills, username);
  }
}
