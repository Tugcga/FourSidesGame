import { defineQuery, defineSystem, removeComponent, addComponent, IWorld } from "bitecs";

import { Tile, Position, Speed, Target, FilterReady, Acceleration } from "../components";
import { get_delta_time } from "../time";

const move_query = defineQuery([Tile, Speed, Acceleration, Position, Target]);
function finish_tile_move(world: IWorld, e: number, x: number, y: number) {
    Position.x[e] = x;
    Position.y[e] = y;

    removeComponent(world, Target, e);
    removeComponent(world, Speed, e);
    removeComponent(world, Acceleration, e);
    // when the tile is moved, then we should filter it, so, add the component tag
    // this tile does not allow to move
    addComponent(world, FilterReady, e);
}

export const move_system = defineSystem(world => {
    const entities = move_query(world);
    const dt = get_delta_time();

    for(let i = 0; i < entities.length; i++) {
        const e = entities[i];

        const x = Position.x[e];
        const y = Position.y[e];

        const t_x = Target.x[e];
        const t_y = Target.y[e];
        
        const s = Speed.speed[e];

        const to_vector = [t_x - x, t_y - y];
        const length = Math.sqrt(to_vector[0] * to_vector[0] + to_vector[1] * to_vector[1]);
        if(length < 0.0001) {
            // come to the target
            finish_tile_move(world, e, t_x, t_y);
        }
        else {
            // make the move
            to_vector[0] = to_vector[0] / length;
            to_vector[1] = to_vector[1] / length;
            const new_x = x + to_vector[0] * dt * s;
            const new_y = y + to_vector[1] * dt * s;

            // check is new position jump over the target
            const new_to_vector = [t_x - new_x, t_y - new_y];
            if(to_vector[0] * new_to_vector[0] + to_vector[1] * new_to_vector[1] < 0) {
                // jump over target
                finish_tile_move(world, e, t_x, t_y);
            }
            else {
                Position.x[e] = new_x;
                Position.y[e] = new_y;
            }
        }
    }

    return world;
});
