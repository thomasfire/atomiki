import {createSlice, Slice} from "@reduxjs/toolkit";
import {JoinState} from "../types/game/page/JoinState";

export const joinSlice: Slice = createSlice({
    name: 'join',
    initialState: {
        joinID: ""
    },
    reducers: {
        updateJoinId: (state: JoinState, action: {payload: string, type: string}) => {
            state.joinID = action.payload;
        },
    },
})

export const { updateJoinId } = joinSlice.actions

export default joinSlice.reducer