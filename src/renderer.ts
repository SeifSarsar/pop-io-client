import CanvasHandler from './canvas-handler';
import { SHIELD_OFFSET } from './constants';
import { Blob, Edge, Globe, Splash, Wall } from './models';
import State from './state';

export default class Renderer {
  constructor(canvas: CanvasHandler) {
    this.canvas = canvas;
  }

  canvas: CanvasHandler;

  render(state: State) {
    this.renderEnergies(state.energies);

    this.renderBullets(state.bullets);

    this.renderWalls(state.walls);

    this.renderGlobes(state.me ? [state.me, ...state.globes] : state.globes);

    this.renderSplashes(state.splashes);
  }

  renderEnergies(energies: Blob[]) {
    energies.forEach((energy) => {
      this.canvas.ctx.beginPath();
      this.canvas.ctx.fillStyle = energy.color;
      this.canvas.ctx.arc(
        energy.position.x,
        energy.position.y,
        energy.size,
        0,
        2 * Math.PI
      );
      this.canvas.ctx.fill();
    });
  }

  renderBullets(bullets: Blob[]) {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.fillStyle = 'white';
    bullets.forEach((bullet) => {
      this.canvas.ctx.arc(
        bullet.position.x,
        bullet.position.y,
        bullet.size,
        0,
        2 * Math.PI
      );
      this.canvas.ctx.closePath();
    });
    this.canvas.ctx.fill();
  }

  renderWalls(walls: Wall[]) {
    this.canvas.ctx.beginPath();
    this.canvas.ctx.lineJoin = 'round';
    this.canvas.ctx.strokeStyle = '#c700c7';
    this.canvas.ctx.fillStyle = '#750075';
    this.canvas.ctx.lineWidth = 5;

    walls.forEach((wall) => {
      const firstPoint = wall.edges[0].p1;
      this.canvas.ctx.moveTo(firstPoint.x, firstPoint.y);
      if (wall.edges.length === 1) {
        const secondPoint = wall.edges[0].p2;
        this.canvas.ctx.lineTo(secondPoint.x, secondPoint.y);
      } else {
        wall.edges.forEach((edge, i) => {
          if (i < wall.edges.length - 1)
            this.canvas.ctx.lineTo(edge.p2.x, edge.p2.y);
        });
      }
      this.canvas.ctx.closePath();
    });
    this.canvas.ctx.fill();
    this.canvas.ctx.stroke();
  }

  renderGlobes(globes: Globe[]) {
    this.canvas.ctx.lineCap = 'round';
    this.canvas.ctx.textAlign = 'center';
    this.canvas.ctx.textBaseline = 'middle';
    this.canvas.ctx.font = '12px Segoe UI';
    globes.forEach((globe) => {
      this.renderGlobe(globe);
    });
  }

  renderGlobe(globe: Globe) {
    if (globe.size === 0) return;

    //Render heart
    this.canvas.ctx.strokeStyle = globe.borderColor;
    this.canvas.ctx.fillStyle = globe.color;

    this.canvas.ctx.beginPath();

    this.canvas.ctx.arc(
      globe.position.x,
      globe.position.y,
      globe.size,
      0,
      2 * Math.PI
    );
    this.canvas.ctx.lineWidth = 5;

    this.canvas.ctx.fill();
    this.canvas.ctx.stroke();

    //Render shield
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(
      globe.position.x,
      globe.position.y,
      globe.size + globe.shieldOffset,
      globe.shieldStart,
      globe.shieldEnd
    );

    this.canvas.ctx.stroke();

    //Render name
    if (globe.username === 'UFO') return;

    this.canvas.ctx.fillStyle = globe.borderColor;
    this.canvas.ctx.fillText(
      globe.username,
      globe.position.x,
      globe.position.y + globe.size + 2 * SHIELD_OFFSET
    );
  }

  renderSplashes(splashes: Splash[]) {
    this.canvas.ctx.lineWidth = 2;
    splashes.forEach((splash) => {
      this.canvas.ctx.beginPath();
      this.canvas.ctx.strokeStyle = splash.color;
      splash.lines.forEach((line: Edge) => {
        this.canvas.ctx.moveTo(line.p1.x, line.p1.y);
        this.canvas.ctx.lineTo(line.p2.x, line.p2.y);
      });
      this.canvas.ctx.stroke();
    });
  }
}
