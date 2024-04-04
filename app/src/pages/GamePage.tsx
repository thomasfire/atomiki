import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import {useEffect} from "react";
import {JoinGame} from "../services/CreateGame";
import {updateCredentials} from "../store/credentialSlice";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCurrentSettings} from "../store/settingsSlice";
import {WSService} from "../services/WSService";
import {setWSService} from "../store/serviceSlice";
import {Field} from "../components/game/Field";
import {initializeGame} from "../store/gameSlice";

export function GamePage() {
    const dispatch: Dispatch<any> = useDispatch();
    const joinID = useSelector((state: GameStorage) => state.join.joinID);
    const credentials = useSelector((state: GameStorage) => state.credential);
    useEffect(() => {
        if (joinID && !credentials.userID) {
            JoinGame(joinID)
                .then((gameSettingsDTO: GameSettingsDTO) => {
                    console.log(gameSettingsDTO)
                    dispatch(updateCredentials(gameSettingsDTO.credentials))
                    dispatch(updateCurrentSettings(gameSettingsDTO.settings))
                    const ws_svc = new WSService(gameSettingsDTO.credentials.userId);
                    dispatch(setWSService(ws_svc));
                    dispatch(initializeGame(gameSettingsDTO.settings));
                });
        }
    }, [])
    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <Field owner={true}/>
                <Field owner={false}/>
            </div>
        </div>
    );
}