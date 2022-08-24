import { IWorld, defineQuery, removeComponent, addComponent, Not, removeEntity } from "bitecs";

import { Tile, Position, Ready, Target, Speed, Acceleration, ContiniousMove, FilterReady, StartScreen, FinishScreen, AlphaIncrease, AlphaDecrease} from "./components";
import { is_code_arrow } from "./utilities";
import { add_tiles } from "./tiles";
import { score_init } from "./score";
import { TILES_COUNT, START_MOVE_SPEED, MOVE_ACCELERATION, TILE_PER_STEP } from "./constants";

const all_tiles_query = defineQuery([Tile]);
const ready_tiles_query = defineQuery([Tile, Position, Ready, Not(FilterReady), Not(AlphaIncrease), Not(AlphaDecrease)]);
const start_query = defineQuery([StartScreen]);
const finish_query = defineQuery([FinishScreen]);

export function start_moving(world: IWorld, axis: number, ready_tiles: Array<number>) {
    // at first we should form the matrix with 4-values at earch cell
    // these values define the number of tiles at the left, top, right and bottom from current
    const matrix = new Array<Array<[number, number, number, number]>>(TILES_COUNT);
    for(let i = 0; i < TILES_COUNT; i++){
        matrix[i] = new Array<[number, number, number, number]>(TILES_COUNT);
        for(let j = 0; j < TILES_COUNT; j++) {
            matrix[i][j] = [0, 0, 0, 0];
        }
    }

    // next enumerate tiles
    for(let i = 0; i < ready_tiles.length; i++) {
        const e = ready_tiles[i];
        const x = Position.x[e];  // row
        const y = Position.y[e];  // column

        // fill left
        for(let k = 0; k < y; k++) {
            matrix[x][k][2] += 1;
        }
        // top
        for(let k = 0; k < x; k++) {
            matrix[k][y][3] += 1;
        }
        // right
        for(let k = y + 1; k < TILES_COUNT; k++) {
            matrix[x][k][0] += 1;
        }
        // bottop
        for(let k = x + 1; k < TILES_COUNT; k++) {
            matrix[k][y][1] += 1;
        }
    }

    var trivial_move = true;

    for(let i = 0; i < ready_tiles.length; i++) {
        const e = ready_tiles[i];
        // for each tile entity we should calculate the target position
        // it depends on the move direction
        const x = Position.x[e];
        const y = Position.y[e];

        removeComponent(world, Ready, e);
        addComponent(world, Speed, e);
        Speed.speed[e] = START_MOVE_SPEED;
        addComponent(world, Target, e);
        const n = matrix[x][y][axis];
        addComponent(world, Acceleration, e);
        Acceleration.value[e] = MOVE_ACCELERATION;
        addComponent(world, ContiniousMove, e);
        ContiniousMove.direction[e] = axis;

        if(axis == 0) {
            Target.x[e] = x;
            Target.y[e] = n;
        }
        else if(axis == 1) {
            Target.x[e] = n;
            Target.y[e] = y;
        }
        else if(axis == 2) {
            Target.x[e] = x;
            Target.y[e] = TILES_COUNT - 1 - n;
        }
        else if(axis == 3) {
            Target.x[e] = TILES_COUNT - 1 - n;
            Target.y[e] = y;
        }

        // check is the move is trivial
        if(trivial_move){
            // compare position and target
            // if it different, then turn off the trivial move flag
            const t_x = Target.x[e];
            const t_y = Target.y[e];
            if(x != t_x || y != t_y) {
                trivial_move = false;
            }
        }
    }

    if(trivial_move) {
        // not tiles should move
        // remove all components
        for(let i = 0; i < ready_tiles.length; i++) {
            const e = ready_tiles[i];

            removeComponent(world, Speed, e);
            removeComponent(world, Target, e);
            removeComponent(world, Acceleration, e);
            removeComponent(world, ContiniousMove, e);

            addComponent(world, Ready, e);
        }

        // at the trivial move, add new tiles
        add_tiles(TILE_PER_STEP, world);
    }
    else {
        var audio = new Audio("click_sound.ogg");
        audio.play();
    }
}

export function input_keydown(code: number, world: IWorld) {
    const all_tiles = all_tiles_query(world);
    const ready_tiles = ready_tiles_query(world);
    const start = start_query(world);
    const finish = finish_query(world);

    if(finish.length > 0) {
        // there is a game over scene
        if(code == 13) {
            // delete game over entity (it should be unique)
            removeEntity(world, finish[0]);
            // remove all tiles
            for(let i = 0; i < all_tiles.length; i++) {
                const e = all_tiles[i];
                removeEntity(world, e);
            }
            // reset the score
            score_init();

            //play start sound
            var audio = new Audio("start_sound.ogg");
            audio.play();
        }
    }
    else if(start.length > 0) {
        // there is a start screen
        removeEntity(world, start[0]);

        //play start sound
        var audio = new Audio("start_sound.ogg");
        audio.play();
    }
    else{
        if(all_tiles.length == ready_tiles.length) {
            if(is_code_arrow(code)) {
                start_moving(world, code - 37, ready_tiles);
            }
        }
    }
}

export function input_keyup(code: number, world: IWorld) {
    
}