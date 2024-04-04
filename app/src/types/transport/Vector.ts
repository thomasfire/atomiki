
export interface Vector {
    x: number,
    y: number
}

export function createDown(): Vector {
    return {x: 0, y: 1}
}

export function createUp(): Vector {
    return {x: 0, y: -1}
}
export function createRight(): Vector {
    return {x: 1, y: 0}
}
export function createLeft(): Vector {
    return {x: -1, y: 0}
}