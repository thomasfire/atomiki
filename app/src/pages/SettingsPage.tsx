import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import React, {useEffect} from "react";
import {updateSettings} from "../services/SettingsReceiver";
import {GameSettings, isEqualGameSettings} from "../types/transport/GameSettings";
import {updateAvailableSettings, updateCurrentSettings} from "../store/settingsSlice";
import {GameStorage} from "../types/game/GameStorage";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";

const buttonColors = [
    {primary: "bg-blue-500", secondary: "bg-blue-700", selected: "bg-blue-200"},
    {primary: "bg-red-500", secondary: "bg-red-700", selected: "bg-red-200"},
    {primary: "bg-green-500", secondary: "bg-green-700", selected: "bg-green-200"},
    {primary: "bg-violet-500", secondary: "bg-violet-700", selected: "bg-violet-200"},
    {primary: "bg-amber-500", secondary: "bg-amber-700", selected: "bg-amber-200"},
];

export function SettingsPage() {
    const dispatch: Dispatch<any> = useDispatch();
    const availableSettings = useSelector((state: GameStorage) => state.settings.availableSettings);
    const currentSettings = useSelector((state: GameStorage) => state.settings.currentSettings);

    useEffect(() => {
        updateSettings().then((settings: Array<GameSettings>) => dispatch(updateAvailableSettings(settings)))
    }, [])

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                {
                    availableSettings ? availableSettings.map((settings: GameSettings, index: number) => (
                            <button onClick={() => {
                                dispatch(updateCurrentSettings(settings))
                            }}
                                    className={`py-2 px-4 rounded h-min self-center m-1 
                                    col-start-1 row-start-${index + 1} ${buttonColors[index % buttonColors.length].primary}
                                    hover:${buttonColors[index % buttonColors.length].secondary} 
                                    ${(currentSettings && isEqualGameSettings(currentSettings, settings)) && buttonColors[index % buttonColors.length].selected}`}>
                                <span className="mx-1 max-w-3 min-w-3 inline-block">

                                </span>
                                {`${settings.atomsMaxCount} atoms, ${settings.fieldSize}x${settings.fieldSize}`}
                                <span className="mx-1 max-w-3 min-w-3 inline-block">
                                     {((currentSettings && isEqualGameSettings(currentSettings, settings)) ? "✅" : " ")}
                                </span>

                            </button>)) :
                        (<div className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-2
                                        font-bold py-2 px-4 rounded h-min self-center m-3">
                        Loading available settings...
                        </div>)
                }
                {
                    availableSettings &&
                        <button className={`py-4 px-4 rounded h-min self-center m-1 bg-rose-500 hover:bg-rose-700
                                    col-start-1 row-start-${availableSettings.length + 1}`}
                        onClick={() => dispatch(openPage(EPage.GamePage))}>Start game</button>
                }
            </div>
        </div>
    );
}