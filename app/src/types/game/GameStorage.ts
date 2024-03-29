import {PageState} from "./page/PageState";
import {SettingsState} from "./page/SettingsState";
import {JoinState} from "./page/JoinState";
import {CredentialState} from "./page/CredentialState";


export interface GameStorage {
    page: PageState,
    settings: SettingsState,
    join: JoinState,
    credential: CredentialState,
}