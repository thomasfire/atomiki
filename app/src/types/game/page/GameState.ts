import {FieldData} from "../view/FieldData";

export interface GameState {
    ownerField: FieldData | null,
    competitorField: FieldData | null,
    ownerTurn: boolean,
    gameStarted: boolean,
    gameFinished: boolean,
    otherStarted: boolean,
    otherFinished: boolean,
    isOwner: boolean
}