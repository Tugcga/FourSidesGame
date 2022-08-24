import { defineQuery, defineSystem, removeComponent, addComponent, removeEntity } from "bitecs";

import { Alpha, AlphaIncrease, AlphaDecrease, Speed, Ready } from "../components";
import { get_delta_time } from "../time";

const increase_query = defineQuery([Alpha, Speed, AlphaIncrease]);
export const increase_system = defineSystem(world => {
    const entities = increase_query(world);
    for(let i = 0; i < entities.length; i++) {
        const e = entities[i];

        var alpha = Alpha.a[e];
        const alpha_limit = AlphaIncrease.limit[e];
        alpha += Speed.speed[e] * get_delta_time();
        var is_remove = false;
        if(alpha >= alpha_limit) {
            alpha = alpha_limit;
            is_remove = true;
        }

        Alpha.a[e] = alpha;

        if(is_remove) {
            // remove increase component
            removeComponent(world, AlphaIncrease, e);
            removeComponent(world, Speed, e);
            //add ready component
            addComponent(world, Ready, e);
        }
    }

    return world;
});

const decrease_query = defineQuery([Alpha, Speed, AlphaDecrease]);
export const decrease_system = defineSystem(world => {
    const entities = decrease_query(world);
    for(let i = 0; i < entities.length; i++) {
        const e = entities[i];

        var alpha = Alpha.a[e];
        const alpha_limit = AlphaDecrease.limit[e];
        alpha -= Speed.speed[e] * get_delta_time();
        var is_remove = false;
        if(alpha <= alpha_limit) {
            alpha = alpha_limit;
            is_remove = true;
        }

        Alpha.a[e] = alpha;

        if(is_remove) {
            // remove the entity
            removeEntity(world, e);
        }
    }

    return world;
});