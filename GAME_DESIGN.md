# MASK — Game Design & Mechanics Spec

_(Vertical endless climber, Icy Tower-style)_

## 1. Game Summary

MASK is an endless vertical climbing game.

The screen scrolls upward at an increasing speed. The player jumps between
platforms to stay above the bottom of the screen.

Each platform has a **color** and is **non-solid by default**. The player
controls which colors are currently enabled. The enabled colors mix to form the
**Active Color**.

**Only platforms whose color exactly matches the Active Color are solid.**
Jumping onto any other platform causes the player to fall through.

The game ends when the player can no longer outrun the scrolling screen.

---

## 2. Core Rules (Non-Negotiable)

### Platforms

- Each platform has:

  - A fixed color (e.g. Red, Blue, Purple, etc.)
  - No physics interaction unless active
- Platforms are always visible
- Platforms are only solid when:

  ```
  platform.color == activeColor
  ```

### Player

- Standard platformer movement (left/right + jump)
- Can toggle individual base colors ON / OFF
- Has no other abilities

### Active Color

- The Active Color is the **additive mix** of all enabled base colors
- If multiple base colors are enabled, the Active Color changes accordingly
- If no colors are enabled:

  - Active Color = NONE
  - No platforms are solid

---

## 3. Color System

### Base Colors

Initial proposal:

- Red
- Blue
- Yellow (Exact set can change if needed, but keep it small.)

### Color Mixing

Additive mixing:

- Red
- Blue
- Yellow
- Red + Blue = Purple
- Red + Yellow = Orange
- Blue + Yellow = Green
- Red + Blue + Yellow = White

Each platform is assigned **one of these final colors**, not base components.

Matching is **exact**, not partial.

Example:

- Active Color = Purple → Only Purple platforms are solid → Red or Blue
  platforms are NOT solid

---

## 4. Controls

### Movement

- Left / Right
- Jump

### Color Toggles

- One input per base color (keyboard or controller)
- Press toggles that color ON or OFF
- No cooldown
- Changes apply immediately

---

## 5. Jump & Collision Behavior

- Jumping onto a **solid** platform:

  - Normal landing
- Jumping onto a **non-solid** platform:

  - Player passes through
  - Gravity continues normally
  - No snap or forgiveness

No auto-correction. If the color is wrong, you fall.

---

## 6. Scrolling & Camera

- Camera scrolls upward continuously
- Scroll speed increases over time
- Player does NOT control camera
- Game over condition:

  - Player falls below bottom of screen

No hazards, no enemies, no sudden kill zones.

---

## 7. Difficulty Progression

### Early Game

- Slow scroll speed
- Fewer colors used
- Large, well-spaced platforms

### Mid Game

- More mixed colors
- Smaller platforms
- Faster scroll
- Requires frequent color toggling

### Late Game

- Dense color variety
- Tight jump windows
- High scroll speed
- Mistakes cascade quickly

---

## 8. Visual Rules (Important for Readability)

### Platforms

- Non-solid:

  - Semi-transparent
  - Slight desaturation or blur
- Solid:

  - Fully opaque
  - Optional outline or glow

### Player Feedback

- Player has a subtle aura matching Active Color
- UI indicator shows:

  - Which base colors are ON
  - Resulting Active Color

Color transitions should be animated (short fade), not instant pops.

---

## 9. Audio (Optional)

- Subtle sound when toggling colors
- Clear sound when landing on a solid platform
- Muffled or “empty” sound when falling through wrong color

---

## 10. Failure Behavior

- No instant death on mistakes
- Failure happens because:

  - You fell through platforms
  - You couldn’t climb fast enough
- No randomness
- Every death should be traceable to a wrong color choice or missed jump

---

## 11. Open Decisions (Please Confirm)

Engineers need answers to these **before implementation**:

1. **Exact base colors**

   - RGB or RBY?

2. **All colors OFF**

   - Is this allowed?
   - Should this be a valid (but dangerous) state?

3. **Color matching**

   - Confirm exact match only (recommended)

4. **Score**

   - Height reached?
   - Time survived?
   - Both?

5. **Target run length**

   - ~30 seconds?
   - ~2 minutes?
   - Affects scroll speed curve

---

## 12. Out of Scope (For the Jam)

- Enemies
- Power-ups
- Narrative
- Complex UI
- Tutorials beyond first-run play

---

If you want, next I can:

- Write a **1-page README.md** version
- Do **pseudocode for color matching & collision**
- Help you trim this further into a **GGJ-safe MVP**
- Or help with **art constraints** so this doesn’t balloon

This concept is solid — now it’s buildable.
