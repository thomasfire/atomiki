import {configureStore} from '@reduxjs/toolkit';
import {pageReducer} from "./pageSlice";
import {settingsReducer} from "./settingsSlice";
import {credentialReducer} from "./credentialSlice";
import {gameReducer} from "./gameSlice";
import {logReducer} from "./logSlice";
import {resultReducer} from "./resultSlice";
import {notificationReducer} from "./notificationSlice";
import { enableMapSet } from 'immer'

{
    enableMapSet();
}


export default  configureStore({
    reducer: {
        page: pageReducer,
        settings: settingsReducer,
        credential: credentialReducer,
        game: gameReducer,
        log: logReducer,
        results: resultReducer,
        notification: notificationReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredPaths: ["game.ownerField", "game.competitorField", "service.ws_service"]
        }
    })
});

