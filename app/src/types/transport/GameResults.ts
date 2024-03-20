import {Vector} from "./Vector";

export interface GameResults {

}

export enum WINNER {
    OWNER,
    COMPETITOR,
    DRAW
}
export interface GameResults {
    ownerAtoms: Vector[];
    competitorAtoms: Vector[];
    ownerGuessedCompetitorAtoms: Vector[];
    competitorGuessedOwnerAtoms: Vector[];
    ownerScore: number;
    competitorScore: number;
    winner: WINNER;
}

