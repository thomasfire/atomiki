import {createSlice, Slice} from "@reduxjs/toolkit";
import {NotificationState} from "../types/game/notificationState";
import {ENotificationLevel} from "../types/game/ENotificationLevel";

export const notificationSlice: Slice = createSlice({
    name: 'notification',
    initialState: {
        message: null,
        level: null
    },
    reducers: {
        emitNotification: (state: NotificationState, action: {
            payload: { message: string, level: ENotificationLevel },
            type: string
        }) => {
            state.message = action.payload.message;
            state.level = action.payload.level;
        },
        removeNotification: (state: NotificationState) => {
            state.message = null;
            state.level = null;
        },
    },
})

export const {emitNotification, removeNotification} = notificationSlice.actions

export const notificationReducer = notificationSlice.reducer;