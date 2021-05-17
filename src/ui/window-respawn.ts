import UIHandler from './ui-handler';

export default class WindowRespawn {
  constructor(handler: UIHandler) {
    this.handler = handler;

    this.html = document.getElementById('window-respawn') as HTMLDivElement;
    this.buttonHtml = this.html.querySelector('.play-button') as HTMLDivElement;
    this.buttonHtml.addEventListener('click', this.play.bind(this));
  }

  handler: UIHandler;

  html: HTMLDivElement;
  buttonHtml: HTMLDivElement;

  show() {
    this.html.style.display = 'flex';
  }

  hide() {
    this.html.style.display = 'none';
  }

  play() {
    this.handler.play();
  }
}
