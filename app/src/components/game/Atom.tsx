import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {unsetCompetitorAtom, unsetOwnAtom} from "../../store/gameSlice";
import {Cell} from "../../types/game/view/Cell";
import {IWSService} from "../../types/game/page/IWSService";

export function Atom(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean, wsService: IWSService | null) {
    const dispatch: Dispatch<any> = useDispatch();
    const onClick = () => {
        if (owner)
            dispatch(unsetOwnAtom({x: i, y: j}))
        else {
            dispatch(unsetCompetitorAtom({x: i, y: j}))
            wsService?.markCompetitorAtom({mark: false, coords: {x: i-1, y: j-1}})
        }
    };
    return (
        <button className={`rounded-full ${cell.marked ? "bg-blue-500 disabled:bg-blue-300" : "bg-rose-500 disabled:bg-rose-300"}  p-1  w-6 h-6 `}
                disabled={disabled}
                onClick={onClick}
        >

        </button>
    );
}