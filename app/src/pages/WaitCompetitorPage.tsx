import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef} from "react";
import {GameStorage} from "../types/game/GameStorage";
import {Dispatch} from "@reduxjs/toolkit";
import {setSettings} from "../services/SettingsReceiver";
import {CreateGame} from "../services/CreateGame";
import {CredentialDTO} from "../types/transport/CredentialDTO";
import {updateCredentials} from "../store/credentialSlice";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCurrentSettings} from "../store/settingsSlice";
import {CopyButton} from "../components/CopyButton";
import {WSService} from "../services/WSService";
import {NOTIFICATION_TYPES} from "../types/transport/CompetitorNotificationDTO";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import {setWSService} from "../store/serviceSlice";
import {initializeGame, setTurn} from "../store/gameSlice";
import {Notification} from "../components/Notification";
import {NotificationService} from "../services/NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";

export function WaitCompetitorPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const gameId = useSelector((state: GameStorage) => state.credential.gameID);
    const currentSettings = useSelector((state: GameStorage) => state.settings.currentSettings);
    const initialized = useRef(false)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            CreateGame()
                .then((credentials: CredentialDTO) => {
                    dispatch(updateCredentials(credentials))
                    currentSettings && setSettings(currentSettings, credentials).then((settings: GameSettingsDTO) => {
                        dispatch(updateCredentials(settings.credentials))
                        dispatch(updateCurrentSettings(settings.settings))
                        dispatch(initializeGame(settings.settings));
                    });
                    const ws_svc = new WSService(credentials.userId);
                    ws_svc.subscribeToNotification("wait for competitor to join", NOTIFICATION_TYPES.COMPETITOR_JOINED, (message, payload) => {
                        dispatch(openPage(EPage.GamePage));
                        NotificationService.getInstance()?.emitNotification("Competitor joined the game", ENotificationLevel.INFO)
                    });
                    ws_svc.Subscribe(dispatch)
                    dispatch(setWSService(ws_svc));
                    dispatch(setTurn(true));
                })
                .catch(reason => {
                    NotificationService.getInstance()?.emitNotification("Error on creating the game", ENotificationLevel.ERROR)
                    console.error(reason)
                });
        }
    }, []);

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <div className="bg-white col-start-1 row-start-1 text-gray-800
                                        font-bold py-2 px-4 rounded h-min self-start m-3">
                    Share the Game ID to your competitor, so he can join the game
                </div>
                <input type="text" readOnly={true}
                       className={`py-2 px-4 rounded h-min self-center m-1 col-start-1 row-start-2 border-gray-200
                       border-solid border-2 focus-visible:border-gray-300 focus:border-gray-300 focus-visible:outline-none `}
                       value={gameId || "Loading credentials..."}/>
                <CopyButton value={gameId || ""} classes={"row-start-2"}/>
                <div className="bg-white col-start-1 row-start-3 text-gray-800
                                        font-bold py-2 px-4 rounded h-min self-start m-3">
                    Game will start as soon as competitor joins...
                </div>
            </div>
            <Notification/>
        </div>
    );
}