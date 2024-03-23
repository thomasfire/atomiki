import React from "react";
import { useDispatch } from 'react-redux';
import {Dispatch} from "@reduxjs/toolkit";
import {openPage} from "../store/pageSlice";
import {EPage} from "../types/game/page/EPage";

export function IndexPage() {
    const dispatch: Dispatch<any> = useDispatch();
    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <button onClick={() => dispatch(openPage(EPage.SettingsPage))}
                        className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-1
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    New game
                </button>
                <button onClick={() => dispatch(openPage(EPage.JoinPage))}
                        className="bg-red-500 hover:bg-red-700 text-white col-start-1 row-start-2
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Join existing game
                </button>
            </div>
        </div>
    );
}