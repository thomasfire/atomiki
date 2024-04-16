import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setCompetitorAtom, setOwnAtom} from "../../store/gameSlice";
import {Cell} from "../../types/game/view/Cell";

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

export function Space(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean) {
    const dispatch: Dispatch<any> = useDispatch();
    const onClick = () => {
        if (owner) {
            dispatch(setOwnAtom({x: i, y: j}));
        } else {
            dispatch(setCompetitorAtom({x: i, y: j}));
        }
    }
    return (
        <button className={`p-0.5 ${color_picker(cell)} 
        border-gray-100 border-solid w-6 h-6 border-2 `}
                disabled={disabled}
                onClick={onClick}
        >
        </button>
    );
}