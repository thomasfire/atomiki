import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setCompetitorAtom, setOwnAtom} from "../../store/gameSlice";
import {IWSService} from "../../types/game/page/IWSService";
import {Cell} from "../../types/game/view/Cell";

export function Space(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean, wsService: IWSService | null) {
    const dispatch: Dispatch<any> = useDispatch();
    const onClick = () => {
        if (owner) {
            dispatch(setOwnAtom({x: i, y: j}));
        } else {
            wsService?.markCompetitorAtom({mark: true, coords: {x: i-1, y: j-1}})
            dispatch(setCompetitorAtom({x: i, y: j}));
        }
    }
    return (
        <button className={`p-0.5 ${cell.marked ? "bg-blue-500 disabled:bg-blue-300 rounded-full" : "bg-white disabled:bg-gray-100 rounded"} 
        border-gray-100 border-solid w-6 h-6 border-2 `}
                disabled={disabled}
                onClick={onClick}
        >
        </button>
    );
}