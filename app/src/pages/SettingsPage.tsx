import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import React, {useEffect} from "react";
import {receiveSettings} from "../services/SettingsReceiver";
import {GameSettings} from "../types/transport/GameSettings";
import {updateAvailableSettings} from "../store/settingsSlice";
import {GameStorage} from "../types/game/GameStorage";
import {SettingsButton} from "../components/SettingsButton";
import {PageService} from "../services/PageService";
import {Notification} from "../components/Notification";
import {ReturnButton} from "../components/ReturnButton";
import {NotificationService} from "../services/NotificationService";
import {ENotificationLevel} from "../types/game/ENotificationLevel";


export function SettingsPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const availableSettings = useSelector((state: GameStorage) => state.settings.availableSettings);
    const currentSettings = useSelector((state: GameStorage) => state.settings.currentSettings);

    useEffect(() => {
        receiveSettings()
            .then((settings: Array<GameSettings>) => dispatch(updateAvailableSettings(settings)))
            .catch(reason => {
                NotificationService.getInstance()?.emitNotification("Failed to receive settings", ENotificationLevel.ERROR)
                console.error(reason)
            })
    }, [])

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                {
                    availableSettings ? availableSettings.map((settings: GameSettings, index: number) =>
                            <SettingsButton currentSettings={currentSettings} settings={settings} index={index}
                                            key={"game_settings" + index}/>
                        ) :
                        (<div className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-2
                                        font-bold py-2 px-4 rounded h-min self-center m-3">
                            Loading available settings...
                        </div>)
                }
                {
                    availableSettings &&
                    <>
                        <button className={`py-4 px-4 rounded h-min self-center m-1 bg-rose-500 hover:bg-rose-700
                                    col-start-1 row-start-${availableSettings.length + 1}`}
                                onClick={() => PageService.getInstance()?.createGame(currentSettings)}>Start game
                        </button>
                        <ReturnButton index={availableSettings.length + 2}/>
                    </>
                }
            </div>
            <Notification/>
        </div>
    );
}