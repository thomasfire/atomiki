import {Cell} from "../../types/game/view/Cell";
import iconRight from "../../../assets/icon-arrow-right.svg";
import iconLeft from "../../../assets/icon-arrow-left.svg";
import iconUp from "../../../assets/icon-arrow-up.svg";
import iconDown from "../../../assets/icon-arrow-down.svg";
import {Vector} from "../../types/transport/Vector";


export function Stream(cell: Cell) {
    let icon = iconRight;
    const direction = cell.direction as Vector;
    if (direction.y == -1) icon = iconLeft;
    if (direction.x == -1) icon = iconUp;
    if (direction.x == 1) icon = iconDown;
    return (
        <div className="rounded p-0.5 bg-white border-gray-100 border-solid w-6 h-6 border-2 disabled:bg-gray-100">
            <img src={icon} className="stroke-red-300 fill-current text-gray-200"/>
        </div>
    );
}