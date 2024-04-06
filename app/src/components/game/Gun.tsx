import {Cell} from "../../types/game/view/Cell";
import {IWSService} from "../../types/game/page/IWSService";

export function Gun(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean, wsService: IWSService | null) {
    return (
        <button className="rounded-full bg-blue-200 w-6 h-6 p-1
                flex items-center justify-center font-mono disabled:bg-gray-200"
                disabled={owner || disabled}
                onClick={() => {
                    wsService?.makeMovement({
                        coords: {
                            x: i - 1, y: j - 1
                        }
                    })
                }}
        >
            {
                cell.circleNo
            }
        </button>
    );
}