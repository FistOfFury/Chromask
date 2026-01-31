# API Reference

Practical reference for Chromask game classes, constants, and interfaces.

For implementation details and architecture, see [SPEC.md](../SPEC.md).

---

## Constants

### GameColor Enum

```typescript
enum GameColor {
  NONE    = 0b000,  // 0
  RED     = 0b001,  // 1
  GREEN   = 0b010,  // 2
  BLUE    = 0b100,  // 4
  YELLOW  = 0b011,  // 3 (R + G)
  MAGENTA = 0b101,  // 5 (R + B)
  CYAN    = 0b110,  // 6 (G + B)
  WHITE   = 0b111,  // 7 (R + G + B)
}
```

Bitwise flags for additive color mixing. Primary colors (RED, GREEN, BLUE) are powers of 2. Secondary colors are created by OR-ing primaries together.

**Example:**
```typescript
const yellow = GameColor.RED | GameColor.GREEN;  // 0b001 | 0b010 = 0b011 = 3
```

### COLOR_NAMES

Maps `GameColor` enum values to string names for audio file keys.

```typescript
const COLOR_NAMES: Record<GameColor, string> = {
  [GameColor.NONE]: 'NONE',
  [GameColor.RED]: 'RED',
  [GameColor.GREEN]: 'GREEN',
  [GameColor.BLUE]: 'BLUE',
  [GameColor.YELLOW]: 'YELLOW',
  [GameColor.MAGENTA]: 'MAGENTA',
  [GameColor.CYAN]: 'CYAN',
  [GameColor.WHITE]: 'WHITE',
};
```

### COLOR_HEX

Maps `GameColor` enum values to hex color codes for rendering.

```typescript
const COLOR_HEX: Record<GameColor, number> = {
  [GameColor.RED]:     0xFF0044, // Bright cherry red
  [GameColor.GREEN]:   0x00FF55, // Electric green
  [GameColor.BLUE]:    0x0088FF, // Electric blue
  [GameColor.YELLOW]:  0xFFDD00, // Sunny yellow
  [GameColor.MAGENTA]: 0xFF00AA, // Hot magenta
  [GameColor.CYAN]:    0x00FFFF, // Cyan
  [GameColor.WHITE]:   0xFFFFFF, // Pure white
  [GameColor.NONE]:    0x888888, // Light gray (UI only)
};
```

### PLAYER Constants

```typescript
const PLAYER = {
  MOVE_SPEED: 300,        // Horizontal speed (pixels/second)
  JUMP_VELOCITY: -500,    // Jump velocity (negative = upward)
  GRAVITY: 800,           // Gravity acceleration (pixels/second²)
  WIDTH: 24,              // Hitbox width (Thomas Was Alone style rectangle)
  HEIGHT: 48,             // Hitbox height
};
```

### PLATFORM Constants

```typescript
const PLATFORM = {
  WIDTH: 100,             // Default platform width
  HEIGHT: 20,             // Platform height
  MIN_GAP_X: 60,          // Minimum horizontal spacing
  MAX_GAP_X: 200,         // Maximum horizontal spacing
  MIN_GAP_Y: 60,          // Minimum vertical spacing
  MAX_GAP_Y: 120,         // Maximum vertical spacing
};
```

### DIFFICULTY Constants

```typescript
const DIFFICULTY = {
  FLOOR_START_HEIGHT: 750,        // Height when forced scroll begins (~10 platforms)
  PHASE_2_HEIGHT: 1000,           // Secondary colors (Y/M/C) appear
  PHASE_3_HEIGHT: 3000,           // White platforms appear
  MAX_DIFFICULTY_HEIGHT: 8000,    // Full difficulty reached
  
  INITIAL_SCROLL_SPEED: 30,       // Starting scroll speed (px/s)
  MAX_SCROLL_SPEED: 100,          // Maximum scroll speed (px/s)
  
  EASY_PHASE_HEIGHT: 375,         // Tutorial phase duration (~5 platforms)
  EASY_PHASE_SAME_COLOR_CHANCE: 0.7,  // Probability of repeating color
  EASY_PHASE_MAX_GAP_Y: 70,       // Smaller vertical gaps in tutorial
  
  HEIGHT_PER_PLATFORM: 75,        // Average pixels per platform (for display)
};
```

