import {createSlice, Slice} from '@reduxjs/toolkit';
import {PageState} from "../types/game/page/PageState";
import {EPage} from "../types/game/page/EPage";

export const pageSlice: Slice = createSlice({
    name: 'page',
    initialState: {
        currentPage: EPage.IndexPage
    },
    reducers: {
        openPage: (state: PageState, action: {payload: EPage, type: string}) => {
            state.currentPage = action.payload;
            console.log(action.payload)
        },
    },
})

export const { openPage } = pageSlice.actions

export default pageSlice.reducer