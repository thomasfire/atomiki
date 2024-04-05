import {Cell} from "../../types/game/view/Cell";

export function Gun(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean) {
    return (
        <button className="rounded-full bg-blue-200 w-6 h-6 p-1
                flex items-center justify-center font-mono disabled:bg-gray-200
                " disabled={owner || disabled}>
            {
                cell.circleNo
            }
        </button>
    );
}