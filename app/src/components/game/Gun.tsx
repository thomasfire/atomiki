import {Cell} from "../../types/game/view/Cell";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {makeMovement} from "../../store/gameSlice";

export function Gun(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean, ownerTurn: boolean, highlighted: boolean) {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <button className={`rounded-full w-6 h-6 p-1
            flex items-center justify-center font-mono  
            ${(highlighted && !owner) ? "bg-blue-500 disabled:bg-gray-500" : "bg-blue-200 disabled:bg-gray-200"}`}
                disabled={owner || disabled || !ownerTurn || cell.used === true}
                onClick={() => {
                    dispatch(makeMovement({x: i, y: j}));
                }}
        >
            {
                cell.circleNo
            }
        </button>
    );
}