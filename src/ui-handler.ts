import { Socket } from 'socket.io-client';
import CanvasHandler from './canvas-handler';
import { Key } from './enum';
import LevelManager from './level-manager';

export default class UIHandler {
  constructor(canvas: CanvasHandler, socket: Socket) {
    this.canvas = canvas;
    this.socket = socket;
    this.levelManager = new LevelManager(socket);

    this.playButton.addEventListener('click', this.play.bind(this));

    this.displayGameForm();
  }

  private keydownListener = this.keydown.bind(this);

  private socket: Socket;
  private levelManager: LevelManager;
  private canvas: CanvasHandler;
  private gameForm = document.getElementById('game-form') as HTMLElement;

  private usernameInput = document.getElementById(
    'username-input'
  ) as HTMLInputElement;

  private playButton = document.getElementById('play-button') as HTMLElement;

  private leaderboard = document.querySelector('.leaderboard') as HTMLElement;

  private leaderboardContent = document.querySelector(
    '.leaderboard-content'
  ) as HTMLElement;

  private killNotifier = document.querySelector(
    '.kill-notifier'
  ) as HTMLElement;

  die() {
    this.displayGameForm();
    this.levelManager.reset();
  }
  keydown(event: KeyboardEvent) {
    if (event.key === Key.Enter) this.play();
  }

  updateLevelManagerPoints(points: number) {
    this.levelManager.update(points);
  }

  updateLevelManager(data: any) {
    this.levelManager.update(data.points, data.lvl, data.barPercent);
  }

  updateLeaderboard(data: any[]) {
    this.leaderboardContent.innerHTML = '';
    data.forEach((item) => {
      const row = document.createElement('div');

      if (item.id === this.socket.id)
        row.classList.add('leaderboard-row', 'user');
      else row.classList.add('leaderboard-row');

      const rank = document.createElement('div');
      rank.textContent = item.rank;
      const name = document.createElement('div');
      name.textContent = item.username;
      const points = document.createElement('div');
      points.textContent = item.xp;
      const kills = document.createElement('div');
      kills.textContent = item.kills;

      row.append(rank, name, points, kills);
      this.leaderboardContent.appendChild(row);
    });
  }

  notifyKill(username?: string) {
    const message = username
      ? `You have popped ${username}!`
      : `You have popped yourself!`;

    const messageHTML = document.createElement('div');
    messageHTML.innerHTML = message;
    messageHTML.classList.add('kill-message');

    this.killNotifier.appendChild(messageHTML);

    setTimeout(() => {
      messageHTML.classList.add('visible');
      setTimeout(() => {
        messageHTML.classList.remove('visible');
        setTimeout(() => {
          this.killNotifier.removeChild(messageHTML);
        }, 600);
      }, 2000);
    }, 100);
  }

  displayGameForm() {
    this.gameForm.style.display = 'flex';

    setTimeout(() => {
      this.gameForm.classList.add('visible');
    }, 100);
    this.leaderboard.classList.remove('visible');
    this.levelManager.hide();

    addEventListener('keydown', this.keydownListener);
  }

  displayGame() {
    this.gameForm.style.display = 'none';
    this.gameForm.classList.remove('visible');
    this.leaderboard.classList.add('visible');
    this.levelManager.show();
    removeEventListener('keydown', this.keydownListener);
  }

  play() {
    const username =
      this.usernameInput.value.length > 0 ? this.usernameInput.value : 'UFO';

    this.socket.emit('leave');
    this.socket.emit('join', {
      username,
      screenWidth: this.canvas.canvasHTML.width,
      screenHeight: this.canvas.canvasHTML.height,
    });
    this.displayGame();
  }
}
