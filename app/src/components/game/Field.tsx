import {Cell, CellType} from "../../types/game/view/Cell";
import {Atom} from "./Atom";
import {Space} from "./Space";
import {Trace} from "./Trace";
import {Gun} from "./Gun";
import {Stream} from "./Stream";
import {useSelector} from "react-redux";
import {GameStorage} from "../../types/game/GameStorage";
import {FieldData} from "../../types/game/view/FieldData";
import {IWSService} from "../../types/game/page/IWSService";


function getCell(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean, wsService: IWSService | null, ownerTurn: boolean): JSX.Element {
    switch (cell.cellType) {
        case CellType.ATOM:
            return Atom(cell, i, j, owner, disabled, wsService);
        case CellType.STREAM:
            return Stream(cell);
        case CellType.TRACE:
            return Trace(cell);
        case CellType.VOID:
            return Space(cell, i, j, owner, disabled, wsService);
        case CellType.GUN:
            return Gun(cell, i, j, owner, disabled, wsService, ownerTurn);
    }
    return Space(cell, i, j, owner, disabled, wsService);
}

export function Field({owner, fieldData}: { owner: boolean, fieldData: FieldData }) {
    const gameStarted = useSelector((state: GameStorage) => state.game.gameStarted);
    const gameFinished = useSelector((state: GameStorage) => state.game.gameFinished);
    const ownerTurn = useSelector((state: GameStorage) => state.game.ownerTurn);
    const ws_service = useSelector((state: GameStorage) => state.service.ws_service);
    const disabled = owner ? (gameStarted || gameFinished) : ((!gameStarted || gameFinished));

    return (
        <table>
            <tbody>
            {
                fieldData.cells.map((row: Array<Cell>, i: number) => {
                    return <tr key={"row_" + owner + "_" + i}>
                        {row.map((cell: Cell, j: number) => {
                            return <td className="h-6 w-6 min-w-6 max-w-6 min-h-6 max-h-6"
                                       key={"row_" + owner + " " + i + "col" + j}>
                                {getCell(cell, i, j, owner, disabled, ws_service, ownerTurn)}
                            </td>
                        })}
                    </tr>
                })
            }
            </tbody>
        </table>
    );
}