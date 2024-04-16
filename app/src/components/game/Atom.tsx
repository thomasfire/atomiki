import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {unsetCompetitorAtom, unsetOwnAtom} from "../../store/gameSlice";
import {Cell} from "../../types/game/view/Cell";

const color_picker = (cell: Cell): string => {
    if (cell.guessed && cell.real) {
        return "bg-emerald-500 disabled:bg-emerald-300"
    } else if (cell.real && !cell.guessed) {
        return "bg-rose-500 disabled:bg-rose-300"
    } else if (cell.guessed) {
        return "bg-amber-500 disabled:bg-amber-300"
    } else if (cell.marked) {
        return "bg-blue-500 disabled:bg-blue-300"
    }
    return "bg-rose-500 disabled:bg-rose-300"
}

export function Atom(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean) {
    const dispatch: Dispatch<any> = useDispatch();
    const onClick = () => {
        if (owner)
            dispatch(unsetOwnAtom({x: i, y: j}))
        else {
            dispatch(unsetCompetitorAtom({x: i, y: j}))
        }
    };

    return (
        <button className={`rounded-full ${color_picker(cell)}  p-1  w-6 h-6 `}
                disabled={disabled}
                onClick={onClick}
        >

        </button>
    );
}