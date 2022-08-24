import { addEntity, addComponent, defineQuery, IWorld } from "bitecs";

import { Tile, TileType, Position, Alpha, AlphaIncrease, Speed, FilterReady } from "./components";
import { TILES_PROBABILITIES, TILES_COUNT, ALPHA_CHANGE_SPEED } from "./constants";
import { get_index_in_array, find_free_coordinate } from "./utilities";

const all_tiles_query = defineQuery([Tile]);

var total_prob: number = 0;
for(let i = 0; i < TILES_PROBABILITIES.length; i++) {
    total_prob += TILES_PROBABILITIES[i];
}

function generate_tile(): number {
    const tile_type = Math.random() * total_prob;
    var accum = 0.0;
    for(let i = 0; i < TILES_PROBABILITIES.length; i++) {
        accum += TILES_PROBABILITIES[i];
        if(tile_type < accum) {
            return i + 1;
        }
    }
    return TILES_PROBABILITIES.length;
}

const tiles_query = defineQuery([Tile, Position]);

function add_one_tile(world: IWorld, position: [number, number]) {
    const tile_type = generate_tile();

    const entity = addEntity(world);
    addComponent(world, Tile, entity);
    addComponent(world, TileType, entity);
    TileType.index[entity] = tile_type;
    addComponent(world, Position, entity);
    Position.x[entity] = position[0];
    Position.y[entity] = position[1];
    addComponent(world, Speed, entity);
    Speed.speed[entity] = ALPHA_CHANGE_SPEED;
    addComponent(world, Alpha, entity);
    Alpha.a[entity] = 0.0;
    addComponent(world, AlphaIncrease, entity);
    AlphaIncrease.limit[entity] = 1.0;
}

export function add_tiles(count: number, world: IWorld) {
    // find complete list of free positions in the scene
    const free_positions: Array<[number, number]> = new Array<[number, number]>(0);
    // fill this array by all values
    for(let i = 0; i < TILES_COUNT; i++) {
        for(let j = 0; j < TILES_COUNT; j++) {
            free_positions.push([i, j]);
        }
    }

    const scene_tiles = tiles_query(world);
    for(let i = 0; i < scene_tiles.length; i++) {
        const e = scene_tiles[i];
        const x = Position.x[e];
        const y = Position.y[e];
        // the scene contains tile at the position (x, y)

        // remove position from the free list
        const index = get_index_in_array(free_positions, [x, y]);
        if(index != -1) {
            free_positions.splice(index, 1);
        }
    }

    const free_count = free_positions.length;
    if(free_count <= count) {
        // if the number of free positions is less than we need, fill all free positions
        for(let i = 0; i < free_count; i++) {
            const new_position = free_positions[i];

            add_one_tile(world, new_position);
        }
    }
    else {
        const used_coordinates: Array<number> = new Array<number>(0);
        for(let i = 0; i < count; i++) {
            // generate random positions from free positions
            var c: number = Math.floor(Math.random() * free_count);
            if(used_coordinates.includes(c)) {
                // c already used, increase it until find non-used coordinate
                c = find_free_coordinate(used_coordinates, c, free_count);
            }
            used_coordinates.push(c);
            const new_position = free_positions[c];

            add_one_tile(world, new_position);
        }
    }

    // add FilterReady components to all tiles in the scene
    // then filter system will check is some should be filtered
    // but now our tiles does not have Continious Move, so, they will not be move after filtering
    const all_tiles = all_tiles_query(world);
    for(let i = 0; i < all_tiles.length; i++) {
        const e = all_tiles[i];

        addComponent(world, FilterReady, e);
    }
}