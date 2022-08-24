import { defineSystem, defineQuery } from "bitecs";

import { number_to_color } from "../utilities";
import { BACKGROUND_COLOR, FINISH_FADE_ALPHA, FINISH_TEXT_COLOR } from "../constants";
import { FinishScreen, StartScreen } from "../components";

function draw_text(ctx: CanvasRenderingContext2D, text: string, color: string, size: number, is_bold: boolean, point_x: number, point_y: number) {
    ctx.save();
    ctx.font = (is_bold ? "bold " : "normal ") + size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, point_x, point_y);
    ctx.restore();
}

export function create_canvas_system(ctx: CanvasRenderingContext2D, width: number, height: number) {
    
    const background_color_string: string = number_to_color(BACKGROUND_COLOR);

    return defineSystem(world => {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.fillStyle = background_color_string;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        return world;
    });
}

export function create_finish_screen_system(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const finish_fade_color: string = "rgba(0, 0, 0, " + String(FINISH_FADE_ALPHA) +")";
    const finish_text_color: string = number_to_color(FINISH_TEXT_COLOR);

    const finish_query = defineQuery([FinishScreen]);
    return defineSystem(world => {
        const entitites = finish_query(world);
        if(entitites.length == 1) {
            const e = entitites[0];
            // there is a finish screen entity
            ctx.save();
            ctx.fillStyle = finish_fade_color;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

            draw_text(ctx, "Score: " + FinishScreen.score[e], finish_text_color, 40, true, width / 2, height / 2 - 20);
            draw_text(ctx, "Press Enter to restart", finish_text_color, 20, false, width / 2, height / 2 + 60);
        }

        return world;
    });
}

export function create_start_screen_system(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const text_color: string = number_to_color(FINISH_TEXT_COLOR);
    const start_query = defineQuery([StartScreen]);
    return defineSystem(world => {
        const entitites = start_query(world);
        if(entitites.length == 1) {
            draw_text(ctx, "Use arrows to move tiles", text_color, 40, false, width / 2, height / 2 - 50);
            draw_text(ctx, "←    ↑   →   ↓", text_color, 36, false, width / 2, height / 2 - 10);
            draw_text(ctx, "Press any key to start", text_color, 24, false, width / 2, height / 2 + 80);
        }

        return world;
    });
}