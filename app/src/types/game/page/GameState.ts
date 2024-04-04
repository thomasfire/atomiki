import {FieldData} from "../view/Field";
import {MovesLog} from "../../transport/MovesLog";

export interface GameState {
    ownerField: FieldData | null,
    competitorField: FieldData | null,
    log: MovesLog | null
}