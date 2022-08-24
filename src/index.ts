import { createWorld, addEntity, addComponent, System, IWorld } from "bitecs";

import { set_time, set_delta_time } from "./time";
import { input_keydown, input_keyup } from "./input";
import { StartScreen } from "./components";
import { score_init } from "./score";
import { create_canvas_system, create_finish_screen_system, create_start_screen_system } from "./systems/canvas_system";
import { create_render_system } from "./systems/render_system";
import { increase_system, decrease_system } from "./systems/increase_decrease_system";
import { move_system } from "./systems/move_system";
import { acceleration_system } from "./systems/acceleration_system";
import { filter_system } from "./systems/filter_system";
import { continious_move_system } from "./systems/continious_move_system";
import { empty_system } from "./systems/empty_system";
import { game_over_system } from "./systems/game_over_system";

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d")!;

var current_time: number;
var world: IWorld;
const systems: Array<System> = new Array<System>(0);

window.onkeydown = (e: KeyboardEvent): any => {
    const code: number = e.keyCode;
    input_keydown(code, world);
}

window.onkeyup = (e: KeyboardEvent): any => {
    const code: number = e.keyCode;
    input_keyup(code, world);
}

function start() {
    current_time = performance.now();
    world = createWorld();
    score_init();

    const start_entity = addEntity(world);
    addComponent(world, StartScreen, start_entity);

    if(ctx){
        systems.push(increase_system);
        systems.push(decrease_system);

        systems.push(acceleration_system);

        systems.push(move_system);

        systems.push(filter_system);

        systems.push(continious_move_system);

        systems.push(empty_system);

        systems.push(game_over_system);

        // canvas system clear screen by default color
        // this system is singleton and should works everytime
        const canvas_system = create_canvas_system(ctx, canvas!.width, canvas!.height);
        systems.push(canvas_system);

        const render_system = create_render_system(ctx, canvas!.width);
        systems.push(render_system);

        const finish_screen_system = create_finish_screen_system(ctx, canvas!.width, canvas!.height);
        systems.push(finish_screen_system);

        const start_screen_system = create_start_screen_system(ctx, canvas!.width, canvas!.height);
        systems.push(start_screen_system);
    }

    window.requestAnimationFrame(update);
}

function update() {
    if(!canvas){
        return;
    }

    const time = performance.now();
    const delta_time = time - current_time;
    current_time = time;
    set_time(current_time);
    set_delta_time(delta_time);

    for(let i = 0; i < systems.length; i++) {
        systems[i](world);
    }

    window.requestAnimationFrame(update);
}

// start the game loop
start();