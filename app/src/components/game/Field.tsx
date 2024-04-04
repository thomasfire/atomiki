import {Cell, CellType} from "../../types/game/view/Cell";
import {Atom} from "./Atom";
import {Space} from "./Space";
import {Trace} from "./Trace";
import {Gun} from "./Gun";
import {useSelector} from "react-redux";
import {GameStorage} from "../../types/game/GameStorage";


function getCell(cell: Cell, i: number, j: number): JSX.Element {
    switch (cell.cellType) {
        case CellType.ATOM:
            return Atom(i, j);
        case CellType.STREAM:
            return Space(i, j);
        case CellType.TRACE:
            return Trace(cell, i, j);
        case CellType.VOID:
            return Space(i, j);
        case CellType.GUN:
            return Gun(cell, i, j);
    }
    return Space(i, j);
}

export function Field({owner}: {owner: boolean}) {
    const field = useSelector((state: GameStorage) => owner ? state.game.ownerField : state.game.competitorField);

    if (!field) return <></>;

    return (
        <div>
            <table>
                <tbody>
                {
                    field.cells.map((row: Array<Cell>, i: number) => {
                        return <tr>
                            {row.map((cell: Cell, j: number) => {
                                return <td>
                                    {getCell(cell, i, j)}
                                </td>
                            })}
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    );
}