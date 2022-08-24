import { defineQuery, defineSystem, removeComponent, addComponent, IWorld, Not } from "bitecs";

import { Tile, Position, Speed, FilterReady, AlphaDecrease, ToDelete, TileType, AlphaIncrease } from "../components";
import { score_increase } from "../score";
import { TILES_COUNT, ALPHA_CHANGE_SPEED } from "../constants";

function filter_one_tile(e: number, world: IWorld) {
    addComponent(world, AlphaDecrease, e);
    AlphaDecrease.limit[e] = 0.0;
    addComponent(world, Speed, e);  // here we use speed component for change alpha
    Speed.speed[e] = ALPHA_CHANGE_SPEED;
    addComponent(world, ToDelete, e);
}

function is_all_tile_types_coincide(array: Array<number>): boolean {
    // get the type of the first tile in the row
    const t = TileType.index[array[0]];
    for(let i = 1; i < array.length; i++) {
        const ti = TileType.index[array[i]];
        if(ti != t) {
            return false;
        }
    }

    return true;
}

const all_tiles_query = defineQuery([Tile]);
const filter_query = defineQuery([Tile, TileType, Position, FilterReady, Not(AlphaIncrease)]);
export const filter_system = defineSystem(world => {
    const all_tiles = all_tiles_query(world);
    const filter_tiles = filter_query(world);

    if(all_tiles.length == filter_tiles.length) {
        // all tiles in the scene wait the filtering
        // collect entities for each row and column
        // each element of hesse arrays are array with entity ids in this row/column
        const rows = new Array<Array<number>>(TILES_COUNT);
        const columns = new Array<Array<number>>(TILES_COUNT);
        for(let i = 0; i < TILES_COUNT; i++) {
            rows[i] = new Array<number>(0);
            columns[i] = new Array<number>(0);
        }

        for(let i = 0; i < filter_tiles.length; i++) {
            const e = filter_tiles[i];

            const x = Position.x[e];
            const y = Position.y[e];

            rows[x].push(e);
            columns[y].push(e);

            // and remove FilterReady component
            removeComponent(world, FilterReady, e);
        }

        // check is row or column contains maximum tiles
        var is_play_sound = false;
        for(let i = 0; i < TILES_COUNT; i++) {
            const row = rows[i];
            const column = columns[i];
            if(row.length == TILES_COUNT) {
                if(is_all_tile_types_coincide(row)) {
                    score_increase();
                    is_play_sound = true;
                    // mark all entities with ids in the row as filtered
                    for(let j = 0; j < TILES_COUNT; j++) {
                        const e = row[j];
                        filter_one_tile(e, world);
                    }
                }
            }
            if(column.length == TILES_COUNT) {
                // the same for column
                if(is_all_tile_types_coincide(column)) {
                    score_increase();
                    is_play_sound = true;
                    for(let j = 0; j < TILES_COUNT; j++) {
                        const e = column[j];
                        filter_one_tile(e, world);
                    }
                }
            }
        }

        if(is_play_sound) {
            var audio = new Audio("release_sound.ogg");
            audio.play();
        }

    }

    return world;
});