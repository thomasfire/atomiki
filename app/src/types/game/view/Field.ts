import {Cell} from "./Cell";
import {GameSettings} from "../../transport/GameSettings";
import {createDown, createLeft, createRight, createUp} from "../../transport/Vector";

export class FieldData {
    public cells: Array<Array<Cell>>


    constructor(cells: Array<Array<Cell>>) {
        this.cells = cells;
    }

    public static emptyField(settings: GameSettings): FieldData {
        let cells: Array<Array<Cell>> = [];
        for (let i = 0; i < settings.fieldSize + 2; i++) {
            let row: Array<Cell> = [];
            for (let j = 0; j < settings.fieldSize + 2; j++) {
                row.push(Cell.createVoid());
            }
            cells.push(row);
        }
        const fieldEnd = settings.fieldSize+1;

        for (let i = 1; i < fieldEnd; i++) {
            cells[0][i] = Cell.createGun(i, createDown());
            cells[i][0] = Cell.createGun(settings.fieldSize * 4 - i, createRight());
            cells[fieldEnd][i] = Cell.createGun(settings.fieldSize * 3 - i, createUp());
            cells[i][fieldEnd] = Cell.createGun(settings.fieldSize + i, createLeft());
        }

        return new FieldData(cells)
    }


}