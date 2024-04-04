import {createSlice, Slice} from "@reduxjs/toolkit";
import {GameState} from "../types/game/page/GameState";
import {GameSettings} from "../types/transport/GameSettings";
import {FieldData} from "../types/game/view/Field";

export const gameSlice: Slice = createSlice({
    name: 'join',
    initialState: {
        ownerField: null,
        competitorField: null,
        log: null
    },
    reducers: {
        initializeGame: (state: GameState, action: {payload: GameSettings, type: string}) => {
            state.ownerField = FieldData.emptyField(action.payload);
        },
    },
})

export const { initializeGame } = gameSlice.actions

export default gameSlice.reducer