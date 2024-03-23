import {configureStore} from '@reduxjs/toolkit';
import pageReducer from "./pageSlice";
import joinReducer from "./joinSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        join: joinReducer,
    },
});

