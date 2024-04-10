import {Cell, CellType} from "./Cell";
import {GameSettings} from "../../transport/GameSettings";
import {createDown, createLeft, createRight, createUp, Vector} from "../../transport/Vector";
import {AtomsSetDTO} from "../../transport/AtomsSetDTO";
import {Trace} from "../../transport/Trace";
import {AtomsMarkDTO} from "../../transport/AtomsMarkDTO";

export class FieldData {
    public cells: Array<Array<Cell>>;
    private settings: GameSettings;
    private atomCounter: number


    constructor(cells: Array<Array<Cell>>, settings: GameSettings, atomCounter: number) {
        this.cells = cells;
        this.settings = settings
        this.atomCounter = atomCounter;
    }

    public static clone(otherField: FieldData): FieldData {
        return new FieldData([...otherField.cells], otherField.settings, otherField.atomCounter);
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
        const fieldEnd = settings.fieldSize + 1;

        for (let i = 1; i < fieldEnd; i++) {
            cells[0][i] = Cell.createGun(i, createDown());
            cells[i][0] = Cell.createGun(settings.fieldSize * 4 - i + 1, createRight());
            cells[fieldEnd][i] = Cell.createGun(settings.fieldSize * 3 - i + 1, createUp());
            cells[i][fieldEnd] = Cell.createGun(settings.fieldSize + i, createLeft());
        }

        return new FieldData(cells, settings, 0)
    }


    public setAtom(coords: Vector) {
        if (this.atomCounter >= this.settings.atomsMaxCount) {
            throw new Error("Reached maximum atoms number on the field")
        }

        if (
            this.cells[coords.x][coords.y].cellType != CellType.VOID ||
            this.cells[coords.x - 1][coords.y].cellType != CellType.VOID ||
            this.cells[coords.x + 1][coords.y].cellType != CellType.VOID ||
            this.cells[coords.x][coords.y - 1].cellType != CellType.VOID ||
            this.cells[coords.x][coords.y + 1].cellType != CellType.VOID
        ) {
            throw new Error("Atom collides with other atoms, fields or objects")
        }


        this.cells[coords.x][coords.y] = Cell.createAtom();

        this.cells[coords.x + 1][coords.y] = Cell.createStream(createRight());
        this.cells[coords.x - 1][coords.y] = Cell.createStream(createLeft());
        this.cells[coords.x][coords.y - 1] = Cell.createStream(createUp());
        this.cells[coords.x][coords.y + 1] = Cell.createStream(createDown());
        this.atomCounter++;
    }

    public unsetAtom(coords: Vector) {
        if (
            this.cells[coords.x][coords.y].cellType != CellType.ATOM
        ) {
            throw new Error("Couldn't unset void")
        }
        this.cells[coords.x][coords.y] = Cell.createVoid();

        this.cells[coords.x + 1][coords.y] = Cell.createVoid();
        this.cells[coords.x - 1][coords.y] = Cell.createVoid();
        this.cells[coords.x][coords.y - 1] = Cell.createVoid();
        this.cells[coords.x][coords.y + 1] = Cell.createVoid();
        this.atomCounter--;
    }

    public getAtoms(): AtomsSetDTO {
        let result: Array<Vector> = [];
        this.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.cellType == CellType.ATOM) {
                    result.push({x: i - 1, y: j - 1})
                }
            })
        })
        return {coordsList: result}
    }

    public setTrace(trace: Trace): void {
        let lastCoords = trace.trace[0];
        trace.trace.slice(1).forEach((coords: Vector) => {
            if (this.cells[coords.x + 1][coords.y + 1].cellType === CellType.VOID) {
                this.cells[coords.x + 1][coords.y + 1] = Cell.createTrace({
                    x: coords.x - lastCoords.x,
                    y: coords.y - lastCoords.y
                }, this.cells[coords.x + 1][coords.y + 1].marked);
            }
            lastCoords = coords;
        });
    }

    public removeTrace(): void {
        this.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.cellType == CellType.TRACE) {
                    this.cells[i][j] = Cell.createVoid();
                }
            })
        })
    }

    public markAtom(atomsMark: AtomsMarkDTO): void {
        this.cells[atomsMark.coords.x + 1][atomsMark.coords.y + 1].marked = atomsMark.mark;
    }

    public markGuessed(guessed: Vector[]): void {
        guessed.forEach((atom)=> {
            this.cells[atom.x][atom.y].guessed = true;
        })
    }

    public markReal(real: Vector[]): void {
        real.forEach((atom)=> {
            this.cells[atom.x][atom.y].real = true;
        })
    }

}