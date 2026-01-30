import Phaser from 'phaser';
import { GAME } from '../constants';
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { ColorSystem } from '../systems/ColorSystem';
import { PlatformSpawner } from '../systems/PlatformSpawner';
import { DifficultyManager } from '../systems/DifficultyManager';
import { ColorIndicator } from '../ui/ColorIndicator';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private colorSystem!: ColorSystem;
  private platformSpawner!: PlatformSpawner;
  private difficultyManager!: DifficultyManager;
  private colorIndicator!: ColorIndicator;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private colorKeys!: { red: Phaser.Input.Keyboard.Key; green: Phaser.Input.Keyboard.Key; blue: Phaser.Input.Keyboard.Key };

  private highestY: number = 0;
  private forcedScrollY: number = 0;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.setupPhysicsWorld();
    this.setupInput();
    this.setupSystems();
    this.setupPlayer();
    this.setupCamera();
    this.setupUI();
    this.setupCollision();
  }

  private setupPhysicsWorld(): void {
    this.physics.world.setBounds(0, -100000, GAME.WIDTH, 200000);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.colorKeys = {
      red: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      green: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      blue: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    };

    this.input.keyboard!.addCapture('W,A,S,D,SPACE,UP,DOWN,LEFT,RIGHT,ONE,TWO,THREE');
  }

  private setupSystems(): void {
    this.colorSystem = new ColorSystem();
    this.colorSystem.toggleRed();

    this.platforms = this.physics.add.staticGroup();
    this.platformSpawner = new PlatformSpawner(this, this.platforms);
    this.platformSpawner.createInitialPlatforms();

    this.difficultyManager = new DifficultyManager(GAME.HEIGHT - 100);
  }

  private setupPlayer(): void {
    this.player = new Player(this, GAME.WIDTH / 2, GAME.HEIGHT - 100);
    this.highestY = this.player.y;
    this.forcedScrollY = this.player.y - GAME.HEIGHT / 2;
  }

  private setupCamera(): void {
    this.cameras.main.scrollY = this.player.y - GAME.HEIGHT / 2;
  }

  private setupUI(): void {
    this.colorIndicator = new ColorIndicator(this, 30, 30);

    this.scoreText = this.add.text(GAME.WIDTH - 20, 20, 'Score: 0', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    });
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);
  }

  private setupCollision(): void {
    this.physics.add.collider(this.player, this.platforms);
  }

  update(_time: number, delta: number): void {
    this.handleInput();
    this.updateColorToggles();
    this.updatePlatformSolidity();
    this.updateCamera(delta);
    this.updateSpawning();
    this.updateScore();
    this.checkDeath();
  }

  private handleInput(): void {
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
                 Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
                 Phaser.Input.Keyboard.JustDown(this.cursors.space!);

    if (left) {
      this.player.moveLeft();
    } else if (right) {
      this.player.moveRight();
    } else {
      this.player.stopHorizontal();
    }

    if (jump) {
      this.player.jump();
    }
  }

  private updateColorToggles(): void {
    if (Phaser.Input.Keyboard.JustDown(this.colorKeys.red)) {
      this.colorSystem.toggleRed();
    }
    if (Phaser.Input.Keyboard.JustDown(this.colorKeys.green)) {
      this.colorSystem.toggleGreen();
    }
    if (Phaser.Input.Keyboard.JustDown(this.colorKeys.blue)) {
      this.colorSystem.toggleBlue();
    }

    this.colorIndicator.update(this.colorSystem);
  }

  private updatePlatformSolidity(): void {
    this.platforms.getChildren().forEach((child) => {
      const platform = child as Platform;
      const isSolid = this.colorSystem.isColorActive(platform.platformColor);
      platform.setSolid(isSolid);
    });
  }

  private updateCamera(delta: number): void {
    if (this.player.y < this.highestY) {
      this.highestY = this.player.y;
    }

    const heightClimbed = this.difficultyManager.getHeightClimbed(this.highestY);
    const scrollSpeed = this.difficultyManager.getScrollSpeed(heightClimbed);
    
    this.forcedScrollY -= scrollSpeed * (delta / 1000);

    const targetScrollY = this.player.y - GAME.HEIGHT / 2;
    const ratchetedScroll = Math.min(targetScrollY, this.cameras.main.scrollY);
    const finalScroll = Math.min(ratchetedScroll, this.forcedScrollY);
    
    this.cameras.main.scrollY = finalScroll;
  }

  private updateSpawning(): void {
    const heightClimbed = this.difficultyManager.getHeightClimbed(this.highestY);
    this.platformSpawner.updateDifficulty(heightClimbed);
    this.platformSpawner.spawnPlatformsAbove(this.cameras.main.scrollY);
    this.platformSpawner.cullPlatformsBelow(this.cameras.main.scrollY);
  }

  private updateScore(): void {
    const score = Math.abs(Math.floor(this.difficultyManager.getHeightClimbed(this.highestY)));
    this.scoreText.setText(`Score: ${score}`);
  }

  private checkDeath(): void {
    if (this.player.isBelowScreen(this.cameras.main.scrollY)) {
      const score = Math.abs(Math.floor(this.difficultyManager.getHeightClimbed(this.highestY)));
      this.scene.start('GameOverScene', { score });
    }
  }
}