### VISUAL Constants

```typescript
const VISUAL = {
  PLATFORM_INACTIVE_ALPHA: 0.3,         // Alpha for non-solid platforms
  PLATFORM_ACTIVE_ALPHA: 1.0,           // Alpha for solid platforms
  ALPHA_TRANSITION_MS: 150,             // Transition duration in ms
  SHADOW_ALPHA: 0.08,                   // Shadow opacity (0-1)
  SHADOW_LIGHT_ANGLE: 90,               // Shadow angle in degrees (default 90° = light from top)
  SHADOW_ANGLE_MIN: 30,                 // Minimum random shadow angle
  SHADOW_ANGLE_MAX: 150,                // Maximum random shadow angle
  SHADOW_SPREAD: 15,                    // Shadow spread at the end (perspective width)
};
```

Shadow angles are randomized each game (30°-150°) to ensure the light source never comes from below. Lower angles (30°) cast shadows down-right, higher angles (150°) cast shadows down-left. 90° casts shadows straight down.

### HELP_DIALOG Constants

```typescript
const HELP_DIALOG = {
  BACKGROUND_COLOR: 0x000000,     // Dark background
  BACKGROUND_ALPHA: 0.5,          // Semi-transparent overlay
  PADDING: 24,                    // Inner padding
  BORDER_RADIUS: 12,              // Rounded corners
  TEXT_COLOR: '#ffffff',          // White text
  TITLE_FONT_SIZE: '24px',        // Title size
  BODY_FONT_SIZE: '16px',         // Body text size
  LINE_HEIGHT: 1.4,               // Text line spacing
};
```

### AUDIO Constants

```typescript
const AUDIO = {
  KEYS: {
    JUMP: ['sfx-jump', 'sfx-jump-yahhh', 'sfx-jump-whooo', 'sfx-jump-yipi'],
    PLATFORM_HIT: 'sfx-platform-hit',  // Suffixed with color name
    GAME_START: 'sfx-game-start',
    GAME_OVER: 'sfx-game-over',
    BRUH: ['sfx-bruh1', 'sfx-bruh2', 'sfx-bruh3'],
    WARNING: 'sfx-warning',
  },
  FILES: {
    // Maps sound keys to file paths (relative to public/)
    'sfx-jump': 'assets/sounds/SFX JUMP.wav',
    'sfx-platform-hit-RED': 'assets/sounds/SFX PF HIT - RED.wav',
    // ... etc for all sound files
  },
  CONFIG: {
    WARNING_COOLDOWN_MS: 3000,     // Minimum time between warnings
    WARNING_IDLE_TIME_MS: 2000,    // Idle time before warning triggers
    WARNING_ZONE_PERCENT: 0.2,     // Bottom 20% of screen
    NEAR_MISS_THRESHOLD: 50,       // Pixels from death line
    BRUH_COOLDOWN_MS: 2000,        // Minimum time between BRUH sounds
  },
};
```

### STORAGE Constants

```typescript
const STORAGE = {
  SELECTED_CHARACTER_INDEX: 'chromask_selected_character',  // localStorage key for character selection
};
```

Character selection is persisted to localStorage and restored when the game starts. Players can switch characters before their first jump using TAB, and the selection will be remembered after game over.

```typescript
// On game start, load saved character index
const saved = localStorage.getItem(STORAGE.SELECTED_CHARACTER_INDEX);
const index = saved ? parseInt(saved, 10) : 0;

// When switching or dying, save current selection
localStorage.setItem(STORAGE.SELECTED_CHARACTER_INDEX, currentIndex.toString());
```

### CHARACTER Constants

