import {Vector} from "../../transport/Vector";

export const enum CellType {
    VOID,
    ATOM,
    STREAM,
    GUN,
    TRACE,
}

export class Cell {
    cellType: CellType;
    circleNo: number | null;
    direction: Vector | null;
    marked: boolean | null;
    guessed: boolean | null;
    real: boolean | null;
    used: boolean | null;


    constructor(cellType: CellType, circleNo: number | null, direction: Vector | null, marked: boolean | null, guessed: boolean | null, real: boolean | null, used: boolean | null) {
        this.cellType = cellType;
        this.circleNo = circleNo;
        this.direction = direction;
        this.marked = marked;
        this.guessed = guessed;
        this.real = real;
        this.used = used;
    }

    public static createVoid(): Cell {
        return new Cell(CellType.VOID, null, null, false, null, null, null)
    }

    public static createAtom(): Cell {
        return new Cell(CellType.ATOM, null, null, false, null, null, null);
    }

    public static createGun(circleNo: number, direction: Vector): Cell {
        return new Cell(CellType.GUN, circleNo, direction, null, null, null, false);
    }

    public static createStream(direction: Vector): Cell {
        return new Cell(CellType.STREAM, null, direction, false, null, null, null);
    }

    public static createTrace(direction: Vector, marked: boolean | null): Cell {
        return new Cell(CellType.TRACE, null, direction, marked, null, null, null);
    }
}