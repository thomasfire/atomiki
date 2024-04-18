import {Status} from "./Status";
import {CompressedMovesLog} from "./CompressedMovesLog";
import {CompressedField} from "./CompressedField";
import {CompetitorMarks} from "./CompetitorMarks";

export interface CompressedUserGame {
    status: Status;
    movesLog: CompressedMovesLog;
    field: CompressedField;
    competitorMarks?: CompetitorMarks;
}