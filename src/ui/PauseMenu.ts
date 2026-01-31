import Phaser from 'phaser';

interface ButtonColors {
  background: number;
  highlight: number;
  shadow: number;
  text: string;
  alpha: number;
}

export class PauseMenu extends Phaser.GameObjects.Container {
  private onContinue: () => void;
  private onExit: () => void;
  private onSettings: () => void;

  constructor(scene: Phaser.Scene, onContinue: () => void, onExit: () => void, onSettings: () => void) {
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;
    super(scene, centerX, centerY);

    this.onContinue = onContinue;
    this.onExit = onExit;
    this.onSettings = onSettings;

    const { width, height } = scene.cameras.main;

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(-centerX, -centerY, width, height);
    this.add(overlay);

    const title = scene.add.text(0, -120, 'PAUSED', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);
    this.add(title);

    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonSpacing = 60;

    this.createButton(scene, 0, -30, buttonWidth, buttonHeight, 'Continue', false, this.onContinue);
    this.createButton(scene, 0, -30 + buttonSpacing, buttonWidth, buttonHeight, 'Settings', false, this.onSettings);
    this.createButton(scene, 0, -30 + buttonSpacing * 2, buttonWidth, buttonHeight, 'Exit', false, this.onExit);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(1000);
    this.setVisible(false);
  }

  private getButtonColors(disabled: boolean): ButtonColors {
    if (disabled) {
      return {
        background: 0x888888,
        highlight: 0x999999,
        shadow: 0x666666,
        text: '#666666',
        alpha: 0.5,
      };
    }
    return {
      background: 0x555555,
      highlight: 0x777777,
      shadow: 0x333333,
      text: '#ffffff',
      alpha: 1,
    };
  }

  private drawBeveledButton(
    graphics: Phaser.GameObjects.Graphics,
    width: number,
    height: number,
    bg: number,
    hi: number,
    sh: number,
    alpha: number
  ): void {
    const bevelSize = 3;
    graphics.clear();
    graphics.setAlpha(alpha);

    graphics.fillStyle(bg);
    graphics.fillRect(-width / 2, -height / 2, width, height);

    graphics.fillStyle(hi);
    graphics.fillRect(-width / 2, -height / 2, width, bevelSize);
    graphics.fillRect(-width / 2, -height / 2, bevelSize, height);

    graphics.fillStyle(sh);
    graphics.fillRect(-width / 2, height / 2 - bevelSize, width, bevelSize);
    graphics.fillRect(width / 2 - bevelSize, -height / 2, bevelSize, height);

    graphics.fillStyle(bg);
    graphics.fillRect(
      -width / 2 + bevelSize,
      -height / 2 + bevelSize,
      width - bevelSize * 2,
      height - bevelSize * 2
    );
  }

  private createButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    disabled: boolean,
    onClick?: () => void
  ): Phaser.GameObjects.Container {
    const colors = this.getButtonColors(disabled);
    const hoverColors = { background: 0x666666, highlight: 0x888888, shadow: 0x444444 };

    const graphics = scene.add.graphics();
    this.drawBeveledButton(graphics, width, height, colors.background, colors.highlight, colors.shadow, colors.alpha);

    const buttonText = scene.add.text(0, 0, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: colors.text,
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);

    if (disabled) {
      buttonText.setAlpha(0.7);
    }

    const container = scene.add.container(x, y, [graphics, buttonText]);

    if (!disabled && onClick) {
      const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
      container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      container.input!.cursor = 'pointer';

      container.on('pointerover', () => {
        this.drawBeveledButton(graphics, width, height, hoverColors.background, hoverColors.highlight, hoverColors.shadow, 1);
      });

      container.on('pointerout', () => {
        this.drawBeveledButton(graphics, width, height, colors.background, colors.highlight, colors.shadow, colors.alpha);
      });

      container.on('pointerdown', onClick);
    }

    this.add(container);
    return container;
  }

  show(): void {
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  isVisible(): boolean {
    return this.visible;
  }
}
