import UIHandler from './ui-handler';

export default class WindowRespawn {
  constructor(handler: UIHandler) {
    this.handler = handler;

    this.html = document.getElementById('window-respawn') as HTMLDivElement;
    this.buttonHtml = this.html.querySelector('.play-button') as HTMLDivElement;
    this.headerHtml = this.html.querySelector(
      '.window-respawn-header'
    ) as HTMLDivElement;
    this.valuesHtml = this.html.getElementsByClassName(
      'window-respawn-value'
    ) as HTMLCollectionOf<Element>;

    this.buttonHtml.addEventListener('click', this.play.bind(this));
  }

  handler: UIHandler;

  html: HTMLDivElement;
  buttonHtml: HTMLDivElement;
  headerHtml: HTMLDivElement;
  valuesHtml: HTMLCollectionOf<Element>;

  show(message: string, xp: number, kills: number) {
    this.html.style.display = 'flex';
    this.headerHtml.textContent = message;
    this.valuesHtml.item(0)!.textContent = xp.toString();
    this.valuesHtml.item(1)!.textContent = kills.toString();
  }

  hide() {
    this.html.style.display = 'none';
  }

  play() {
    this.handler.play();
  }
}
