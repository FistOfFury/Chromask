import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number }): void {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '36px',
      color: '#666666',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, `${data.score ?? 0}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '64px',
      color: '#666666',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.7, 'Press SPACE', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#666666',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
