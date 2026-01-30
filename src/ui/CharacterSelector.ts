import Phaser from 'phaser';

export class CharacterSelector extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private preview: Phaser.GameObjects.Sprite;
  private nameText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Background
    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.5);
    this.background.fillRoundedRect(0, 0, 100, 60, 8);

    // Character preview sprite (will be updated)
    this.preview = scene.add.sprite(50, 20, 'player-sprite');
    this.preview.setScale(0.75);

    // Character name text
    this.nameText = scene.add.text(50, 45, 'Runner', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#EEEEEE',
      resolution: window.devicePixelRatio,
    });
    this.nameText.setOrigin(0.5, 0);

    this.add([this.background, this.preview, this.nameText]);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
  }

  update(characterName: string, textureKey: string): void {
    this.preview.setTexture(textureKey);
    this.nameText.setText(characterName);
  }

  hide(): void {
    this.setVisible(false);
  }
}
