# Game Mechanics

## Core Concept

Chromask is an endless vertical climber inspired by Icy Tower. The player ascends an infinite tower of colored platforms while the camera continuously scrolls upward. The unique twist: platforms are only solid when they match the player's currently active color. Players must constantly switch between colors to land on the right platforms and avoid falling through mismatched ones.

The game ends when the player falls off the bottom of the screen. Success requires quick reflexes, color recognition, and strategic planning to maintain upward momentum while managing the color-switching mechanic.

As the player climbs higher, the difficulty increases through faster camera scrolling, more complex color combinations, and smaller platform sizes. The challenge lies in coordinating movement, jumping, and real-time color mixing under increasing time pressure.

## Color System

The game uses an additive RGB color mixing system. Players hold down combinations of three base color keys to create their active color:

| Keys Held | Active Color |
|-----------|--------------|
| None | None (all platforms pass-through) |
| 1 | Red |
| 2 | Green |
| 3 | Blue |
| 1+2 | Yellow |
| 1+3 | Magenta |
| 2+3 | Cyan |
| 1+2+3 | White |

The active color determines which platforms are solid. Players can change their color instantly by pressing or releasing the color keys, allowing for mid-air color switches.

## Platform Rules

Platforms follow strict color-matching rules:

- **Exact Match Required**: A platform is only solid when it exactly matches the player's active color. There is no partial matching or color similarity.
- **Non-Matching Platforms**: Platforms that don't match the active color become semi-transparent and allow the player to pass through them completely.
- **Matching Platforms**: Platforms that match the active color are fully opaque and provide solid collision for standing and jumping.

This binary solid/pass-through behavior creates the core challenge: players must constantly evaluate upcoming platforms and switch colors to match them before landing.

## Controls

| Action | Keys |
|--------|------|
| Move | Arrow keys / WASD |
| Jump | Up / W / Space |
| Hold Red | 1 |
| Hold Green | 2 |
| Hold Blue | 3 |
| Switch Character | Tab (on ground, before first jump) |
| Show Help | / (hold) |
| Pause | ESC |

Color keys can be held in any combination. Movement and jumping work independently of color selection, allowing players to move and switch colors simultaneously.

## Pause Menu

Pressing **ESC** during gameplay opens the pause menu, which freezes all game action including physics and the rising floor. The pause menu offers three options:

| Option | Description |
|--------|-------------|
| Continue | Resume gameplay from where you paused |
| Settings | (Coming soon) |
| Exit | Return to the main menu |

Press **ESC** again or click **Continue** to resume playing.

## Character Selection

Players can choose between two characters before starting their climb:

| Character | Description |
|-----------|-------------|
| **Runner** | Animated sprite with running, idle, jump, and fall animations. Default character. |
| **Classic** | White rectangle with floating eyes. Original "Thomas Was Alone" inspired design. |

Character selection is available only while standing on the starting ground platform. Press **Tab** to cycle between characters. Once the player jumps for the first time, the selection is locked and the character selector UI disappears.

Both characters have identical physics and gameplay - the choice is purely cosmetic.

## Difficulty Progression

The game increases in difficulty as the player climbs higher:

**Early Game (0-100 platforms)**
- Only primary colors appear: Red, Green, Blue
- Slow camera scroll speed
- Large, generously-sized platforms
- Ample time to react and plan color switches

**Mid Game (100-300 platforms)**
- Secondary colors introduced: Yellow, Magenta, Cyan
- Moderate camera scroll speed
- Medium-sized platforms
- Requires two-key combinations and faster decision-making

**Late Game (300+ platforms)**
- All colors including White (three-key combination)
- Fast camera scroll speed
- Small platforms with tighter spacing
- Demands mastery of all color combinations and precise timing

The scroll speed gradually increases, forcing players to climb faster and make quicker color-switching decisions to survive.

## Scoring

Score is based on the height climbed, measured in platform units. Each platform successfully reached adds to the player's score. Higher scores indicate greater mastery of the color-switching mechanic and platforming skills.

The game tracks the highest score achieved across sessions, encouraging players to improve their performance and climb higher with each attempt.

## Difficulty Levels

The game offers four difficulty levels, selectable from the main menu Settings:

### Easy
- **No rising floor** - Take your time to learn color combinations
- Smaller gaps between platforms
- Moderate color variety

### Medium (Default)
- Standard gameplay as originally designed
- Floor rises gradually as you climb higher
- Balanced color switching requirements

### Hard
- Floor rises 50% faster than normal
- Colors appear earlier in progression
- More frequent color switching required
- Recommended for experienced players

### Very Hard
- Floor rises at double speed
- 30% larger gaps between platforms
- Rapid color changes with minimal repetition
- Maximum challenge for skilled players

### Changing Difficulty

1. From the main menu, click **Settings**
2. Select your preferred difficulty level
3. Click **Close** to save your selection
4. Start a new game - difficulty cannot be changed mid-game

Your difficulty selection is saved and remembered between sessions.

## Additional Resources

For complete design specifications, technical implementation details, and development roadmap, see [GAME_DESIGN.md](../GAME_DESIGN.md).
