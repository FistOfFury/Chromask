import Phaser from 'phaser';

export class ComboIndicator extends Phaser.GameObjects.Container {
  private comboText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.comboText = scene.add.text(0, 0, '', {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '20px',
      color: '#FF6600',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio * 2,
    });

    this.add(this.comboText);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
    this.setVisible(false);
  }

  update(comboCount: number): void {
    if (comboCount >= 3) {
      this.comboText.setText(`COMBO x${comboCount}`);
      this.setVisible(true);
    } else {
      this.setVisible(false);
    }
  }
}
