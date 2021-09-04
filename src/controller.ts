import { Direction, Key } from './enum';
import CanvasHandler from './canvas-handler';
import { Socket } from 'socket.io-client';

export default class Controller {
  constructor(canvas: CanvasHandler, socket: Socket) {
    this.canvas = canvas;
    this.socket = socket;
  }

  private canvas: CanvasHandler;
  private socket: Socket;
  private directions = new Set<Direction>();

  private keydownListener = this.keydown.bind(this);
  private keyupListener = this.keyup.bind(this);

  private mousemoveListener = this.mousemove.bind(this);
  private mousedownListener = this.mousedown.bind(this);
  private mouseupListener = this.mouseup.bind(this);

  enable() {
    addEventListener('keydown', this.keydownListener);
    addEventListener('keyup', this.keyupListener);

    this.canvas.canvasHTML.addEventListener(
      'mousemove',
      this.mousemoveListener
    );

    this.canvas.canvasHTML.addEventListener(
      'mousedown',
      this.mousedownListener
    );
    this.canvas.canvasHTML.addEventListener('mouseup', this.mouseupListener);
  }

  disable() {
    removeEventListener('keydown', this.keydownListener);
    removeEventListener('keyup', this.keyupListener);

    this.canvas.canvasHTML.removeEventListener(
      'mousemove',
      this.mousemoveListener
    );

    this.canvas.canvasHTML.removeEventListener(
      'mousedown',
      this.mousedownListener
    );
    this.canvas.canvasHTML.removeEventListener('mouseup', this.mouseupListener);
  }

  keydown(event: KeyboardEvent) {
    let direction: Direction | null = null;
    switch (event.code) {
      case Key.Up:
      case Key.W:
        direction = Direction.Up;
        break;
      case Key.Right:
      case Key.D:
        direction = Direction.Right;
        break;
      case Key.Down:
      case Key.S:
        direction = Direction.Down;
        break;
      case Key.Left:
      case Key.A:
        direction = Direction.Left;
        break;
    }

    if (direction && !this.directions.has(direction)) {
      this.socket.emit('keydown', this.socket.id, direction);
      this.directions.add(direction);
    }
  }

  keyup(event: KeyboardEvent) {
    let direction: Direction | null = null;
    switch (event.code) {
      case Key.Up:
      case Key.W:
        direction = Direction.Up;
        break;
      case Key.Right:
      case Key.D:
        direction = Direction.Right;
        break;
      case Key.Down:
      case Key.S:
        direction = Direction.Down;
        break;
      case Key.Left:
      case Key.A:
        direction = Direction.Left;
        break;
    }

    if (direction) {
      this.socket.emit('keyup', this.socket.id, direction);
      this.directions.delete(direction);
    }
  }

  mousemove(event: MouseEvent) {
    const dX = event.offsetX - this.canvas.canvasHTML.width / 2;
    const dY = event.offsetY - this.canvas.canvasHTML.height / 2;

    this.socket.emit('mousemove', this.socket.id, { dX, dY });
  }

  mousedown() {
    this.socket.emit('mousedown', this.socket.id);
  }
  mouseup() {
    this.socket.emit('mouseup', this.socket.id);
  }
}
