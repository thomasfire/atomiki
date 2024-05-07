import React from "react";
import {useDispatch} from 'react-redux';
import {Dispatch} from "@reduxjs/toolkit";
import {setOwner} from "../store/gameSlice";
import {Notification} from "../components/Notification";
import {PageService} from "../services/PageService";

export function IndexPage() {
    const dispatch: Dispatch<any> = useDispatch();

    return (
        <div className="w-full h-full flex content-center justify-center align-middle">
            <div className="grid h-min self-center">
                <button onClick={() => {
                    PageService.getInstance()?.openSettings()
                    dispatch(setOwner(true))
                }}
                        className="bg-blue-500 hover:bg-blue-700 text-white col-start-1 row-start-1
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    New game
                </button>
                <button onClick={() => {
                    PageService.getInstance()?.openTutorial()
                }}
                        className="bg-emerald-500 hover:bg-emerald-700 text-white col-start-1 row-start-3
                        font-bold py-2 px-4 rounded h-min self-center m-1">
                    Tutorial
                </button>
            </div>
            <Notification/>
        </div>
    );
}