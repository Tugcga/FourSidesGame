
// --------Visual--------
// clear background color
export const BACKGROUND_COLOR: number = 28;

// the number of pixels in the empty tile border
export const TILES_PADDING: number = 5;

// colors of tiles with different type
export const TILE_COLOR_MIN: number = 64;
export const TILE_COLOR_MAX: number = 192;

// settings for the start and game over screen
export const FINISH_FADE_ALPHA: number = 0.5;
export const TEXT_COLOR: number = 212;

// --------Gameflow--------
// tiles move speed
export const START_MOVE_SPEED: number = 20.0;
export const MOVE_ACCELERATION: number = 40.0;

// speed for change tiles alpha (when it appears or disappears)
export const ALPHA_CHANGE_SPEED: number = 10.0;

// --------Gameplay--------
// the size of the scene (in x and y directions)
export const TILES_COUNT: number = 5;

// we use two non-empty tiles with the same probability
export const TILES_PROBABILITIES = [0.5, 1.5];

// the number of tiles to populate at each step
export const TILES_PER_STEP = 3;