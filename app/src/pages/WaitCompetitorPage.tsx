import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
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

export function WaitCompetitorPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const gameId = useSelector((state: GameStorage) => state.credential.gameID);
    const currentSettings = useSelector((state: GameStorage) => state.settings.currentSettings);
    useEffect(() => {
        CreateGame()
            .then((credentials: CredentialDTO) => {
                console.log(credentials)
                dispatch(updateCredentials(credentials))
                currentSettings && setSettings(currentSettings, credentials).then((settings: GameSettingsDTO) => {
                    dispatch(updateCredentials(settings.credentials))
                    dispatch(updateCurrentSettings(settings.settings))
                });
                const ws_svc = new WSService(credentials.userId);
            });
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
        </div>
    );
}