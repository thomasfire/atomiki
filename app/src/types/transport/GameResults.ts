import {Vector} from "./Vector";

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
    winner: WINNER | "OWNER" | "COMPETITOR" | "DRAW";
}

export function WinnerFromGameResults(json: GameResults): WINNER {
    const winner  = json.winner.toString() as  "OWNER" | "COMPETITOR" | "DRAW";

    return WINNER[winner];
}