```typescript
const CHARACTER = {
  RUNNER: {
    id: 'runner',
    name: 'Runner',
    texture: 'player-sprite',
    scale: 1.5,
    hasAnimations: true,
    hasEyes: false,
    hitbox: { width: 24, height: 32, offsetX: 4, offsetY: 0 },
    colorSwap: { keyHue: 230, hueRange: 30 },  // Blue mask
  },
  CLASSIC: {
    id: 'classic',
    name: 'Classic',
    texture: 'player',
    scale: 1,
    hasAnimations: false,
    hasEyes: true,
    hitbox: { width: 24, height: 48, offsetX: 0, offsetY: 0 },
    colorSwap: { keyHue: 252, hueRange: 30 },  // Purple body
  },
  CAT: {
    id: 'cat',
    name: 'Cat',
    texture: 'cat-sprite',
    scale: 1.5,
    hasAnimations: true,
    hasEyes: false,
    hitbox: { width: 24, height: 20, offsetX: 4, offsetY: 8 },
    colorSwap: { keyHue: 38, hueRange: 30 },  // Orange fur
  },
};

const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  CHARACTER.RUNNER,
  CHARACTER.CLASSIC,
  CHARACTER.CAT,
];
```

---

## Classes

### ColorSystem

Manages player's active color state and platform matching logic.

#### Methods

**`setColors(red: boolean, green: boolean, blue: boolean): void`**

Set which color components are active.

```typescript
colorSystem.setColors(true, true, false);  // Yellow (R + G)
```

**`getActiveColor(): GameColor`**

Returns the combined color from active components.

```typescript
const color = colorSystem.getActiveColor();  // GameColor.YELLOW
```

**`isColorActive(platformColor: GameColor): boolean`**

Check if platform color exactly matches active color.

```typescript
if (colorSystem.isColorActive(platform.platformColor)) {
  // Platform is solid
}
```

**`reset(): void`**

Disable all colors (returns to NONE).

---

### VISUAL Constants

```typescript
const VISUAL = {
  PLATFORM_INACTIVE_ALPHA: 0.3,         // Alpha for non-solid platforms
  PLATFORM_ACTIVE_ALPHA: 1.0,           // Alpha for solid platforms
  ALPHA_TRANSITION_MS: 150,             // Transition duration in ms
  SHADOW_ALPHA: 0.08,                   // Shadow opacity (0-1)
  SHADOW_LIGHT_ANGLE: 90,               // Shadow angle in degrees (default 90° = light from top)
  SHADOW_ANGLE_MIN: 30,                 // Minimum random shadow angle
  SHADOW_ANGLE_MAX: 150,                // Maximum random shadow angle
  SHADOW_SPREAD: 15,                    // Shadow spread at the end (perspective width)
};
```

Shadow angles are randomized each game (30°-150°) to ensure the light source never comes from below. Lower angles (30°) cast shadows down-right, higher angles (150°) cast shadows down-left. 90° casts shadows straight down.

---

### Shadow

Thomas Was Alone style shadow - soft, elongated shadows extending from entities to bottom of screen.

#### Methods

**`update(x: number, y: number, width: number, height: number, isGrounded: boolean, cameraScrollY: number, cameraHeight: number, lightAngle?: number): void`**

Update shadow position and visibility. Shadow extends from entity to bottom of screen. Pass `isGrounded=true` to always render (player), or check grounded state for other entities. `lightAngle` defaults to `VISUAL.SHADOW_LIGHT_ANGLE`.

```typescript
// Player shadow - always render with current angle
shadow.update(this.x, this.y, width, height, true, camera.scrollY, camera.height);

// Platform shadow - only render when contacted
shadow.update(this.x, this.y, width, height, this.isContacted(), camera.scrollY, camera.height);

// Custom angle for special effects
shadow.update(this.x, this.y, width, height, true, camera.scrollY, camera.height, 45);
```

**`setDepth(depth: number): void`**

Set render depth for the shadow.

**`clear(): void`**

Clear the shadow graphics without destroying them.

