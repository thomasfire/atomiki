import {Cell} from "../../types/game/view/Cell";

export function Gun(cell: Cell, i: number, j: number) {
    return (
        <button className="grid">
            {
                i + " " + j
            }
            {
                cell.circleNo
            }
            {cell.direction?.x}
            {cell.direction?.y}
        </button>
    );
}