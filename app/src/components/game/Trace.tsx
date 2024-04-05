import {Cell} from "../../types/game/view/Cell";

export function Trace(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean) {
    return (
        <div className={`${cell.direction?.x && "py-1"} ${cell.direction?.y && "px-1"} bg-emerald-200 rounded`}>
        </div>
    );
}