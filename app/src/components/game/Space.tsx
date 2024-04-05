import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setCompetitorAtom, setOwnAtom} from "../../store/gameSlice";

export function Space(i: number, j: number, owner: boolean, disabled: boolean) {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <button className="rounded p-0.5 bg-white border-gray-100 border-solid w-6 h-6 border-2 disabled:bg-gray-100"
                disabled={disabled}
                onClick={() => owner ? dispatch(setOwnAtom({x: i, y: j})) : dispatch(setCompetitorAtom({x: i, y: j}))}
        >
        </button>
    );
}