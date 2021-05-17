import { Socket } from 'socket.io-client';
import LeaderboardUI from './ui-leaderboard';
import LevelUI from './ui-level';

export default class GameUI {
  constructor(socket: Socket) {
    this.html = document.getElementById('game-ui') as HTMLDivElement;

    socket.on('kill', this.showMessage.bind(this));

    this.messageContainerHtml = document.querySelector(
      '.message-container'
    ) as HTMLDivElement;

    this.levelUI = new LevelUI(socket);
    this.leaderboardUI = new LeaderboardUI(socket);
  }

  leaderboardUI: LeaderboardUI;
  levelUI: LevelUI;
  html: HTMLDivElement;
  messageContainerHtml: HTMLDivElement;

  showMessage(message: string) {
    const messageHtml = document.createElement('div');
    messageHtml.innerHTML = message;
    messageHtml.classList.add('message');

    this.messageContainerHtml.appendChild(messageHtml);

    setTimeout(() => {
      messageHtml.style.height = '25px';
      setTimeout(() => {
        messageHtml.style.height = '0px';
        setTimeout(() => {
          this.messageContainerHtml.removeChild(messageHtml);
        }, 600);
      }, 2000);
    }, 100);
  }

  show() {
    this.html.style.display = 'block';
  }

  hide() {
    this.html.style.display = 'none';
    this.levelUI.reset();
  }
}
