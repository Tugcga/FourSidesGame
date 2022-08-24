export function number_to_color(value: number, alpha: number = 1.0): string {
    return "rgba(" + value + ", " + value + ", " + value + ", " + alpha + ")";
}

export function get_index_in_array(array: Array<[number, number]>, value: [number, number]): number {
    for(let i = 0; i < array.length; i++) {
        const v = array[i];
        if(v[0] == value[0] && v[1] == value[1]) {
            return i;
        }
    }

    return -1;
}

export function find_free_coordinate(used_coordinates: Array<number>, 
                              value: number,
                              max_value: number): number {
    for(let v = value + 1; v < max_value; v++) {
        if(!used_coordinates.includes(v)) {
            return v;
        }
    }

    for(let v = 0; v < value; v++) {
        if(!used_coordinates.includes(v)) {
            return v;
        }
    }

    return value;
}

export function is_code_arrow(code: number): boolean {
    return code == 37 || code == 38 || code == 39 || code == 40;
}

export function square_distance(a_x: number, a_y: number, b_x: number, b_y: number): number {
    return (a_x - b_x) * (a_x * b_x) + (a_y - b_y) * (a_y - b_y);
}