import Phaser from 'phaser';
import { Platform, PlatformConfig } from '../entities/Platform';
import { GameColor, PLATFORM, DIFFICULTY, GAME, CAMERA } from '../constants';

export class PlatformSpawner {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private lastSpawnY: number;
  private lastSpawnX: number;
  private lastColor: GameColor;
  private currentMaxGapY: number;

  constructor(scene: Phaser.Scene, platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.platforms = platforms;
    this.lastSpawnY = GAME.HEIGHT - PLATFORM.HEIGHT;
    this.lastSpawnX = GAME.WIDTH / 2;
    this.lastColor = GameColor.RED;
    this.currentMaxGapY = DIFFICULTY.INITIAL_MAX_GAP_Y;
  }

  private getAvailableColors(height: number): GameColor[] {
    const absHeight = Math.abs(height);

    if (absHeight < DIFFICULTY.PHASE_2_HEIGHT) {
      return [GameColor.RED, GameColor.GREEN, GameColor.BLUE];
    } else if (absHeight < DIFFICULTY.PHASE_3_HEIGHT) {
      return [
        GameColor.RED,
        GameColor.GREEN,
        GameColor.BLUE,
        GameColor.YELLOW,
        GameColor.MAGENTA,
        GameColor.CYAN,
      ];
    } else {
      return [
        GameColor.RED,
        GameColor.GREEN,
        GameColor.BLUE,
        GameColor.YELLOW,
        GameColor.MAGENTA,
        GameColor.CYAN,
        GameColor.WHITE,
      ];
    }
  }

  private createPlatform(x: number, y: number, color: GameColor, config?: PlatformConfig): Platform {
    const platform = new Platform(this.scene, x, y, color, config);
    this.platforms.add(platform);
    return platform;
  }

  private isEasyPhase(y: number): boolean {
    const heightFromStart = GAME.HEIGHT - 100 - y;
    return heightFromStart < DIFFICULTY.EASY_PHASE_HEIGHT;
  }

  private pickColor(y: number): GameColor {
    const colors = this.getAvailableColors(y);
    
    if (this.isEasyPhase(y) && Math.random() < DIFFICULTY.EASY_PHASE_SAME_COLOR_CHANCE) {
      if (colors.includes(this.lastColor)) {
        return this.lastColor;
      }
    }
    
    return Phaser.Math.RND.pick(colors);
  }

  private pickX(y: number): number {
    const margin = PLATFORM.WIDTH / 2 + 10;
    
    if (this.isEasyPhase(y)) {
      const minX = Math.max(margin, this.lastSpawnX - DIFFICULTY.EASY_PHASE_MAX_X_DRIFT);
      const maxX = Math.min(GAME.WIDTH - margin, this.lastSpawnX + DIFFICULTY.EASY_PHASE_MAX_X_DRIFT);
      return Phaser.Math.Between(minX, maxX);
    }
    
    return Phaser.Math.Between(margin, GAME.WIDTH - margin);
  }

  private getMaxGapY(y: number): number {
    if (this.isEasyPhase(y)) {
      return DIFFICULTY.EASY_PHASE_MAX_GAP_Y;
    }
    return this.currentMaxGapY;
  }

  spawnPlatformsAbove(currentY: number): void {
    const spawnUntil = currentY - CAMERA.SPAWN_AHEAD;

    while (this.lastSpawnY > spawnUntil) {
      const maxGap = this.getMaxGapY(this.lastSpawnY);
      const gapY = Phaser.Math.Between(PLATFORM.MIN_GAP_Y, maxGap);
      this.lastSpawnY -= gapY;

      const x = this.pickX(this.lastSpawnY);
      const color = this.pickColor(this.lastSpawnY);

      this.createPlatform(x, this.lastSpawnY, color);
      
      this.lastSpawnX = x;
      this.lastColor = color;
    }
  }

  cullPlatformsBelow(cameraScrollY: number): void {
    const cullY = cameraScrollY + GAME.HEIGHT + CAMERA.CULL_BEHIND;

    this.platforms.getChildren().forEach((child) => {
      const platform = child as Platform;
      if (platform.y > cullY) {
        platform.destroy();
      }
    });
  }

  updateDifficulty(heightClimbed: number): void {
    const progress = Math.min(heightClimbed / DIFFICULTY.MAX_DIFFICULTY_HEIGHT, 1);

    this.currentMaxGapY = Phaser.Math.Linear(
      DIFFICULTY.INITIAL_MAX_GAP_Y,
      DIFFICULTY.FINAL_MAX_GAP_Y,
      progress
    );
  }

  createInitialPlatforms(): void {
    this.createPlatform(GAME.WIDTH / 2, GAME.HEIGHT - PLATFORM.HEIGHT / 2, GameColor.NONE, {
      width: GAME.WIDTH,
      alwaysSolid: true,
    });
    this.spawnPlatformsAbove(GAME.HEIGHT);
  }

  getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platforms;
  }
}
