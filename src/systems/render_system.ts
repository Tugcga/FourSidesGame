import { defineQuery, defineSystem, Not } from "bitecs";

import { Tile, TileType, Position, Alpha } from "../components";
import { TILE_COLOR_MIN, TILE_COLOR_MAX, TILES_PROBABILITIES, TILES_COUNT, TILES_PADDING } from "../constants";
import { number_to_color } from "../utilities";

export function create_render_system(ctx: CanvasRenderingContext2D, canvas_size: number) {

    const tile_color_strings = new Array<string>(0);
    for(let i = 0; i < TILES_PROBABILITIES.length; i++) {
        const v = Math.floor(TILE_COLOR_MIN + i * (TILE_COLOR_MAX - TILE_COLOR_MIN) / (TILES_PROBABILITIES.length - 1));
        const c_string = number_to_color(v);
        tile_color_strings.push(c_string);
    }

    const tile_size: number = canvas_size / TILES_COUNT;

    // we use two queries for static tiles and tiles with alpha
    const render_query = defineQuery([Tile, TileType, Position, Not(Alpha)]);
    const alpha_render_query = defineQuery([Tile, TileType, Position, Alpha]);

    function render_tile(x: number, y: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(tile_size * y + TILES_PADDING, tile_size * x + TILES_PADDING, tile_size - 2*TILES_PADDING, tile_size - 2*TILES_PADDING);
    }

    return defineSystem(world => {
        ctx.save();
        const entities = render_query(world);
        for(let i = 0; i < entities.length; i++) {
            const e = entities[i];

            // get position
            const x = Position.x[e];
            const y = Position.y[e];

            // get tile type
            const type = TileType.index[e];

            render_tile(x, y, tile_color_strings[type - 1]);
        }

        const alpha_entities = alpha_render_query(world);
        for(let i = 0; i < alpha_entities.length; i++) {
            const e = alpha_entities[i];

            // get position
            const x = Position.x[e];
            const y = Position.y[e];

            // get tile type
            const type = TileType.index[e];
            const alpha = Alpha.a[e];
            const v = Math.floor(TILE_COLOR_MIN + (type - 1) * (TILE_COLOR_MAX - TILE_COLOR_MIN) / (TILES_PROBABILITIES.length - 1));

            render_tile(x, y, number_to_color(v, alpha));
        }

        ctx.restore();
        return world;
    });
}
