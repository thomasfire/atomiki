import {FieldData} from "../view/FieldData";

export interface GameState {
    ownerField: FieldData | null,
    competitorField: FieldData | null,
    gameStarted: boolean,
    gameFinished: boolean,
    otherStarted: boolean,
    otherFinished: boolean,
}