**`destroy(): void`**

Clean up graphics resources.

---

### Player

Player entity with physics and movement controls. Extends `Phaser.Physics.Arcade.Sprite`.

Supports multiple characters with different textures, scales, and visual features (eyes, animations).

#### Methods

**`setCharacter(character: CharacterDefinition): void`**

Switch to a different character. Updates texture, scale, hitbox, and toggles eyes/animations.

```typescript
player.setCharacter(CHARACTER.CLASSIC);  // Switch to classic white rectangle with eyes
```

**`getCharacter(): CharacterDefinition`**

Returns the current character definition.

**`moveLeft(): void`**

Apply leftward velocity.

**`moveRight(): void`**

Apply rightward velocity.

**`stopHorizontal(): void`**

Stop horizontal movement (set velocity to 0).

**`jump(): void`**

Jump if grounded. Only works when `body.blocked.down` or `body.touching.down` is true.

**`isBelowScreen(cameraScrollY: number, cameraHeight: number): boolean`**

Check if player has fallen below visible area (game over condition).

**`setActiveColor(color: GameColor): void`**

Update the player sprite's color swap effect based on the active game color. If the character has a `colorSwap` configuration, the specified hue range in the sprite is replaced with the active color. When `GameColor.NONE`, the affected pixels become grayscale.

```typescript
player.setActiveColor(colorSystem.getActiveColor());
```

---

### Platform

Colored platform entity. Extends `Phaser.Physics.Arcade.Sprite`.

#### Properties

**`platformColor: GameColor`** (readonly)

The platform's color. Immutable after creation.

**`alwaysSolid: boolean`** (readonly)

If true, platform ignores color matching (e.g., starting floor).

#### Methods

**`setSolid(isSolid: boolean): void`**

Enable or disable collision. Updates visual alpha and border visibility. No effect if `alwaysSolid` is true or platform has been contacted.

```typescript
platform.setSolid(colorSystem.isColorActive(platform.platformColor));
```

**`updateShadow(camera?: Phaser.Cameras.Scene2D.Camera): void`**

Update shadow rendering. Shadow only renders if platform is on screen AND has been contacted (player has landed on it).

```typescript
platform.updateShadow(this.cameras.main);
```

**`markContacted(): void`**

Called when player first lands on platform. Makes platform permanently solid, removes dashed border, and enables shadow rendering.

**`isContacted(): boolean`**

Returns true if platform has been landed on (shadow will render).

---

### PlatformSpawner

Generates and manages platform lifecycle.

#### Methods

**`createInitialPlatforms(width: number, height: number): void`**

Initialize spawner and create starting floor + initial platforms.

```typescript
spawner.createInitialPlatforms(480, 720);
```

**`spawnPlatformsAbove(currentY: number): void`**

Generate platforms above current Y position to maintain spawn buffer.

```typescript
spawner.spawnPlatformsAbove(player.y);
```

**`cullPlatformsBelow(cameraScrollY: number): void`**

Remove platforms that have scrolled off-screen.

```typescript
spawner.cullPlatformsBelow(camera.scrollY);
```

**`updateDifficulty(heightClimbed: number): void`**

Adjust platform spacing based on height climbed.

```typescript
const heightClimbed = difficultyManager.getHeightClimbed(player.y);
spawner.updateDifficulty(heightClimbed);
```

**`getPlatforms(): Phaser.Physics.Arcade.StaticGroup`**

Returns the platform group for collision detection.

---

### DifficultyManager

Tracks progression and calculates difficulty parameters.

#### Methods

**`getHeightClimbed(currentY: number): number`**

Calculate total height climbed in pixels.

```typescript
const heightClimbed = difficultyManager.getHeightClimbed(player.y);
```

**`getScrollSpeed(heightClimbed: number): number`**

Calculate current forced scroll speed. Returns 0 before `FLOOR_START_HEIGHT`.

```typescript
const scrollSpeed = difficultyManager.getScrollSpeed(heightClimbed);
camera.scrollY += scrollSpeed * delta;
```

