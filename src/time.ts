// we will store these values in seconds
var time: number;
var delta_time: number;

export function set_time(value: number) {
    time = value / 1000.0;
}

export function set_delta_time(value: number) {
    delta_time = value / 1000.0;
}

export function get_time(): number {
    return time;
}

export function get_delta_time(): number {
    return delta_time;
}