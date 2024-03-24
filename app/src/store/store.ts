import {configureStore} from '@reduxjs/toolkit';
import pageReducer from "./pageSlice";
import joinReducer from "./joinSlice";
import settingsReducer from "./settingsSlice";
import credentialReducer from "./credentialSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        join: joinReducer,
        settings: settingsReducer,
        credential: credentialReducer
    },
});

