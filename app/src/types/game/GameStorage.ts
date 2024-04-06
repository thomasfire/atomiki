import {PageState} from "./page/PageState";
import {SettingsState} from "./page/SettingsState";
import {JoinState} from "./page/JoinState";
import {CredentialState} from "./page/CredentialState";
import {ServiceState} from "./page/ServiceState";
import {GameState} from "./page/GameState";
import {LogState} from "./page/LogState";


export interface GameStorage {
    page: PageState,
    settings: SettingsState,
    join: JoinState,
    credential: CredentialState,
    service: ServiceState,
    game: GameState,
    log: LogState,
}