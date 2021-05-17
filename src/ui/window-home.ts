import UIHandler from './ui-handler';

export default class WindowHome {
  constructor(handler: UIHandler) {
    this.handler = handler;
    this.html = document.getElementById('window-home') as HTMLDivElement;
    this.buttonHtml = this.html.querySelector('.play-button') as HTMLDivElement;
    this.buttonHtml.addEventListener('click', this.play.bind(this));
    this.inputHtml = document.getElementById(
      'username-input'
    ) as HTMLInputElement;
  }

  handler: UIHandler;

  html: HTMLDivElement;
  buttonHtml: HTMLDivElement;
  inputHtml: HTMLInputElement;

  show() {
    this.html.style.display = 'flex';
  }

  hide() {
    this.html.style.display = 'none';
  }

  play() {
    const username =
      this.inputHtml.value.length > 0 ? this.inputHtml.value : 'UFO';

    this.handler.play(username);
  }
}
