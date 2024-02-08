/**
 * Number of flag tiles
 */
export const TILE_COUNT = 6;

/**
 * How many tiles are revealed at the start of the game
 */
export const TILES_REVEALED_AT_START = 0;

/**
 * Maximum number of attempts
 *
 * This is `TILE_COUNT` - `TILES_REVEALED_AT_START`
 */
export const MAX_ATTEMPTS = TILE_COUNT - TILES_REVEALED_AT_START;
