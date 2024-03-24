import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import {useEffect} from "react";
import {JoinGame} from "../services/CreateGame";
import {updateCredentials} from "../store/credentialSlice";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCurrentSettings} from "../store/settingsSlice";
import {WSService} from "../services/WSService";

export function GamePage() {
    const dispatch: Dispatch<any> = useDispatch();
    const joinID = useSelector((state: GameStorage) => state.join.joinID);
    useEffect(() => {
        if (joinID) {
            JoinGame(joinID)
                .then((gameSettingsDTO: GameSettingsDTO) => {
                    console.log(gameSettingsDTO)
                    dispatch(updateCredentials(gameSettingsDTO.credentials))
                    dispatch(updateCurrentSettings(gameSettingsDTO.settings))
                    const ws_svc = new WSService(gameSettingsDTO.credentials.userId);
                });
        }
    }, [])
    return (
        <></>
    );
}