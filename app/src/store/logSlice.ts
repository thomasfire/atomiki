import {createSlice, Slice} from "@reduxjs/toolkit";
import {LogState} from "../types/game/page/LogState";
import {LogEntry} from "../types/transport/LogEntry";

export const logSlice: Slice = createSlice({
    name: 'log',
    initialState: {
        log: {
            logEntries: []
        },
        lastMoved: null,
        arrivedTo: null
    },
    reducers: {
        addToLog: (state: LogState, action: {payload: LogEntry, type: string}) => {
            state.log.logEntries.push(action.payload);
            state.lastMoved = action.payload.startPoint;
            state.arrivedTo = action.payload.endPoint;
        },
    },
})

export const { addToLog } = logSlice.actions

export const logReducer = logSlice.reducer;