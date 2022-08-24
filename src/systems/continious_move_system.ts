import { defineQuery, defineSystem, Not } from "bitecs";

import { Tile, Target, FilterReady, ContiniousMove, ToDelete } from "../components";
import { start_moving } from "../input";

const all_tiles_query = defineQuery([Tile]);
const not_delete_query = defineQuery([Tile, ContiniousMove, Not(ToDelete), Not(Target), Not(FilterReady)]);

export const continious_move_system = defineSystem(world => {
    const all_tiles = all_tiles_query(world);
    const not_delete = not_delete_query(world);

    if(all_tiles.length > 0 && all_tiles.length == not_delete.length) {
        start_moving(world, ContiniousMove.direction[all_tiles[0]], all_tiles);
    }

    return world;
});