**`getPlatformHeight(pixelHeight: number): number`**

Convert pixel height to platform count for display.

```typescript
const platformCount = difficultyManager.getPlatformHeight(heightClimbed);
// Display: "Height: 10"
```

---

### AudioManager

Centralized audio system managing all game sounds and background music.

#### Constructor

```typescript
new AudioManager(scene: Phaser.Scene)
```

#### Methods

**`playJump(): void`**

Play a random jump sound from 4 available options.

```typescript
audioManager.playJump();  // Plays one of: jump, yahhh, whooo, yipi
```

**`playPlatformHit(color: GameColor): void`**

Play color-specific platform landing sound.

```typescript
audioManager.playPlatformHit(GameColor.RED);  // Plays "SFX PF HIT - RED"
```

**`playGameStart(): void`**

Play game start sound. Called when GameScene starts.

**`playGameOver(): void`**

Play game over sound. Called when player dies.

**`playBruh(): void`**

Play random BRUH sound (close call/near-miss). Has 2-second cooldown.

```typescript
// Triggered when player lands within 50px of death threshold
audioManager.playBruh();
```

**`playWarning(): void`**

Play warning sound when player is idle near screen bottom. Has 3-second cooldown.

**`stopAll(): void`**

Stop all sounds and background music. Called on game over.

---

### ColorSwapPipeline

WebGL PostFX pipeline that swaps pixels within a hue range to a target color. Used to colorize character sprites based on the active game color. Extends `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.

Registered in `PreloadScene` and applied to Player sprites via `setPostPipeline()`.

#### Properties

**`keyHue: number`** - The hue to detect (0-360 degrees).

**`keyHueRange: number`** - Detection tolerance in degrees.

**`isGrayscale: boolean`** - When true, matched pixels become grayscale instead of recolored.

#### Methods

**`setKeyHue(hue: number, range?: number): this`**

Configure which hue to detect and replace. Default range is 30 degrees.

```typescript
pipeline.setKeyHue(230, 30);  // Detect blue hues (200-260°)
```

**`setTargetColor(hexColor: number): this`**

Set the replacement color using a hex value. Disables grayscale mode.

```typescript
pipeline.setTargetColor(0xFF0044);  // Replace with red
```

**`setGrayscale(): this`**

Enable grayscale mode. Matched pixels become desaturated.

```typescript
pipeline.setGrayscale();  // For GameColor.NONE state
```

---

### HelpDialog

Displays help overlay with controls and color combinations. Extends `Phaser.GameObjects.Container`.

Shows while the `/` key is held, hidden when released.

#### Methods

**`show(): void`**

Make the dialog visible.

**`hide(): void`**

Hide the dialog.

---

### PauseMenu

In-game pause menu overlay with Continue/Settings/Exit options. Extends `Phaser.GameObjects.Container`.

Triggered by pressing ESC during gameplay. Pauses physics and game updates while visible.

#### Constructor

```typescript
new PauseMenu(scene: Phaser.Scene, onContinue: () => void, onExit: () => void)
```

#### Methods

**`show(): void`**

Display the pause menu and pause the game.

**`hide(): void`**

Hide the pause menu.

**`isVisible(): boolean`**

Returns true if the pause menu is currently displayed.

#### Buttons

| Button | State | Action |
|--------|-------|--------|
| Continue | Active | Calls `onContinue` callback, resumes game |
| Settings | Disabled | Grayed out, non-interactive (placeholder) |
| Exit | Active | Calls `onExit` callback, returns to main menu |

---

### CharacterSelector

UI component displaying the current character preview and name. Extends `Phaser.GameObjects.Container`.

Positioned in the top-left corner below the ColorIndicator. Hidden after the player's first jump.

#### Constructor

```typescript
new CharacterSelector(scene: Phaser.Scene, x: number, y: number)
```

#### Methods

**`update(characterName: string, textureKey: string): void`**

Update the displayed character preview and name.

```typescript
characterSelector.update('Classic', 'player');
```

**`hide(): void`**

Hide the character selector (called after first jump).

---

### MainMenuScene

Main menu scene with title screen and navigation options. Extends `Phaser.Scene`.

Displays the game wordmark logo and menu buttons. First scene shown after asset loading.

#### Scene Key

`'MainMenuScene'`

#### UI Elements

| Element | Description |
|---------|-------------|
| Wordmark | Game logo image (`wordmark.png`) displayed at top |
| Play Now | Active button, starts GameScene |
| Leaderboard | Disabled button (placeholder) |
| Settings | Disabled button (placeholder) |
| Footer Link | "Global Game Jam 2026" text, opens GitHub repository |

#### Button Style

Minecraft-inspired blocky buttons with 3D bevel effect:
- Active: Dark gray background (0x555555) with highlight/shadow edges
- Disabled: Lighter gray (0x888888) at 50% alpha
- Hover: Slightly lighter background on active buttons

---

### PreloadScene

Phaser scene that loads and initializes game assets. Runs before MainMenuScene.

#### Methods

**`preload(): void`**

Load game assets. Creates the 'player-sprite' spritesheet from `assets/Running.png` (128×160 px, 32×32 frame size).

```typescript
this.textures.createCanvas('player-sprite', 128, 160);
// Loads spritesheet with 4 columns × 5 rows of 32×32 frames
```

**`createAnimations(): void`**

Define sprite animations. Called after preload completes.

**Animation Keys:**

| Key | Frames | FPS | Loop | Purpose |
|-----|--------|-----|------|---------|
| `player-run` | 0-13 | 12 | Yes | Running animation |
| `player-idle` | 14-17 | 6 | Yes | Idle/standing animation |
| `player-jump` | 19 | — | No | Jump frame (single) |
| `player-fall` | 18 | — | No | Falling frame (single) |

```typescript
// Example: Play running animation
player.play('player-run');

