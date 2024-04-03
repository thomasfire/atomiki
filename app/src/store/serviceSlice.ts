import {createSlice, Slice} from '@reduxjs/toolkit';
import {ServiceState} from "../types/game/page/ServiceState";
import {IWSService} from "../types/game/page/IWSService";

export const serviceSlice: Slice = createSlice({
    name: 'service',
    initialState: {
        ws_service: null
    },
    reducers: {
        setWSService: (state: ServiceState, action: {payload: IWSService, type: string}) => {
            if (state.ws_service) state.ws_service.shutdown();
            state.ws_service = action.payload;
        },
    },
})

export const { setWSService } = serviceSlice.actions

export default serviceSlice.reducer