import { defineQuery, defineSystem, removeComponent, addComponent, Not, addEntity } from "bitecs";

import { Tile, Ready, FilterReady, AlphaIncrease, AlphaDecrease, FinishScreen } from "../components";
import { TILES_COUNT } from "../constants";
import { get_score } from "../score";

const all_tiles_query = defineQuery([Tile, Ready, Not(FilterReady), Not(AlphaIncrease), Not(AlphaDecrease)]);

export const game_over_system = defineSystem(world => {
    const all_tiles = all_tiles_query(world);

    if(all_tiles.length == TILES_COUNT*TILES_COUNT) {
        // the scene is full and all tiles wait input
        // so, the game is over
        // delete Ready tag from all tiles
        for(let i = 0; i < all_tiles.length; i++) {
            const e = all_tiles[i];
            removeComponent(world, Ready, e);
        }

        // create finish screen entity
        const entity = addEntity(world);
        addComponent(world, FinishScreen, entity);
        FinishScreen.score[entity] = get_score();

        // play the sound
        var audio = new Audio("finish_sound.ogg");
        audio.play();
    }

    return world
});