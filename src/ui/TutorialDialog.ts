import Phaser from 'phaser';
import { HELP_DIALOG, GameColor, COLOR_HEX, STORAGE } from '../constants';

export class TutorialDialog extends Phaser.GameObjects.Container {
  private onDismiss: () => void;

  constructor(scene: Phaser.Scene, onDismiss: () => void) {
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;
    super(scene, centerX, centerY);

    this.onDismiss = onDismiss;

    const panelWidth = 340;
    const panelHeight = 480;

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(-centerX, -centerY, scene.cameras.main.width, scene.cameras.main.height);
    this.add(overlay);

    const panel = scene.add.graphics();
    panel.fillStyle(HELP_DIALOG.BACKGROUND_COLOR, 0.95);
    panel.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, HELP_DIALOG.BORDER_RADIUS);
    this.add(panel);

    let y = -panelHeight / 2 + 30;

    const title = scene.add.text(0, y, 'WELCOME TO CHROMASK!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: HELP_DIALOG.TEXT_COLOR,
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);
    this.add(title);
    y += 35;

    const subtitle = scene.add.text(0, y, 'Platforms are solid only when\nthey match your color.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#aaaaaa',
      align: 'center',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5, 0);
    this.add(subtitle);
    y += 50;

    const controlsLabel = scene.add.text(-panelWidth / 2 + 24, y, 'CONTROLS', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#888888',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0, 0);
    this.add(controlsLabel);
    y += 22;

    const controls = [
      ['Move', 'Arrow Keys / WASD'],
      ['Jump', 'Up / W / Space'],
    ];

    controls.forEach(([action, keys]) => {
      const actionText = scene.add.text(-panelWidth / 2 + 24, y, action, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: HELP_DIALOG.TEXT_COLOR,
        resolution: window.devicePixelRatio,
      }).setOrigin(0, 0);
      this.add(actionText);

      const keysText = scene.add.text(panelWidth / 2 - 24, y, keys, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#aaaaaa',
        resolution: window.devicePixelRatio,
      }).setOrigin(1, 0);
      this.add(keysText);
      y += 20;
    });

    y += 15;

    const colorsLabel = scene.add.text(-panelWidth / 2 + 24, y, 'COLORS (hold to activate)', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#888888',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0, 0);
    this.add(colorsLabel);
    y += 22;

    const primaryColors: [string, GameColor][] = [
      ['1', GameColor.RED],
      ['2', GameColor.GREEN],
      ['3', GameColor.BLUE],
    ];

    const colorNames: Record<GameColor, string> = {
      [GameColor.NONE]: 'None',
      [GameColor.RED]: 'Red',
      [GameColor.GREEN]: 'Green',
      [GameColor.BLUE]: 'Blue',
      [GameColor.YELLOW]: 'Yellow',
      [GameColor.MAGENTA]: 'Magenta',
      [GameColor.CYAN]: 'Cyan',
      [GameColor.WHITE]: 'White',
    };

    primaryColors.forEach(([key, color]) => {
      this.addColorRow(scene, -panelWidth / 2 + 24, y, key, color, colorNames[color], panelWidth);
      y += 22;
    });

    y += 10;

    const combosLabel = scene.add.text(-panelWidth / 2 + 24, y, 'COMBINATIONS (hold multiple)', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#888888',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0, 0);
    this.add(combosLabel);
    y += 22;

    const combos: [string, GameColor][] = [
      ['1 + 2', GameColor.YELLOW],
      ['1 + 3', GameColor.MAGENTA],
      ['2 + 3', GameColor.CYAN],
      ['1 + 2 + 3', GameColor.WHITE],
    ];

    combos.forEach(([keys, color]) => {
      this.addColorRow(scene, -panelWidth / 2 + 24, y, keys, color, colorNames[color], panelWidth);
      y += 22;
    });

    y += 20;

    this.createDismissButton(scene, y);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(300);
  }

  private addColorRow(
    scene: Phaser.Scene,
    x: number,
    y: number,
    keyText: string,
    color: GameColor,
    colorName: string,
    panelWidth: number
  ): void {
    const boxSize = 14;
    const box = scene.add.graphics();
    box.fillStyle(COLOR_HEX[color], 1);
    box.fillRoundedRect(x, y + 1, boxSize, boxSize, 2);
    this.add(box);

    const keyLabel = scene.add.text(x + boxSize + 10, y, keyText, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: HELP_DIALOG.TEXT_COLOR,
      resolution: window.devicePixelRatio,
    }).setOrigin(0, 0);
    this.add(keyLabel);

    const nameLabel = scene.add.text(panelWidth / 2 - 24, y, colorName, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#aaaaaa',
      resolution: window.devicePixelRatio,
    }).setOrigin(1, 0);
    this.add(nameLabel);
  }

  private createDismissButton(scene: Phaser.Scene, y: number): void {
    const buttonWidth = 140;
    const buttonHeight = 44;

    const container = scene.add.container(0, y);

    const bg = scene.add.graphics();
    this.drawButton(bg, buttonWidth, buttonHeight, 0x4488ff, 0x66aaff, 0x2266dd);
    container.add(bg);

    const text = scene.add.text(0, 0, 'Got it!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: window.devicePixelRatio,
    }).setOrigin(0.5);
    container.add(text);

    const hitArea = new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    container.input!.cursor = 'pointer';

    container.on('pointerover', () => {
      this.drawButton(bg, buttonWidth, buttonHeight, 0x5599ff, 0x77bbff, 0x3377ee);
    });

    container.on('pointerout', () => {
      this.drawButton(bg, buttonWidth, buttonHeight, 0x4488ff, 0x66aaff, 0x2266dd);
    });

    container.on('pointerdown', () => {
      this.dismiss();
    });

    this.add(container);
  }

  private drawButton(
    graphics: Phaser.GameObjects.Graphics,
    width: number,
    height: number,
    bg: number,
    hi: number,
    sh: number
  ): void {
    const bevelSize = 3;
    graphics.clear();

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

  private dismiss(): void {
    localStorage.setItem(STORAGE.FIRST_TIME_SEEN, 'true');
    this.onDismiss();
    this.destroy();
  }

  static hasSeenTutorial(): boolean {
    return localStorage.getItem(STORAGE.FIRST_TIME_SEEN) === 'true';
  }
}
