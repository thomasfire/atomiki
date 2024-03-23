import {createSlice, Slice} from "@reduxjs/toolkit";
import {SettingsState} from "../types/game/page/SettingsState";
import {GameSettings} from "../types/transport/GameSettings";

export const settingsSlice: Slice = createSlice({
    name: 'settings',
    initialState: {
        availableSettings: null,
        currentSettings: null
    },
    reducers: {
        updateAvailableSettings: (state: SettingsState, action: { payload: Array<GameSettings>, type: string }) => {
            state.availableSettings = action.payload;
        },
        updateCurrentSettings: (state: SettingsState, action: { payload: GameSettings, type: string }) => {
            state.currentSettings = action.payload;
        },
    },
})

export const {updateAvailableSettings, updateCurrentSettings} = settingsSlice.actions

export default settingsSlice.reducer