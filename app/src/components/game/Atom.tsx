import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {unsetCompetitorAtom, unsetOwnAtom} from "../../store/gameSlice";

export function Atom(i: number, j: number, owner: boolean, disabled: boolean) {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <button className="rounded-full bg-rose-500 p-1 disabled:bg-rose-300 w-6 h-6"
                disabled={disabled}
                onClick={() => owner ? dispatch(unsetOwnAtom({x: i, y: j})) : dispatch(unsetCompetitorAtom({
                    x: i,
                    y: j
                }))}
        >

        </button>
    );
}