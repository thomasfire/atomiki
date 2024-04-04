import {configureStore} from '@reduxjs/toolkit';
import pageReducer from "./pageSlice";
import joinReducer from "./joinSlice";
import settingsReducer from "./settingsSlice";
import credentialReducer from "./credentialSlice";
import serviceReducer from "./credentialSlice";
import gameReducer from "./gameSlice";

export default configureStore({
    reducer: {
        page: pageReducer,
        join: joinReducer,
        settings: settingsReducer,
        credential: credentialReducer,
        service: serviceReducer,
        game: gameReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["service/setWSService"],
            ignoredPaths: ["game.ownerField", "game.competitorField"]
        }
    })
});

