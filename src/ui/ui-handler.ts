import { Socket } from 'socket.io-client';
import WindowUI from './ui-window';
import GameUI from './ui-game';

export default class UIHandler {
  constructor(socket: Socket) {
    this.socket = socket;
    this.windowUI = new WindowUI(this);
    this.gameUI = new GameUI(socket);

    this.windowUI.showHome();
  }

  windowUI: WindowUI;
  gameUI: GameUI;

  socket: Socket;
  username: string;

  canvasHTML = document.getElementById('canvas-game') as HTMLCanvasElement;

  play(username?: string) {
    if (username) this.username = username;

    this.socket.emit('join', {
      username: this.username,
      screenWidth: this.canvasHTML.width,
      screenHeight: this.canvasHTML.height,
    });

    this.windowUI.hide();
    this.gameUI.show();
  }

  die() {
    this.gameUI.levelUI.reset();
    this.gameUI.hide();
    this.windowUI.showRespawn();
  }
}
