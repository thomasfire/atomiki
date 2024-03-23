export interface GameSettings {
    fieldSize: number,
    atomsMaxCount: number
}

export function isEqualGameSettings(lhs: GameSettings, rhs: GameSettings) {
    return lhs.fieldSize == rhs.fieldSize && lhs.atomsMaxCount == rhs.atomsMaxCount;
}