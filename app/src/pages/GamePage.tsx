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
import {finishGame, initializeGame, startGame} from "../store/gameSlice";

export function GamePage() {
    const dispatch: Dispatch<any> = useDispatch();
    const joinID = useSelector((state: GameStorage) => state.join.joinID);
    const credentials = useSelector((state: GameStorage) => state.credential);
    const gameStarted = useSelector((state: GameStorage) => state.game.gameStarted);
    const gameFinished = useSelector((state: GameStorage) => state.game.gameFinished);
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
    }, []);

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <div className="row-start-1 self-center m-2">
                    <Field owner={true} key="owner_field"/>
                </div>
                <div className="row-start-2 self-center m-2">
                    <Field owner={false} key="competitor_field"/>
                </div>
                {
                    (!gameStarted || !gameFinished) &&
                    <div className="row-start-3 self-center w-full flex content-center justify-center align-middle">
                        <button className="py-3 rounded h-min self-center bg-rose-500 hover:bg-rose-700 w-full m-2"
                                onClick={() => gameStarted ? dispatch(finishGame(null)) : dispatch(startGame(null))}
                        >
                            {gameStarted ? "Finish the game" : "Start the game"}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}