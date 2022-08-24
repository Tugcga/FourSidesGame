import { defineQuery, defineSystem } from "bitecs";

import { Acceleration, Speed } from "../components";
import { get_delta_time } from "../time";

const speed_query = defineQuery([Speed, Acceleration]);
export const acceleration_system = defineSystem(world => {
    const entities = speed_query(world);
    const dt = get_delta_time();
    for(let i = 0; i < entities.length; i++) {
        const e = entities[i];

        Speed.speed[e] += Acceleration.value[e] * dt;
    }

    return world;
});