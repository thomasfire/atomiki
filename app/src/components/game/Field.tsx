import {Cell, CellType} from "../../types/game/view/Cell";
import {Atom} from "./Atom";
import {Space} from "./Space";
import {Trace} from "./Trace";
import {Gun} from "./Gun";
import {useSelector} from "react-redux";
import {GameStorage} from "../../types/game/GameStorage";


function getCell(cell: Cell, i: number, j: number, owner: boolean, disabled: boolean): JSX.Element {
    switch (cell.cellType) {
        case CellType.ATOM:
            return Atom(i, j, owner, disabled);
        case CellType.STREAM:
            return Space(i, j, owner, disabled);
        case CellType.TRACE:
            return Trace(cell, i, j, owner, disabled);
        case CellType.VOID:
            return Space(i, j, owner, disabled);
        case CellType.GUN:
            return Gun(cell, i, j, owner, disabled);
    }
    return Space(i, j, owner, disabled);
}

export function Field({owner}: { owner: boolean }) {
    const field = useSelector((state: GameStorage) => owner ? state.game.ownerField : state.game.competitorField);

    const gameStarted = useSelector((state: GameStorage) => state.game.gameStarted);
    const gameFinished = useSelector((state: GameStorage) => state.game.gameFinished);
    const disabled = owner ? (gameStarted || gameFinished) : ((!gameStarted || gameFinished));

    if (!field) return <></>;

    return (
        <table>
            <tbody>
            {
                field.cells.map((row: Array<Cell>, i: number) => {
                    return <tr key={"row_" + owner + "_" + i}>
                        {row.map((cell: Cell, j: number) => {
                            return <td className="h-6 w-6 min-w-6 max-w-6 min-h-6 max-h-6"
                                       key={"row_" + owner + " " + i + "col" + j}>
                                {getCell(cell, i, j, owner, disabled)}
                            </td>
                        })}
                    </tr>
                })
            }
            </tbody>
        </table>
    );
}