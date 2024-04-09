import {createSlice, Slice} from "@reduxjs/toolkit";
import {LogState} from "../types/game/page/LogState";
import {LogEntry} from "../types/transport/LogEntry";
import {MovesLog} from "../types/transport/MovesLog";

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
        setLog: (state: LogState, action: {payload: MovesLog, type: string}) => {
            state.log = action.payload;
            state.lastMoved = action.payload.logEntries[action.payload.logEntries.length - 1].startPoint;
            state.arrivedTo = action.payload.logEntries[action.payload.logEntries.length - 1].endPoint;
        },
    },
})

export const { addToLog, setLog } = logSlice.actions

export const logReducer = logSlice.reducer;