import {GameSettings} from "../types/transport/GameSettings";
import {SETTINGS_URL} from "./API";

export async function updateSettings(): Promise<Array<GameSettings>> {
    return fetch(SETTINGS_URL).then(async (value: Response) => await value.json())
}