import {GameSettings} from "../types/transport/GameSettings";
import {AVAILABLE_SETTINGS_URL, SET_URL} from "./API";
import {CredentialDTO} from "../types/transport/CredentialDTO";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";

export async function receiveSettings(): Promise<Array<GameSettings>> {
    return fetch(AVAILABLE_SETTINGS_URL).then(async (value: Response) => await value.json())
}

export async function setSettings(settings: GameSettings, credentials: CredentialDTO): Promise<GameSettingsDTO> {
    const toSend: GameSettingsDTO = {
        credentials: credentials,
        settings: settings
    };
    return fetch(SET_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend)
    }).then(async (value: Response) => await value.json())
}