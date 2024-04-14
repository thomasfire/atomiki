import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {GameStorage} from "../types/game/GameStorage";
import {useEffect, useRef} from "react";
import {JoinGame} from "../services/CreateGame";
import {updateCredentials} from "../store/credentialSlice";
import {GameSettingsDTO} from "../types/transport/GameSettingsDTO";
import {updateCurrentSettings} from "../store/settingsSlice";
import {WSService} from "../services/WSService";
import {setWSService} from "../store/serviceSlice";
import {Field} from "../components/game/Field";
import {initializeGame} from "../store/gameSlice";
import {LastMove} from "../components/game/LastMove";
import {Logs} from "../components/game/Logs";
import {Notification} from "../components/Notification";
import {NotificationService} from "../services/NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";

export function GamePage() {
    const dispatch: Dispatch<any> = useDispatch();
    const joinID = useSelector((state: GameStorage) => state.join.joinID);
    const credentials = useSelector((state: GameStorage) => state.credential);
    const gameStarted = useSelector((state: GameStorage) => state.game.gameStarted);
    const gameFinished = useSelector((state: GameStorage) => state.game.gameFinished);
    const isOtherStarted = useSelector((state: GameStorage) => state.game.otherStarted);
    const isOtherFinished = useSelector((state: GameStorage) => state.game.otherFinished);
    const ownField = useSelector((state: GameStorage) => state.game.ownerField);
    const competitorField = useSelector((state: GameStorage) => state.game.competitorField);
    const wsService = useSelector((state: GameStorage) => state.service.ws_service);
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            if (joinID && !credentials.userID) {
                JoinGame(joinID)
                    .then((gameSettingsDTO: GameSettingsDTO) => {
                        dispatch(updateCredentials(gameSettingsDTO.credentials))
                        dispatch(updateCurrentSettings(gameSettingsDTO.settings))
                        const ws_svc = new WSService(gameSettingsDTO.credentials.userId);
                        dispatch(setWSService(ws_svc));
                        dispatch(initializeGame(gameSettingsDTO.settings));
                        ws_svc.Subscribe(dispatch)
                    })
                    .catch(reason => {
                        NotificationService.getInstance()?.emitNotification("Error on joining the game", ENotificationLevel.ERROR)
                        console.error(reason)
                    });
            }
        }
    }, []);

    const onStartGame = () => {
        if (ownField) wsService?.setOwnAtoms(ownField.getAtoms())
    }
    const onFinishGame = () => {
        if (ownField) wsService?.finishGame()
    }

    return (
        <div className="w-full flex content-center justify-center align-middle my-4">
            <div className="grid h-min self-center my-2">
                <div className="row-start-1 self-center m-2">
                    {ownField && <Field owner={true} fieldData={ownField} key="owner_field"/>}
                </div>
                <div className="row-start-2 self-center m-2">
                    {competitorField && <LastMove key="last_move"/>}
                </div>
                <div className="row-start-3 self-center m-2">
                    {competitorField && <Field owner={false} fieldData={competitorField} key="competitor_field"/>}
                </div>
                {
                    (!gameStarted || !gameFinished) &&
                    <div className="row-start-4 self-center w-full flex content-center justify-center align-middle">
                        <button className="py-3 rounded h-min self-center bg-rose-500 hover:bg-rose-700 w-full m-2 disabled:bg-rose-300"
                                onClick={() => gameStarted ? onFinishGame() : onStartGame()}
                                disabled={(gameStarted && !isOtherStarted) || gameFinished}
                        >
                            {gameStarted ? (isOtherStarted ? "Finish the game" : "Waiting for competitor to start...") : "Start the game"}
                        </button>
                    </div>
                }
                <div className="row-start-5 self-center w-full flex content-center justify-center align-middle h-32 my-3">
                    <Logs/>
                </div>
            </div>
            <Notification/>
        </div>
    );
}