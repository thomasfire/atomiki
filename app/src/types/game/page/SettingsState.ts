import {GameSettings} from "../../transport/GameSettings";

export interface SettingsState {
    availableSettings: Array<GameSettings> | null,
    currentSettings: GameSettings | null
}