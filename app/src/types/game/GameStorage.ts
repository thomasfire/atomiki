import {PageState} from "./page/PageState";
import {SettingsState} from "./page/SettingsState";
import {CredentialState} from "./page/CredentialState";
import {GameState} from "./page/GameState";
import {LogState} from "./page/LogState";
import {ResultState} from "./page/ResultState";
import {NotificationState} from "./notificationState";


export interface GameStorage {
    page: PageState,
    settings: SettingsState,
    credential: CredentialState,
    game: GameState,
    log: LogState,
    results: ResultState,
    notification: NotificationState
}