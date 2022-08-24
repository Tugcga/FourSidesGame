import { defineQuery, defineSystem } from "bitecs";

import { Tile, StartScreen } from "../components";
import { TILE_PER_STEP } from "../constants";
import { add_tiles } from "../tiles";

const all_tiles_query = defineQuery([Tile]);
const start_query = defineQuery([StartScreen]);

export const empty_system = defineSystem(world => {
    const start_entities = start_query(world);
    if(start_entities.length == 0) {
        // there are no start entity, so, we are in the game
        const all_tiles = all_tiles_query(world);
        if(all_tiles.length == 0) {
            add_tiles(TILE_PER_STEP, world);
        }
    }

    return world;
});