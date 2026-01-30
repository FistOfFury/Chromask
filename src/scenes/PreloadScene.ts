import Phaser from 'phaser';
import { GameColor, COLOR_HEX, PLATFORM, PLAYER } from '../constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create(): void {
    this.createTextures();
    this.scene.start('GameScene');
  }

  private createTextures(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    this.createPlatformTextures(graphics);
    this.createPlayerTexture(graphics);

    graphics.destroy();
  }

  private createPlatformTextures(graphics: Phaser.GameObjects.Graphics): void {
    const colors = Object.values(GameColor).filter(
      (c): c is GameColor => typeof c === 'number' && c !== GameColor.NONE
    );

    for (const color of colors) {
      graphics.clear();
      graphics.fillStyle(COLOR_HEX[color], 1);
      graphics.fillRoundedRect(0, 0, PLATFORM.WIDTH, PLATFORM.HEIGHT, 4);
      graphics.generateTexture(`platform_${color}`, PLATFORM.WIDTH, PLATFORM.HEIGHT);
    }
  }

  private createPlayerTexture(graphics: Phaser.GameObjects.Graphics): void {
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, PLAYER.WIDTH, PLAYER.HEIGHT);
    graphics.generateTexture('player', PLAYER.WIDTH, PLAYER.HEIGHT);
  }
}
