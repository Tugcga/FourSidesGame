var score: number = 0;

export function score_init() {
    score = 0;
}

export function score_increase(value: number = 1) {
    score += value;
}

export function get_score(): number {
    return score;
}

