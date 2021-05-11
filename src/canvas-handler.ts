import { Socket } from 'socket.io-client';
import { GAME_DIMENSION } from '../../server/src/constants';

export default class CanvasHandler {
  constructor(socket: Socket) {
    this.ctx = this.canvasHTML.getContext('2d') as CanvasRenderingContext2D;

    this.resize(socket);

    addEventListener('resize', () => {
      this.resize(socket);
    });
  }

  canvasHTML = document.getElementById('canvas-game') as HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  lastX = 0;
  lastY = 0;
  private backgroundCanvasHTML = document.getElementById(
    'canvas-background'
  ) as HTMLCanvasElement;

  render(x: number, y: number) {
    this.clear(x, y);

    this.ctx.save();

    this.center(
      -x + this.canvasHTML.width / 2,
      -y + this.canvasHTML.height / 2
    );
  }

  restore() {
    this.ctx.restore();
  }

  center(x: number, y: number) {
    this.ctx.translate(x, y);

    //Center background canvas
    if (this.lastX !== x || this.lastY !== y) {
      this.backgroundCanvasHTML.style.backgroundPositionX = `${x}px`;
      this.backgroundCanvasHTML.style.backgroundPositionY = `${y}px`;
    }

    this.lastX = x;
    this.lastY = y;
  }

  clear(x: number, y: number) {
    let rectX = 0;
    let rectY = 0;
    let rectW = this.canvasHTML.width;
    let rectH = this.canvasHTML.height;

    if (x + this.canvasHTML.width / 2 > GAME_DIMENSION) {
      rectX = 0;
      rectW = this.canvasHTML.width / 2 + (GAME_DIMENSION - x);
    } else if (x - this.canvasHTML.width / 2 < 0) {
      rectX = this.canvasHTML.width / 2 - x;
      rectW = x + this.canvasHTML.width / 2;
    }

    if (y + this.canvasHTML.height / 2 > GAME_DIMENSION) {
      rectY = 0;
      rectH = this.canvasHTML.height / 2 + (GAME_DIMENSION - y);
    } else if (y - this.canvasHTML.height / 2 < 0) {
      rectY = this.canvasHTML.height / 2 - y;
      rectH = y + this.canvasHTML.height / 2;
    }
    if (
      rectX > 0 ||
      rectY > 0 ||
      rectW < this.canvasHTML.width ||
      rectH < this.canvasHTML.height
    ) {
      this.ctx.fillStyle = '#750075';
      this.ctx.fillRect(0, 0, this.canvasHTML.width, this.canvasHTML.height);
    }

    this.ctx.clearRect(rectX, rectY, rectW, rectH);
  }

  resize(socket: Socket) {
    //Resize game canvas
    this.canvasHTML.width = innerWidth;
    this.canvasHTML.height = innerHeight;

    //Resize background canvas
    this.backgroundCanvasHTML.width = innerWidth;
    this.backgroundCanvasHTML.height = innerHeight;

    socket.emit('resize', socket.id, {
      screenWidth: this.canvasHTML.width,
      screenHeight: this.canvasHTML.height,
    });
  }
}
