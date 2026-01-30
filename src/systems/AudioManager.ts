import Phaser from 'phaser';
import { GameColor, AUDIO, COLOR_NAMES } from '../constants';

export class AudioManager {
  private scene: Phaser.Scene;
  private backgroundMusic: Phaser.Sound.BaseSound | null = null;
  private lastBruhTime: number = 0;
  private lastWarningTime: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Play random jump sound from 4 options
  playJump(): void {
    const keys = AUDIO.KEYS.JUMP;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.scene.sound.play(randomKey);
  }

  // Play color-specific platform hit sound
  playPlatformHit(color: GameColor): void {
    if (color === GameColor.NONE) return;
    const colorName = COLOR_NAMES[color];
    const key = `${AUDIO.KEYS.PLATFORM_HIT}-${colorName}`;
    this.scene.sound.play(key);
  }

  playGameStart(): void {
    this.scene.sound.play(AUDIO.KEYS.GAME_START);
  }

  playGameOver(): void {
    this.scene.sound.play(AUDIO.KEYS.GAME_OVER);
  }

  playColorToggle(): void {
    this.scene.sound.play(AUDIO.KEYS.COLOR_TOGGLE);
  }

  // Play random BRUH sound with cooldown
  playBruh(): void {
    const now = Date.now();
    if (now - this.lastBruhTime < AUDIO.CONFIG.BRUH_COOLDOWN_MS) return;
    
    this.lastBruhTime = now;
    const keys = AUDIO.KEYS.BRUH;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.scene.sound.play(randomKey);
  }

  // Play warning sound with cooldown
  playWarning(): void {
    const now = Date.now();
    if (now - this.lastWarningTime < AUDIO.CONFIG.WARNING_COOLDOWN_MS) return;
    
    this.lastWarningTime = now;
    this.scene.sound.play(AUDIO.KEYS.WARNING);
  }

  // Start looping background music
  startBackgroundMusic(): void {
    if (this.backgroundMusic) return; // Already playing
    
    this.backgroundMusic = this.scene.sound.add(AUDIO.KEYS.MUSIC, {
      loop: true,
      rate: AUDIO.CONFIG.MUSIC_MIN_RATE,
    });
    this.backgroundMusic.play();
  }

  // Update music playback rate based on scroll speed (0-100 → 1.0-1.5)
  updateMusicRate(scrollSpeed: number): void {
    if (!this.backgroundMusic) return;
    
    const normalizedSpeed = Math.min(scrollSpeed / 100, 1);
    const rate = AUDIO.CONFIG.MUSIC_MIN_RATE + 
      (AUDIO.CONFIG.MUSIC_MAX_RATE - AUDIO.CONFIG.MUSIC_MIN_RATE) * normalizedSpeed;
    
    // Phaser BaseSound has setRate method
    (this.backgroundMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setRate(rate);
  }

  // Stop all sounds and music
  stopAll(): void {
    this.scene.sound.stopAll();
    this.backgroundMusic = null;
  }
}
