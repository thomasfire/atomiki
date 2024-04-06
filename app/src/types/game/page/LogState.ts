import {MovesLog} from "../../transport/MovesLog";
import {Vector} from "../../transport/Vector";

export interface LogState {
    log: MovesLog,
    lastMoved: Vector | null,
    arrivedTo: Vector | null
}