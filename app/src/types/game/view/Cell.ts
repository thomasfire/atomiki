import {Vector} from "../../transport/Vector";

export enum CellType {
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


    constructor(cellType: CellType, circleNo: number | null, direction: Vector | null) {
        this.cellType = cellType;
        this.circleNo = circleNo;
        this.direction = direction;
    }

    public static createVoid(): Cell {
        return new Cell(CellType.VOID, null, null)
    }

    public static createAtom(): Cell {
        return new Cell(CellType.ATOM, null, null);
    }

    public static createGun(circleNo: number, direction: Vector): Cell {
        return new Cell(CellType.GUN, circleNo, direction);
    }

    public static createStream(direction: Vector): Cell {
        return new Cell(CellType.STREAM, null, direction);
    }

    public static createTrace(direction: Vector): Cell {
        return new Cell(CellType.TRACE, null, direction);
    }
}