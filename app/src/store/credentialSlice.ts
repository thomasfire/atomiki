import {createSlice, Slice} from "@reduxjs/toolkit";
import {CredentialState} from "../types/game/page/CredentialState";
import {CredentialDTO} from "../types/transport/CredentialDTO";

export const credentialSlice: Slice = createSlice({
    name: 'credential',
    initialState: {
        gameID: null,
        userID: null,
    },
    reducers: {
        updateCredentials: (state: CredentialState, action: {payload: CredentialDTO, type: string}) => {
            state.gameID = action.payload.gameId;
            state.userID = action.payload.userId;
        },
    },
})

export const { updateCredentials } = credentialSlice.actions

export const credentialReducer = credentialSlice.reducer;