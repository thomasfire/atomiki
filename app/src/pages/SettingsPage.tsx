import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import React, {useEffect} from "react";
import {receiveSettings} from "../services/SettingsReceiver";
import {GameSettings} from "../types/transport/GameSettings";
import {updateAvailableSettings} from "../store/settingsSlice";
import {GameStorage} from "../types/game/GameStorage";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";
import {SettingsButton} from "../components/SettingsButton";


export function SettingsPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const availableSettings = useSelector((state: GameStorage) => state.settings.availableSettings);
    const currentSettings = useSelector((state: GameStorage) => state.settings.currentSettings);

    useEffect(() => {
        receiveSettings().then((settings: Array<GameSettings>) => dispatch(updateAvailableSettings(settings)));
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
                    <button className={`py-4 px-4 rounded h-min self-center m-1 bg-rose-500 hover:bg-rose-700
                                    col-start-1 row-start-${availableSettings.length + 1}`}
                            onClick={() => dispatch(openPage(EPage.WaitCompetitorPage))}>Start game</button>
                }
            </div>
        </div>
    );
}