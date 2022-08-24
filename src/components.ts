import { defineComponent, Types } from "bitecs";

export const Tile = defineComponent();
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export const Alpha = defineComponent({
    a: Types.f32,
});

export const Speed = defineComponent({
    speed: Types.f32
});

export const Acceleration = defineComponent({
    value: Types.f32
});

export const AlphaIncrease = defineComponent({
    limit: Types.f32
});

export const AlphaDecrease = defineComponent({
    limit: Types.f32
});

export const TileType = defineComponent({
    index: Types.ui8
});

export const Ready = defineComponent();

export const Target = defineComponent({
    x: Types.f32,
    y: Types.f32,
});

export const FilterReady = defineComponent();

export const ToDelete = defineComponent();

export const ContiniousMove = defineComponent({
    direction: Types.ui8
});

export const StartScreen = defineComponent();

export const FinishScreen = defineComponent({
    score: Types.ui32
});