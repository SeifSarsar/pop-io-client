import { Socket } from 'socket.io-client';
import { LEADERBOARD_SIZE } from '../constants';

export default class LeaderboardUI {
  constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('leaderboard', this.update.bind(this));
  }

  socket: Socket;
  html = document.querySelector('.leaderboard') as HTMLDivElement;
  contentHtml = document.querySelector(
    '.leaderboard-content'
  ) as HTMLDivElement;
  rowsHtml = this.contentHtml.getElementsByClassName(
    'leaderboard-row'
  ) as HTMLCollectionOf<HTMLDivElement>;

  update(data: any[]) {
    const lastRow = this.rowsHtml.item(this.rowsHtml.length - 1);
    if (data.length > LEADERBOARD_SIZE) lastRow!.style.display = 'flex';
    else lastRow!.style.display = 'none';

    data.forEach((item, index) => {
      const row = this.rowsHtml.item(index) as HTMLDivElement;

      if (item.id === this.socket.id) row.classList.add('user');
      else row.classList.remove('user');

      const rowElements = row.getElementsByTagName(
        'div'
      ) as HTMLCollectionOf<HTMLDivElement>;

      rowElements.item(0)!.textContent = item.rank;
      rowElements.item(1)!.textContent = item.username;
      rowElements.item(2)!.textContent = item.xp;
      rowElements.item(3)!.textContent = item.kills;
    });
  }
}
