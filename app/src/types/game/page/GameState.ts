import {FieldData} from "../view/Field";

export interface GameState {
    ownerField: FieldData | null,
    competitorField: FieldData | null,
    gameStarted: boolean,
    gameFinished: boolean,
    otherStarted: boolean,
    otherFinished: boolean,
}