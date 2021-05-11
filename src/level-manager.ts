import { Socket } from 'socket.io-client';
import { Skill } from './enum';
export default class LevelManager {
  constructor(socket: Socket) {
    this.setSkillsListeners(socket);
  }

  private containerHTML = document.querySelector(
    '.level-container'
  ) as HTMLElement;
  private skillsHTML = document.querySelector('.skills') as HTMLElement;
  private levelBarHTML = document.querySelector('.level-bar') as HTMLElement;
  private levelBarContentHTML = document.querySelector(
    '.level-bar-content'
  ) as HTMLElement;
  private levelPointsHTML = document.querySelector(
    '.level-points'
  ) as HTMLElement;

  private skills: Map<Skill, number> = new Map([
    [Skill.Shield, 0],
    [Skill.Speed, 0],
    [Skill.Reload, 0],
    [Skill.Bullet, 0],
  ]);

  setSkillsListeners(socket: Socket) {
    const buttonsHTML = document.getElementsByClassName('skill-button');

    for (let i = 0; i < buttonsHTML.length; i++) {
      const buttonHTML = buttonsHTML.item(i) as HTMLElement;
      const skill = buttonHTML.classList.item(1) as Skill;

      buttonHTML.addEventListener('click', () => {
        const skillLevels = document.getElementsByClassName(
          `skill-level ${skill}`
        );

        const skillLevel = this.skills.get(skill) as number;

        skillLevels.item(skillLevel)?.classList.add('acquired');

        this.skills.set(skill, skillLevel + 1);
        if (this.skills.get(skill) === 5) buttonHTML.style.display = 'none';

        socket.emit('skill', socket.id, skill);
      });
    }
  }

  updatePoints(points: number) {
    this.levelPointsHTML.innerHTML = points.toString();
    this.setView(points);
  }

  update(points: number, lvl?: number, barPercent?: number) {
    this.levelPointsHTML.innerHTML = points.toString();
    this.setView(points);

    if (lvl) this.levelBarHTML.setAttribute('data-label', `Lv. ${lvl}`);
    if (barPercent) this.levelBarContentHTML.style.height = `${barPercent}%`;
  }

  reset() {
    this.levelPointsHTML.innerHTML = '0';
    this.levelBarContentHTML.style.height = `0%`;
    this.levelBarHTML.setAttribute('data-label', `Lv. 1`);

    const skillLevels = document.getElementsByClassName('skill-level');

    for (let i = 0; i < skillLevels.length; i++) {
      skillLevels.item(i)?.classList.remove('acquired');
    }

    const buttonsHTML = document.getElementsByClassName('skill-button');

    for (let i = 0; i < buttonsHTML.length; i++) {
      const buttonHTML = buttonsHTML.item(i) as HTMLElement;

      buttonHTML.style.display = 'flex';
    }
    this.skills = new Map([
      [Skill.Shield, 0],
      [Skill.Speed, 0],
      [Skill.Reload, 0],
      [Skill.Bullet, 0],
    ]);
  }
  setView(points: number) {
    if (points > 0) {
      this.levelPointsHTML.classList.add('visible');
      this.skillsHTML.classList.add('visible');
    } else {
      this.levelPointsHTML.classList.remove('visible');
      this.skillsHTML.classList.remove('visible');
    }
  }

  show() {
    this.containerHTML.classList.add('visible');
  }

  hide() {
    this.containerHTML.classList.remove('visible');
    this.skillsHTML.classList.remove('visible');
    this.levelPointsHTML.classList.remove('visible');
  }
}
