import {Cell} from "../../types/game/view/Cell";
import iconRight from "../../../assets/icon-arrow-right.svg";
import iconLeft from "../../../assets/icon-arrow-left.svg";
import iconUp from "../../../assets/icon-arrow-up.svg";
import iconDown from "../../../assets/icon-arrow-down.svg";
import {Vector} from "../../types/transport/Vector";

const color_picker = (cell: Cell): string => {
    if (cell.guessed && cell.real) {
        return "bg-emerald-500 disabled:bg-emerald-300 rounded-full"
    } else if (cell.real && !cell.guessed) {
        return "bg-rose-500 disabled:bg-rose-300 rounded-full"
    } else if (cell.guessed) {
        return "bg-amber-500 disabled:bg-amber-300 rounded-full"
    } else if (cell.marked) {
        return "bg-blue-500 disabled:bg-blue-300 rounded-full"
    }
    return "bg-white disabled:bg-gray-100 rounded"
}

export function Stream(cell: Cell) {
    let icon = iconRight;
    const direction = cell.direction as Vector;
    if (direction.y == -1) icon = iconLeft;
    if (direction.x == -1) icon = iconUp;
    if (direction.x == 1) icon = iconDown;
    return (
        <div className={` p-0.5 ${color_picker(cell)} 
                border-gray-100 border-solid w-6 h-6 border-2`}>
            <img src={icon} className="stroke-red-300 fill-current text-gray-200" alt="stream"/>
        </div>
    );
}