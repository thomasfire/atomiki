import {Cell} from "../../types/game/view/Cell";

export function Trace(cell: Cell) {
    return (
        <div className={`${cell.direction?.x && "py-2"} ${cell.direction?.y && "px-3"} bg-emerald-200 rounded-sm w-6 h-6`}>
        </div>
    );
}