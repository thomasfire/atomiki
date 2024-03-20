import {CredentialDTO} from "./CredentialDTO";
import {GameSettings} from "./GameSettings";

export interface GameSettingsDTO {
    credentials: CredentialDTO,
    settings: GameSettings
}