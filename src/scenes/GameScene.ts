import Phaser from 'phaser';
import { GAME } from '../constants';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = { width: GAME.WIDTH, height: GAME.HEIGHT };
    
    this.add.text(width / 2, height / 2, 'Chromask', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 60, 'Game Scene - Setup Complete', {
      fontSize: '20px',
      color: '#888888',
    }).setOrigin(0.5);
  }
}