// Example: Play jump frame
player.play('player-jump');
```

---

## Interfaces

### CharacterDefinition

Defines a playable character's visual and physics properties.

```typescript
interface CharacterDefinition {
  id: string;              // Unique identifier
  name: string;            // Display name for UI
  texture: string;         // Phaser texture key
  scale: number;           // Visual scale multiplier
  hasAnimations: boolean;  // Use animation state machine
  hasEyes: boolean;        // Add floating eye decorations
  hitbox: {
    width: number;         // Physics body width
    height: number;        // Physics body height
    offsetX: number;       // X offset from sprite origin
    offsetY: number;       // Y offset from sprite origin
  };
  colorSwap?: {            // Optional color swap shader config
    keyHue: number;        // Hue to detect (0-360 degrees)
    hueRange: number;      // Detection tolerance (+/- degrees)
  };
}
```

The `colorSwap` property enables the ColorSwapPipeline shader effect. When present, pixels within the specified hue range are dynamically recolored to match the player's active game color. This creates visual feedback linking the character to the current color state.

**Example:**
```typescript
const myCharacter: CharacterDefinition = {
  id: 'ninja',
  name: 'Ninja',
  texture: 'ninja-sprite',
  scale: 1.5,
  hasAnimations: true,
  hasEyes: false,
  hitbox: { width: 20, height: 40, offsetX: 6, offsetY: 4 },
  colorSwap: { keyHue: 200, hueRange: 25 },  // Swap blue-ish pixels
};
```

### PlatformConfig

Optional configuration for platform creation.

```typescript
interface PlatformConfig {
  width?: number;         // Custom width (default: PLATFORM.WIDTH)
  alwaysSolid?: boolean;  // Ignore color matching (default: false)
}
```

**Example:**
```typescript
// Starting floor - full width, always solid
new Platform(scene, x, y, GameColor.NONE, {
  width: 480,
  alwaysSolid: true,
});

// Narrow platform
new Platform(scene, x, y, GameColor.RED, {
  width: 60,
});
```
