import {updateCurrentSettings} from "../store/settingsSlice";
import {GameSettings, isEqualGameSettings} from "../types/transport/GameSettings";
import React from "react";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const buttonColors = [
    {primary: "bg-blue-500", secondary: "hover:bg-blue-700", selected: "bg-blue-200"},
    {primary: "bg-red-500", secondary: "hover:bg-red-700", selected: "bg-red-200"},
    {primary: "bg-green-500", secondary: "hover:bg-green-700", selected: "bg-green-200"},
    {primary: "bg-violet-500", secondary: "hover:bg-violet-700", selected: "bg-violet-200"},
    {primary: "bg-amber-500", secondary: "hover:bg-amber-700", selected: "bg-amber-200"},
];

export function SettingsButton({settings, index, currentSettings}: {
    settings: GameSettings,
    index: number,
    currentSettings: GameSettings | null
}) {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <button onClick={() => {
            dispatch(updateCurrentSettings(settings))
        }}
                className={`py-2 px-4 rounded h-min self-center m-1 
                                    col-start-1 row-start-${index + 1}
                                    ${buttonColors[index % buttonColors.length].secondary} 
                                    ${(currentSettings && isEqualGameSettings(currentSettings, settings)) ? buttonColors[index % buttonColors.length].selected : buttonColors[index % buttonColors.length].primary}`}>
                                <span className="mx-1 max-w-3 min-w-3 inline-block">
                                </span>
            {`${settings.atomsMaxCount} atoms, ${settings.fieldSize}x${settings.fieldSize}`}
            <span className="mx-1 max-w-3 min-w-3 inline-block">
                                     {((currentSettings && isEqualGameSettings(currentSettings, settings)) ? "✅" : " ")}
                                </span>

        </button>
    );
}