import {Cell} from "../../types/game/view/Cell";

export function Trace(cell: Cell, i: number, j: number) {
    return (
        <div>
            {
                i + " " + j
            }
            {
                cell.circleNo
            }
            {cell.direction?.x}
            {cell.direction?.y}
        </div>
    );
}