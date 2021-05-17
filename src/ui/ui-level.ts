import { Socket } from 'socket.io-client';
import { Skill } from '../enum';

export default class LevelUI {
  constructor(socket: Socket) {
    this.socket = socket;

    this.socket.on('level', this.update.bind(this));

    this.setListeners();
  }

  socket: Socket;

  private barHtml = document.querySelector('.level-bar') as HTMLElement;
  private barContentHtml = document.querySelector(
    '.level-bar-content'
  ) as HTMLElement;
  private levelPointsHTML = document.querySelector(
    '.level-points'
  ) as HTMLElement;

  private skillsHtml = document.querySelector('.skills') as HTMLElement;

  private skills: Map<Skill, number> = new Map([
    [Skill.Shield, 0],
    [Skill.Speed, 0],
    [Skill.Reload, 0],
    [Skill.Bullet, 0],
  ]);

  setListeners() {
    const buttonsHtml = document.getElementsByClassName('skill-button');

    for (let i = 0; i < buttonsHtml.length; i++) {
      const buttonHtml = buttonsHtml.item(i) as HTMLSpanElement;
      const skill = buttonHtml.classList.item(1) as Skill;

      buttonHtml.addEventListener('click', () => {
        const skillLevelsHtml = document.getElementsByClassName(
          `skill-level ${skill}`
        );

        const skillLevel = this.skills.get(skill) as number;

        skillLevelsHtml.item(skillLevel)?.classList.add('acquired');

        this.skills.set(skill, skillLevel + 1);

        if (this.skills.get(skill) === 5) buttonHtml.style.display = 'none';

        this.socket.emit('skill', this.socket.id, skill);
      });
    }
  }

  update(points: number, lvl?: number, barPercent?: number) {
    this.levelPointsHTML.innerHTML = points.toString();
    this.updateView(points);

    if (lvl) this.barHtml.setAttribute('data-label', `Lv. ${lvl}`);
    if (barPercent) this.barContentHtml.style.height = `${barPercent}%`;
  }

  updateView(points: number) {
    if (points > 0) {
      this.levelPointsHTML.style.display = 'flex';
      this.skillsHtml.style.opacity = '1';
      this.skillsHtml.style.pointerEvents = 'auto';
    } else {
      this.levelPointsHTML.style.display = 'none';
      this.skillsHtml.style.opacity = '0';
      this.skillsHtml.style.pointerEvents = 'none';
    }
  }

  reset() {
    this.levelPointsHTML.style.display = 'none';

    this.skillsHtml.style.opacity = '0';
    this.levelPointsHTML.innerHTML = '0';
    this.barContentHtml.style.height = `0%`;

    this.barHtml.setAttribute('data-label', `Lv. 1`);

    const skillLevelsHtml = document.getElementsByClassName('skill-level');

    for (let i = 0; i < skillLevelsHtml.length; i++) {
      skillLevelsHtml.item(i)?.classList.remove('acquired');
    }

    const buttonsHtml = document.getElementsByClassName('skill-button');

    for (let i = 0; i < buttonsHtml.length; i++) {
      const buttonHTML = buttonsHtml.item(i) as HTMLSpanElement;
      buttonHTML.style.display = 'flex';
    }

    this.skills = new Map([
      [Skill.Shield, 0],
      [Skill.Speed, 0],
      [Skill.Reload, 0],
      [Skill.Bullet, 0],
    ]);
  }
}
