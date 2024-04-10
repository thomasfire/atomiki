import {createSlice, Slice} from "@reduxjs/toolkit";
import {ResultState} from "../types/game/page/ResultState";
import {GameResults} from "../types/transport/GameResults";

export const resultlice: Slice = createSlice({
    name: 'results',
    initialState: {
        isOwner: false,
        gameResults: null
    },
    reducers: {
        setResult: (state: ResultState, action: {payload: GameResults, type: string}) => {
            state.gameResults = action.payload;
        },
    },
})

export const { setResult } = resultlice.actions

export const resultReducer = resultlice.reducer;