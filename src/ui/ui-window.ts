import { Key, WindowElement } from '../enum';
import WindowHome from './window-home';
import WindowRespawn from './window-respawn';
import UIHandler from './ui-handler';

export default class WindowUI {
  constructor(handler: UIHandler) {
    this.handler = handler;
    this.html = document.getElementById('window-ui') as HTMLDivElement;
    this.windowHome = new WindowHome(handler);
    this.windowRespawn = new WindowRespawn(handler);
  }
  windowHome: WindowHome;
  windowRespawn: WindowRespawn;

  html: HTMLDivElement;

  activeElement: WindowElement | null = null;

  handler: UIHandler;
  private keydownListener = this.keydown.bind(this);

  keydown(event: KeyboardEvent) {
    if (event.key === Key.Enter) {
      if (this.activeElement === WindowElement.Home) this.windowHome.play();
      else this.windowRespawn.play();
    }
  }
  showHome() {
    this.show();
    this.windowHome.show();
    this.activeElement = WindowElement.Home;
  }

  showRespawn(xp: number, kills: number, username?: string) {
    this.show();
    if (username)
      this.windowRespawn.show(`You just got popped by ${username}!`, xp, kills);
    else this.windowRespawn.show(`You just popped yourself...`, xp, kills);
    this.activeElement = WindowElement.Respawn;
  }

  show() {
    this.html.style.display = 'flex';

    setTimeout(() => {
      this.html.style.opacity = '1';
    }, 100);

    addEventListener('keydown', this.keydownListener);
  }

  hide() {
    this.html.style.opacity = '0';
    this.html.style.display = 'none';

    if (this.activeElement === WindowElement.Home) this.windowHome.hide();
    else this.windowRespawn.hide();

    this.activeElement = null;
    removeEventListener('keydown', this.keydownListener);
  }
}
