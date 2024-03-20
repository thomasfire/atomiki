import {Vector} from "./Vector";

export class Trace {
    public trace: Vector[] = [];

    public addMovement(movement: Vector): void {
        this.trace.push(movement);
    }

    public lastPoint(): Vector {
        return this.trace[this.trace.length - 1];
    }
}