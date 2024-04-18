import {GameSettings} from "./GameSettings";
import {CredentialDTO} from "./CredentialDTO";
import {Status} from "./Status";
import {CompressedUserGame} from "./CompressedUserGame";
import {CompetitorMarks} from "./CompetitorMarks";

export interface OwnGameStateDTO {
    credential: CredentialDTO;
    gameSettings: GameSettings;
    ownerGame: CompressedUserGame;
    ownerMarks: CompetitorMarks;
    ownTurn: boolean;
    competitorStatus: Status;
    isOwner: boolean;
}